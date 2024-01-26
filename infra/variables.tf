variable "aws_region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application Name"
  default     = "zombie-arcade"
}

variable "environment" {
  description = "Environment of Deployment"
  default     = "development"
}

variable "gateway_stage" {
  description = "Gateway Stage"
  default     = "dev"
}
