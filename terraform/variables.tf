variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "inventory-management"
}

variable "ec2_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro" # Or t2.micro if you are on the free tier and t3 is not available
}

variable "key_name" {
  description = "Name of an existing EC2 KeyPair to enable SSH access to the instance. Leave empty for no SSH access."
  type        = string
  default     = "" # Replace with your key pair name if you need SSH access, e.g., "my-ec2-key"
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

# Secrets - ideally fetched from Secrets Manager by the EC2 instance
# For simplicity in this initial setup, we can define them here, but mark as sensitive
# Or better, have user_data script fetch them from Secrets Manager

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