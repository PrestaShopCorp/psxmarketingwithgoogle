terraform {
  required_providers {
    google = {
      version = "3.40.0"
      source = "hashicorp/google"
    }
    kubernetes = {
      version = "1.10.0"
      source = "hashicorp/kubernetes"
    }
  }
  required_version = "0.14.5"
}
