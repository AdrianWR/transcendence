resource "aws_db_subnet_group" "database" {
  name       = "transcendence-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "Transcendence DB Subnet Group"
  }
}
