data "template_file" "task_definition" {
  template = file("${path.module}/task_definition.json.tpl")

  vars = {
    repository_url               = aws_ecr_repository.transcendence.repository_url
    database_address             = var.database_address
    database_username            = var.database_username
    database_password_secret_arn = var.database_password_secret_arn
    cloudwatch_log_group         = aws_cloudwatch_log_group.backend.name
    intra_client_id              = aws_secretsmanager_secret_version.intra_client_id.arn
    intra_client_secret          = aws_secretsmanager_secret_version.intra_client_secret.arn
    jwt_access_secret            = aws_secretsmanager_secret_version.jwt_access_secret.arn
    jwt_refresh_secret           = aws_secretsmanager_secret_version.jwt_refresh_secret.arn
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                = "transcendence-backend"
  container_definitions = data.template_file.task_definition.rendered

  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
}
