# terraform {
#   backend "s3" {
#     bucket         = "terraform-state-ebrahim"
#     key            = "dev/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "terraform-lock-ebrahim"
#     encrypt        = true
#   }
# }
