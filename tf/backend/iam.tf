data "aws_iam_policy_document" "ecs_task_execution_policy" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_secrets_manager_policy" {
  statement {
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue",
    ]

    resources = [
      var.database_password_secret_arn,
      aws_secretsmanager_secret.intra_client_id.arn,
      aws_secretsmanager_secret.intra_client_secret.arn,
      aws_secretsmanager_secret.jwt_access_secret.arn,
      aws_secretsmanager_secret.jwt_refresh_secret.arn,
    ]
  }
}

resource "aws_iam_policy" "ecs_secrets_manager_policy" {
  name        = "TranscendenceECSSecretsManagerPolicy"
  description = "ECS Secrets Manager Policy"
  policy      = data.aws_iam_policy_document.ecs_secrets_manager_policy.json
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs_task_execution_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_policy.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_secrets_manager_role_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_secrets_manager_policy.arn
}
