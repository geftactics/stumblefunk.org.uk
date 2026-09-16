# ---------------------------------------------------------------------------------------------------------------------
# TERRAGRUNT CONFIGURATION
# Terragrunt is a thin wrapper for Terraform that provides extra tools for working with multiple Terraform modules,
# remote state, and locking: https://github.com/gruntwork-io/terragrunt
# ---------------------------------------------------------------------------------------------------------------------

terragrunt_version_constraint = ">= 1.1.5, < 2.0.0"

# Locals

locals {
  product    = "stumblefunk"
  aws_region = "eu-west-1"
  env        = split("/", path_relative_to_include())[1]
}

# Configure Terragrunt to automatically store tfstate files in an common S3 bucket
# key is defined as: /PRODUCT/ENV/REGION/terraform.tfstate
remote_state {
  backend = "s3"
  config = {
    encrypt        = true
    bucket         = "tfstate-squiggle-org"
    key            = "${local.product}/${local.env}/${local.aws_region}/terraform.tfstate"
    region         = local.aws_region
    use_lockfile   = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# GLOBAL PARAMETERS
# These variables apply to all configurations in this subfolder. These are automatically merged into the child
# `terragrunt.hcl` config via the include block.
# ---------------------------------------------------------------------------------------------------------------------

inputs = {
  product     = local.product
  environment = local.env
  aws_region  = local.aws_region
}
