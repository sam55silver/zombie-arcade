provider "aws" {
  region = "${var.aws_region}"
}

# Create an S3 bucket
resource "aws_s3_bucket" "my_bucket" {
  bucket = "${var.app_name}-bucket"
  acl    = "public-read"
}

# Configure CloudFront distribution
resource "aws_cloudfront_distribution" "my_distribution" {
  origin {
    domain_name = aws_s3_bucket.my_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.my_bucket.bucket
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.app_name} CloudFront Distribution"
  default_root_object = "index.html"

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.my_bucket.bucket
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Cache settings
  ordered_cache_behavior {
    path_pattern = "/images/*"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl = 0
    default_ttl = 3600
    max_ttl = 86400
  }

  # SSL/TLS settings
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
