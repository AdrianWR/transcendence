terraform {
  required_version = ">= 1.2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "s3" {
    bucket  = "transcendence-terraform-state"
    key     = "transcendence.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "aws" {
  region = "us-east-1"
}

module "network" {
  source = "./network"

  root_domain = var.root_domain
}

module "database" {
  source = "./database"

  database_username         = "transcendence"
  vpc_id                    = module.network.vpc_id
  private_subnet_ids        = module.network.private_subnet_ids
  backend_security_group_id = module.backend.backend_security_group_id
}

module "backend" {
  source = "./backend"

  vpc_id                       = module.network.vpc_id
  vpc_cidr                     = module.network.vpc_cidr
  private_subnet_ids           = module.network.private_subnet_ids
  public_subnet_ids            = module.network.public_subnet_ids
  route53_zone_id              = module.network.route53_zone_id
  database_address             = module.database.address
  database_username            = module.database.username
  database_password_secret_arn = module.database.password_secret[0].secret_arn
  backend_domain               = var.backend_domain
  intra_client_id              = var.intra_client_id
  intra_client_secret          = var.intra_client_secret
  google_client_id             = var.google_client_id
  google_client_secret         = var.google_client_secret
}

module "frontend" {
  source = "./frontend"

  frontend_domain = var.frontend_domain
  route53_zone_id = module.network.route53_zone_id
}
