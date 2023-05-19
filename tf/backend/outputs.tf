output "ecr_repository_endpoint" {
  description = "The backend ECR repository endpoint"
  value       = aws_ecr_repository.transcendence.repository_url
}

output "backend_security_group_id" {
  description = "The backend security group ID"
  value       = aws_security_group.ecs_service.id
}
