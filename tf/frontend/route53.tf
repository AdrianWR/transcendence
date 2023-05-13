data "aws_route53_zone" "transcendence" {
  name         = var.root_domain
  private_zone = false
}

resource "aws_route53_record" "frontend" {
  zone_id = data.aws_route53_zone.transcendence.zone_id
  name    = var.frontend_domain
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "backend" {
  resource "aws_route53_record" "frontend" {
    zone_id = data.aws_route53_zone.transcendence.zone_id
    name    = var.frontend_domain
    type    = "A"
    alias {
      name                   = aws_cloudfront_distribution.frontend.domain_name
      zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
      evaluate_target_health = false
    }
  }

}
