resource "aws_route53_record" "backend" {
  zone_id = var.route53_zone_id
  name    = var.backend_domain
  type    = "A"

  alias {
    name                   = aws_lb.backend.dns_name
    zone_id                = aws_lb.backend.zone_id
    evaluate_target_health = true
  }
}

resource "aws_acm_certificate" "backend" {
  domain_name       = var.backend_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "Transcendence Backend Certificate"
  }
}
