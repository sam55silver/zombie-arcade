terraform {
  cloud {
    organization = "sam55silver"

    workspaces {
      name = "zombie-arcade"
    }
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    archive = {
      source = "hashicorp/archive"
    }
  }

  required_version = ">= 1.3.7"
}
