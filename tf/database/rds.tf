resource "aws_db_instance" "postgres" {
  identifier                  = "transcendence-database"
  allocated_storage           = 10
  storage_type                = "gp2"
  engine                      = "postgres"
  instance_class              = "db.t3.micro"
  db_name                     = "transcendence"
  username                    = var.database_username
  manage_master_user_password = true
  port                        = 5432
  skip_final_snapshot         = true
  apply_immediately           = true
  db_subnet_group_name        = aws_db_subnet_group.database.name
  vpc_security_group_ids      = [aws_security_group.database.id]
  publicly_accessible         = true
}
