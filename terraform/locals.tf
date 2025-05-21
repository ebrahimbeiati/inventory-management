locals {
  tags = {
    Project     = var.project_name
    Environment = "dev" # Or var.environment if you add it as a variable
    ManagedBy   = "Terraform"
  }
} 