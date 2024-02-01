resource "aws_api_gateway_rest_api" "this" {
  name        = "${var.product}-accreditation-${var.environment}"
  description = "Stumblefunk API"
}

resource "aws_api_gateway_deployment" "this" {
  stage_description = "${md5(file("api_gw.tf"))}"
  rest_api_id = aws_api_gateway_rest_api.this.id
  stage_name  = var.environment
  depends_on = [
    aws_api_gateway_integration" "health_integration,
    aws_api_gateway_integration" "group_get_integration,
    aws_api_gateway_integration" "group_post_integration,
    aws_api_gateway_integration" "group_patch_integration,
    aws_api_gateway_integration" "group_delete_integration,
    aws_api_gateway_integration" "groups_get_integration,
    aws_api_gateway_integration" "ticket_post_integration,
    aws_api_gateway_integration" "ticket_delete_integration,
    aws_api_gateway_integration" "tickets_get_integration,
    aws_api_gateway_integration" "login_post_integration
  ]
}

output "api_url" {
  value = aws_api_gateway_deployment.this.invoke_url
}


// ---- Gateway resources ---------------------------------------------

resource "aws_api_gateway_resource" "health" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "health"
}

resource "aws_api_gateway_resource" "group" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "group"
}

resource "aws_api_gateway_resource" "groups" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "groups"
}

resource "aws_api_gateway_resource" "ticket" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "ticket"
}

resource "aws_api_gateway_resource" "tickets" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "tickets"
}

resource "aws_api_gateway_resource" "login" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "login"
}

// ---- Gateway methods ---------------------------------------------

resource "aws_api_gateway_method" "health_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.health.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "group_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.group.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "group_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.group.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "group_patch" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.group.id
  http_method   = "PATCH"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "group_delete" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.group.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "groups_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.groups.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "ticket_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.ticket.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "ticket_delete" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.ticket.id
  http_method   = "DELETE"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "tickets_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.tickets.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "login_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.login.id
  http_method   = "POST"
  authorization = "NONE"
}


// ---- Gateway integrations ---------------------------------------------

resource "aws_api_gateway_integration" "health_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.health.id
  http_method             = aws_api_gateway_method.health_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "group_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.group.id
  http_method             = aws_api_gateway_method.group_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "group_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.group.id
  http_method             = aws_api_gateway_method.group_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "group_patch_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.group.id
  http_method             = aws_api_gateway_method.group_patch.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "group_delete_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.group.id
  http_method             = aws_api_gateway_method.group_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "groups_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.groups.id
  http_method             = aws_api_gateway_method.groups_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "ticket_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.ticket.id
  http_method             = aws_api_gateway_method.ticket_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "ticket_delete_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.ticket.id
  http_method             = aws_api_gateway_method.ticket_delete.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "tickets_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.tickets.id
  http_method             = aws_api_gateway_method.tickets_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

resource "aws_api_gateway_integration" "login_post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.login.id
  http_method             = aws_api_gateway_method.login_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.accreditation.invoke_arn
}

// ---- CORS ------------------------------------------------------

module "cors_health" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id          = aws_api_gateway_rest_api.this.id
  api_resource_id = aws_api_gateway_resource.health.id
}

module "cors_group" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id          = aws_api_gateway_rest_api.this.id
  api_resource_id = aws_api_gateway_resource.group.id
}

module "cors_groups" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id          = aws_api_gateway_rest_api.this.id
  api_resource_id = aws_api_gateway_resource.groups.id
}

module "cors_ticket" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id          = aws_api_gateway_rest_api.this.id
  api_resource_id = aws_api_gateway_resource.ticket.id
}

module "cors_tickets" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id          = aws_api_gateway_rest_api.this.id
  api_resource_id = aws_api_gateway_resource.tickets.id
}

module "cors_login" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"
  api_id          = aws_api_gateway_rest_api.this.id
  api_resource_id = aws_api_gateway_resource.login.id
}