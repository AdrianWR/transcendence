resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = var.vpc_id
  private_dns_enabled = true
  service_name        = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = [aws_security_group.ecs_service.id]
  subnet_ids          = var.private_subnet_ids

  tags = {
    Name = "ECR DKR VPC Endpoint"
  }
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true
  security_group_ids  = [aws_security_group.ecs_service.id]
  subnet_ids          = var.private_subnet_ids

  tags = {
    Name = "ECR API VPC Endpoint"
  }
}

resource "aws_vpc_endpoint" "logs" {
  vpc_id              = var.vpc_id
  private_dns_enabled = true
  service_name        = "com.amazonaws.${var.aws_region}.logs"
  vpc_endpoint_type   = "Interface"
  security_group_ids  = [aws_security_group.ecs_service.id]
  subnet_ids          = var.private_subnet_ids

  tags = {
    Name = "Logs VPC Endpoint"
  }
}
