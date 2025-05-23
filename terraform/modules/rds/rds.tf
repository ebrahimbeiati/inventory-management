resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "${var.project}-rds-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "${var.project}-rds-subnet-group"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${var.project}-rds-sg"
  description = "Allow inbound access from EC2 SG"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]  # Reference EC2 SG dynamically
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project}-rds-sg"
  }
}

resource "aws_db_instance" "postgres" {
  identifier         = "${var.project}-rds-instance"
  engine             = "postgres"
  engine_version     = "15.3"
  instance_class     = "db.t3.micro"  # Free tier eligible
  allocated_storage  = 20
  storage_type       = "gp3"
  username           = var.postgres_user
  password           = var.postgres_password
  db_name            = var.postgres_db
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot = true

  publicly_accessible = false

  multi_az           = false
  backup_retention_period = 0

  tags = {
    Name = "${var.project}-rds-instance"
  }
}
