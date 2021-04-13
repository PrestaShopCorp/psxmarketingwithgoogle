terraform {
  backend "gcs" {
    prefix = "terraform/google-shopping-storybook"
    bucket = "psessentials-production"
  }
}
