variable "bucket_name" {
  description = "S3 bucket name for remote state"
  type        = string
}

variable "lock_table_name" {
  description = "DynamoDB table name for locking"
  type        = string
}
