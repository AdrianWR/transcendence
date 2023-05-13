data "aws_acm_certificate" "transcendence_ssl_cert" {
  domain   = "*.${var.root_domain}"
  statuses = ["ISSUED"]
}

resource "aws_cloudfront_distribution" "frontend" {
  origin {
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = var.frontend_domain
  }

  enabled             = true
  default_root_object = "index.html"

  aliases = [
    var.frontend_domain,
  ]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = var.frontend_domain

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.transcendence_ssl_cert.arn
    ssl_support_method  = "sni-only"
  }
}
