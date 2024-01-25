data "archive_file" "lambda" {
  type        = "zip"
  source_file = "lambda.py"
  output_path = "lambda_function_payload.zip"
}

resource "aws_lambda_function" "accreditation" {
  filename         = "lambda_function_payload.zip"
  function_name    = "${var.product}-accreditation-${var.environment}"
  role             = aws_iam_role.lambda.arn
  handler          = "lambda.handler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "python3.12"

  environment {
    variables = {
      DDB_TABLE_GROUPS  = aws_dynamodb_table.groups.name
      DDB_TABLE_TICKETS = aws_dynamodb_table.groups.name
      MASTER_USER = "masterpass"
    }
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.accreditation.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.this.execution_arn}/*"
}