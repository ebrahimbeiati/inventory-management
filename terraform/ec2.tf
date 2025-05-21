# --- EC2 Instance ---
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Allow HTTP, HTTPS, App ports, and SSH (if key_name is provided)"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP inbound"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS inbound"
  }

  ingress {
    from_port   = 3001 # Client port exposed on host
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow Client App inbound"
  }

  ingress {
    from_port   = 4000 # Server port (for direct health check or access if needed)
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow Server App inbound"
  }

  dynamic "ingress" {
    for_each = var.key_name != "" ? [1] : []
    content {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
      description = "Allow SSH inbound if key_name is provided"
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = locals.tags
}

resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = var.ec2_instance_type
  key_name               = var.key_name != "" ? var.key_name : null
  iam_instance_profile = aws_iam_instance_profile.ec2_instance_profile.name
  security_groups        = [aws_security_group.ec2_sg.name]

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    aws_region             = var.aws_region
    ecr_client_image_uri = var.ecr_client_image_uri
    ecr_server_image_uri = var.ecr_server_image_uri
    postgres_user          = var.postgres_user
    # postgres_password is fetched from Secrets Manager in user_data
    postgres_db            = var.postgres_db
    aws_account_id         = data.aws_caller_identity.current.account_id # Pass AWS Account ID to user_data
  })

  tags = merge(locals.tags, {
    Name = "${var.project_name}-app-server"
  })

  # Ensure user_data script is replaced on changes
  user_data_replace_on_change = true

  # Consider root block device configuration for size and encryption
  root_block_device {
    volume_size = 20 # GB
    encrypted   = true # Recommended
  }
}

# --- Outputs ---
output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket created"
  value       = aws_s3_bucket.main.bucket
} 