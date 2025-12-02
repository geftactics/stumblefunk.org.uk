resource "aws_s3_bucket" "www" {
  bucket        = "www.${var.domain}"
  force_destroy = true
}


locals {
  folder_files = [
    for file in flatten(fileset("${path.module}/public_html/**", "**")) :
    trim(file, "../") 
    if length(regexall(".*\\.terragrunt-source-manifest.*", file)) == 0
  ]
}


locals {
  mime_types = {
    ".html" = "text/html"
    ".css" = "text/css"
    ".js" = "application/javascript"
    ".ico" = "image/vnd.microsoft.icon"
    ".jpg" = "image/jpeg"
    ".png" = "image/png"
    ".svg" = "image/svg+xml"
  }
}


resource "aws_s3_object" "this" {
  for_each     = { for idx, file in local.folder_files : idx => file }
  bucket       = aws_s3_bucket.www.bucket
  key          = each.value
  source       = "${path.module}/public_html/${each.value}"
  etag         = filemd5("${path.module}/public_html/${each.value}")
  content_type = lookup(local.mime_types, regex("\\.[^.]+$", each.value), null)
}


resource "aws_s3_object" "env" {
  bucket       = aws_s3_bucket.www.bucket
  key          = "accreditation/config.js.env"
  content      = "var config = { apiUrl: '${aws_api_gateway_stage.this.invoke_url}' }"
  content_type = "application/javascript"
}
