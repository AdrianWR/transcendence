variable "vpc_id" {
  type        = string
  description = "The ID of the VPC"
}

variable "database_username" {
  type        = string
  description = "The username for the database"
  default     = "transcendence"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private Subnet IDs"
}

variable "backend_security_group_id" {
  description = "The ID of the security group for the backend"
  type        = string
}
