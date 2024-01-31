data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}




resource "aws_iam_role" "lambda" {
  name               = "${var.product}-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda.json

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  ]

  inline_policy {
    name = "DynamoDBAccessPolicy"
    policy = jsonencode({
      Version = "2012-10-17",
      Statement = [
        {
          Effect   = "Allow",
          Action   = [
            "dynamodb:PutItem",
            "dynamodb:GetItem",
            "dynamodb:UpdateItem",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:DeleteItem"
          ],
          Resource = [aws_dynamodb_table.groups.arn, aws_dynamodb_table.tickets.arn]
        }
      ]
    })
  }
}