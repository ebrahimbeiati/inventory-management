resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${data.aws_caller_identity.current.account_id}-${var.aws_region}-data"

  tags = locals.tags
}

resource "aws_s3_bucket_ownership_controls" "main" {
  bucket = aws_s3_bucket.main.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "main" {
  bucket                  = aws_s3_bucket.main.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# To get AWS Account ID for bucket naming
data "aws_caller_identity" "current" {} 