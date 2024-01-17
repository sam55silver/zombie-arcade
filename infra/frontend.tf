provider "aws" {
  region = "${var.aws_region}"
  default_tags {
    tags = {
      Environment = "${var.environment}"
      App         = "${var.app_name}"
    }
  }
}

# Create a s3 bucket
resource "aws_s3_bucket" "src" {
  bucket = "${var.app_name}-${var.environment}-bucket"
}

# Make bucket public
resource "aws_s3_bucket_public_access_block" "src" {
  bucket = "${aws_s3_bucket.src.id}"
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Upload each file from dist to s3 bucket
resource "aws_s3_object" "src" {
  for_each = fileset("dist", "**/*.*")
  bucket   = "${aws_s3_bucket.src.id}"
  key      = each.value
  source   = "dist/${each.value}"
  etag     = filemd5("dist/${each.value}")
}

# Set Policy to allow cloudfront to access the bucket
data "aws_iam_policy_document" "s3_policy" {
  statement {
    sid = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"
  
    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.src.arn}/*",
    ]

    condition {
      test = "StringEquals"
      variable = "AWS:SourceArn"
      values = [
        "${aws_cloudfront_distribution.cdn.arn}",
      ]
    }

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
  }
}


# Attach the policy to the bucket
resource "aws_s3_bucket_policy" "src" {
  bucket = "${aws_s3_bucket.src.id}"
  policy = data.aws_iam_policy_document.s3_policy.json
}

# Create a cloudfront distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = "${aws_s3_bucket.src.bucket_regional_domain_name}"
    origin_id   = "${aws_s3_bucket.src.id}"
    origin_access_control_id = "${aws_cloudfront_origin_access_control.cdn.id}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for ${var.app_name}"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "${aws_s3_bucket.src.id}"

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
    cloudfront_default_certificate = true
  }
}

# Create origin access to Origin Access control settings
resource "aws_cloudfront_origin_access_control" "cdn" {
  name      = "${var.app_name}-${var.environment}-cdn-oac"
  description = "Origin Access Control for ${var.app_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}
