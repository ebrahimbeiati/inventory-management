terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Security Group
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "inventory-management-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidr
  map_public_ip_on_launch = true

  tags = {
    Name = "inventory-management-subnet"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "inventory-management-igw"
    Environment = var.environment
  }
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "inventory-management-rt"
    Environment = var.environment
  }
}

resource "aws_route_table_association" "main" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.main.id
}

resource "aws_security_group" "ec2" {
  name        = "inventory-management-sg"
  description = "Security group for inventory management application"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "inventory-management-sg"
    Environment = var.environment
  }
}

# EC2 Instance
resource "aws_instance" "app" {
  ami                    = "ami-0c7217cdde317cfec"  # Amazon Linux 2023 AMI
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
              #!/bin/bash
              # Update system
              yum update -y
              
              # Install Docker
              yum install -y docker
              systemctl start docker
              systemctl enable docker
              
              # Install Docker Compose
              curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              
              # Install Git
              yum install -y git
              
              # Create application directory
              mkdir -p /app
              cd /app
              
              # Clone repository
              git clone ${var.github_repo} .
              
              # Create .env file for server
              cat > server/.env << EOL
              PORT=80
              NODE_ENV=production
              S3_BUCKET=${aws_s3_bucket.app.id}
              DATABASE_URL="postgresql://postgres:root@localhost:5432/inventory?schema=public"
              EOL
              
              # Create .env.local for client
              cat > client/.env.local << EOL
              NEXT_PUBLIC_API_BASE_URL=http://localhost:80
              NEXT_PUBLIC_APP_URL=http://localhost:80
              EOL
              
              # Install dependencies and build client
              cd client
              npm install
              npm run build
              
              # Install dependencies and build server
              cd ../server
              npm install
              npm run build
              
              # Start application with Docker Compose
              cd ..
              docker-compose up -d
              
              # Set up automatic updates
              cat > /etc/cron.d/docker-update << EOL
              # Update Docker images and restart containers daily at 3 AM
              0 3 * * * root cd /app && git pull && cd client && npm install && npm run build && cd ../server && npm install && npm run build && cd .. && docker-compose up -d --build
              EOL
              EOF

  tags = {
    Name = "inventory-management-app"
    Environment = var.environment
  }
}

# S3 Bucket
resource "aws_s3_bucket" "app" {
  bucket = "inventory-management-files-${random_string.suffix.result}"

  tags = {
    Name = "inventory-management-files"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM Role and Policy for EC2
resource "aws_iam_role" "ec2_role" {
  name = "inventory-management-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "ec2_policy" {
  name = "inventory-management-ec2-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:GetObjectVersion",
          "s3:PutObjectAcl"
        ]
        Resource = [
          aws_s3_bucket.app.arn,
          "${aws_s3_bucket.app.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeTags",
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceStatus"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "inventory-management-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# Random string for unique bucket name
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Outputs
output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.app.id
} 