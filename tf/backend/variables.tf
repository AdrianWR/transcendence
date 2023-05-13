variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block for VPC"
  type        = string
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private Subnet IDs"
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "Public Subnet IDs"
}

variable "route53_zone_id" {
  description = "The ID of the Route53 zone"
  type        = string
}

variable "backend_domain" {
  description = "The domain for the backend"
  type        = string
}

variable "database_address" {
  type        = string
  description = "Postgres database address"
}

variable "database_username" {
  type        = string
  description = "Postgres database username"
}

variable "database_password_secret_arn" {
  type        = string
  description = "Postgres database password secret arn"
  sensitive   = true
}

variable "intra_client_id" {
  type        = string
  description = "Intra Client ID"
}

variable "intra_client_secret" {
  type        = string
  description = "Intra Client secret"
}
