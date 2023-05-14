[
  {
    "name": "transcendence-backend",
    "essential": true,
    "image": "${repository_url}:latest",
    "memory": 512,
    "cpu": 256,
    "portMappings": [
      {
        "containerPort": 8080,
        "hostPort": 8080
      }
    ],
    "environment": [
      {
        "name": "POSTGRES_HOST",
        "value": "${database_address}"
      },
      {
        "name": "POSTGRES_DB",
        "value": "transcendence"
      },
      {
        "name": "FRONTEND_URL",
        "value": "https://transcendence.adrianroque.dev"
      },
      {
        "name": "INTRA_REDIRECT_URL",
        "value": "https://transcendence-api.adrianroque.dev/auth/intra/redirect"
      },
      {
        "name": "USER_PICTURE_PATH",
        "value": "public/images"
      }
    ],
    "secrets": [
      {
        "name": "POSTGRES_USER",
        "valueFrom": "${database_password_secret_arn}:username::"
      },
      {
        "name": "POSTGRES_PASSWORD",
        "valueFrom": "${database_password_secret_arn}:password::"
      },
      {
        "name": "INTRA_CLIENT_ID",
        "valueFrom": "${intra_client_id}"
      },
      {
        "name": "INTRA_SECRET",
        "valueFrom": "${intra_client_secret}"
      },
      {
        "name": "JWT_ACCESS_SECRET",
        "valueFrom": "${jwt_access_secret}"
      },
      {
        "name": "JWT_REFRESH_SECRET",
        "valueFrom": "${jwt_refresh_secret}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${cloudwatch_log_group}",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }
]