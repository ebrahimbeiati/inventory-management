module "remote_backend" {
  source          = "../../modules/backend"
  bucket_name     = "terraform-state-ebrahim"
  lock_table_name = "terraform-lock-ebrahim"
}

provider "aws" {
  region = "us-east-1"
}

module "ec2_inventory" {
  source         = "../../modules/ec2"
  ami_id         = "ami-0953476d60561c955"
  instance_type  = "t2.micro"
  subnet_id      = "subnet-011bfe5bec8ca8140" # public subnet
  instance_name  = "ec2-inventorymanagement"
}
