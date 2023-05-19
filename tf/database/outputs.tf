output "address" {
  value = aws_db_instance.postgres.address
}

output "port" {
  value = aws_db_instance.postgres.port
}

output "username" {
  value = aws_db_instance.postgres.username
}

output "password_secret" {
  value     = aws_db_instance.postgres.master_user_secret
  sensitive = true
}
