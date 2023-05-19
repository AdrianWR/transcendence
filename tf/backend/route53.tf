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
