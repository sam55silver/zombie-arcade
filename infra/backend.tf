# DynamoDB
resource "aws_dynamodb_table" "table" {
  name           = "${var.app_name}-highscore"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "Name"
  range_key      = "Score"
  attribute {
    name = "Score"
    type = "N"
  }

  attribute {
    name = "Name"
    type = "S"
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.app_name}-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "dynamodb-lambda-policy" {
   name = "dynamodb_lambda_policy"
   role = aws_iam_role.iam_for_lambda.id
   policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
           "Effect" : "Allow",
           "Action" : ["dynamodb:*"],
           "Resource" : "${aws_dynamodb_table.table.arn}"
        }
      ]
   })
}

data "archive_file" "lambda_src" {
  source_file = "build/bootstrap"
  output_path = "build/bootstrap.zip"
  type = "zip"
}

resource "aws_lambda_function" "lambda" {
  handler = "bootstrap"
  memory_size = 128
  timeout = 10
  architectures = ["arm64"]
  runtime = "provided.al2023"
  role = aws_iam_role.iam_for_lambda.arn
  filename = "build/bootstrap.zip"
  function_name = "${var.app_name}-highscore-lambda"
}

resource "aws_apigatewayv2_api" "gateway" {
  name          = "${var.app_name}-gateway"
  protocol_type = "HTTP"
}

resource "aws_cloudwatch_log_group" "gateway_logs" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.gateway.name}"
  retention_in_days = 30
}

resource "aws_apigatewayv2_stage" "gateway" {
  api_id = aws_apigatewayv2_api.gateway.id

  name        = var.gateway_stage
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.gateway_logs.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "gateway_lambda" {
  api_id = aws_apigatewayv2_api.gateway.id

  integration_uri    = aws_lambda_function.lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "gateway_route" {
  api_id = aws_apigatewayv2_api.gateway.id

  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.gateway_lambda.id}"
}

resource "aws_lambda_permission" "lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.gateway.execution_arn}/*/*"
}
