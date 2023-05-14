output "ecr_repository_endpoint" {
  value = aws_ecr_repository.transcendence.repository_url
}

output "backend_security_group_id" {
  value = aws_security_group.ecs_service.id
}
