# Read state from checkout state
# this is a soft link to run in the same cluster
# https://www.terraform.io/docs/providers/terraform/d/remote_state.html
data "terraform_remote_state" "services" {
  backend   = "gcs"
  workspace = terraform.workspace

  # see https://www.terraform.io/docs/backends/types/gcs.html
  config = {
    prefix = "terraform/services"
    bucket = local.project
  }
}
