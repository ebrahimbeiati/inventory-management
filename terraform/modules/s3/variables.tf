variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project" {
  description = "Project name"
  type        = string
  default     = "inventory-management"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "container_cpu" {
  description = "CPU units for the container"
  type        = number
  default     = 512
}

variable "container_memory" {
  description = "Memory for the container in MB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Number of instances of the task to run"
  type        = number
  default     = 1
}

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 30
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of the EC2 key pair for SSH access"
  type        = string
  default     = ""
}

variable "ec2_volume_size" {
  description = "Size of the EC2 root volume in GB"
  type        = number
  default     = 8
}

variable "ec2_volume_type" {
  description = "Type of the EC2 root volume"
  type        = string
  default     = "gp3"
}

variable "enable_ec2_auto_update" {
  description = "Enable automatic updates for EC2 instance"
  type        = bool
  default     = true
}

variable "docker_compose_version" {
  description = "Version of Docker Compose to install"
  type        = string
  default     = "latest"
}

variable "aws_cli_version" {
  description = "Version of AWS CLI to install"
  type        = string
  default     = "2"
}

# ECR URIs - these will be constructed using your AWS Account ID
variable "ecr_client_image_uri" {
  description = "ECR URI for the client image (e.g., <account_id>.dkr.ecr.<region>.amazonaws.com/inventory-management-client:latest)"
  type        = string
}

variable "ecr_server_image_uri" {
  description = "ECR URI for the server image (e.g., <account_id>.dkr.ecr.<region>.amazonaws.com/inventory-management-server:latest)"
  type        = string
}

# Secrets - these should be stored in AWS Secrets Manager
variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
  sensitive   = true
}

variable "cognito_client_id" {
  description = "Cognito Client ID"
  type        = string
  sensitive   = true
}

variable "postgres_user" {
  description = "PostgreSQL username"
  type        = string
  default     = "postgres"
  sensitive   = true
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "postgres_db" {
  description = "PostgreSQL database name"
  type        = string
  default     = "inventory"
  sensitive   = true
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  # No default, must be provided
} 