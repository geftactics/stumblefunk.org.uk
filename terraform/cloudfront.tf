resource "aws_cloudfront_origin_access_control" "www" {
  name                              = "${var.product}-www-${var.environment}"
  description                       = "Grant cloudfront access to s3 bucket ${aws_s3_bucket.www.id}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}


resource "aws_cloudfront_distribution" "www" {
  origin {
    domain_name              = aws_s3_bucket.www.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.www.id
    origin_id                = aws_s3_bucket.www.bucket_regional_domain_name
  }

  enabled             = true
  default_root_object = "index.html"
  comment             = var.domain

  aliases             = ["www.${var.domain}", var.domain]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.www.bucket_regional_domain_name

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.index_rewrite.arn
    }

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  custom_error_response {
      error_caching_min_ttl = "0"
      error_code            = "404"
      response_code         = "200"
      response_page_path    = "/accreditation/index.html"
  }
  
  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.this.arn
    ssl_support_method = "sni-only"
  }
  
}


resource "aws_s3_bucket_policy" "default" {
  bucket = aws_s3_bucket.www.id
  policy = data.aws_iam_policy_document.cloudfront_oac_access.json
}

data "aws_iam_policy_document" "cloudfront_oac_access" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket"
    ]

    resources = [
      aws_s3_bucket.www.arn,
      "${aws_s3_bucket.www.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.www.arn]
    }
  }
}


resource "aws_cloudfront_function" "index_rewrite" {
  name    = "stumblefunk-org-uk-index-rewrite-${var.environment}"
  runtime = "cloudfront-js-2.0"
  comment = "Index.html rewrite"
  publish = true
  code    = file("${path.module}/src/index_rewrite.js")

  lifecycle {
    create_before_destroy = true
  }
}

