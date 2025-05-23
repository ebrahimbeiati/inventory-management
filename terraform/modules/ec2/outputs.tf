output "ec2_security_group_id" {
  description = "Security Group ID for EC2 instances"
  value       = aws_security_group.ec2.id
}
