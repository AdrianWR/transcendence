resource "aws_acm_certificate" "frontend_certificate" {
  domain_name       = var.frontend_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "Transcendence Frontend Certificate"
  }
}

resource "aws_route53_record" "frontend_certificate" {
  for_each = {
    for dvo in aws_acm_certificate.frontend_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.route53_zone_id
  name    = each.value.name
  type    = each.value.type

  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "frontend_certificate" {
  certificate_arn         = aws_acm_certificate.frontend_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.frontend_certificate : record.fqdn]
}
