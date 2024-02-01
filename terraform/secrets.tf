data "aws_secretsmanager_secret" "this" {
  name = "${var.product}-accreditation"
}

data "aws_secretsmanager_secret_version" "this" {
  secret_id = data.aws_secretsmanager_secret.this.id
}