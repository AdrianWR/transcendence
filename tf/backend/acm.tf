resource "aws_acm_certificate" "backend_certificate" {
  domain_name       = var.backend_domain
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "Transcendence Backend Certificate"
  }
}

resource "aws_route53_record" "backend_certificate" {
  for_each = {
    for dvo in aws_acm_certificate.backend_certificate.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "backend_certificate" {
  certificate_arn         = aws_acm_certificate.backend_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.backend_certificate : record.fqdn]
}
