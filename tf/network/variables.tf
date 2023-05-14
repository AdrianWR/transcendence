variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "root_domain" {
  description = "Application root domain"
  type        = string
}

variable "public_subnet_cidr_blocks" {
  type        = list(string)
  description = "Public subnet CIDR values"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidr_blocks" {
  type        = list(string)
  description = "Private subnet CIDR values"
  default     = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability Zones"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}
