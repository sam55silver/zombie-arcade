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
