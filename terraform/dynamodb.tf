resource "aws_dynamodb_table" "groups" {
  name           = "${var.product}-accreditation-groups-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "group_id"
  attribute {
    name = "group_id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "tickets" {
  name           = "${var.product}-accreditation-tickets-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "ticket_id"
  attribute {
    name = "ticket_id"
    type = "S"
  }
}