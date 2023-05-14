variable "frontend_domain" {
  description = "The domain for the frontend"
  type        = string
  default     = "transcendence.adrianroque.dev"
}

variable "route53_zone_id" {
  description = "The ID of the Route53 zone"
  type        = string
}
