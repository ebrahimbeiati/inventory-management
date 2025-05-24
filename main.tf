resource "aws_instance" "app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  iam_instance_profile = aws_iam_instance_profile.app_profile.name
  key_name      = aws_key_pair.app_key.key_name

  user_data = file("${path.module}/cloud-init/user-data")

  tags = {
    Name = "app-server"
  }
} 