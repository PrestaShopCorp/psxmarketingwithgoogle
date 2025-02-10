# https://www.terraform.io/docs/providers/kubernetes/r/deployment.html
resource "kubernetes_deployment" "storybook" {
  metadata {
    name = "${terraform.workspace}-storybook"
    namespace = "google-shopping"

    labels = {
      "name" = "${terraform.workspace}-storybook"
      "version" = var.app_version
      "managed-by" = "terraform"
      "hash-id" = var.hash_id
    }
  }

  spec {
    replicas = 1

    # wait for previous to be down before launching new one
    strategy {
      type = "RollingUpdate"
    }

    selector {
      match_labels = {
        "name" = "${terraform.workspace}-storybook"
      }
    }

    template {
      # container metadata
      metadata {
        labels = {
          "name" = "${terraform.workspace}-storybook"
          # Use commit to force tf detection
          "version" = var.hash_id
          "managed-by" = "terraform"
          "hash-id" = var.hash_id
        }
      }

      spec {
        # select node pool
        node_selector = {
          type = "google-shopping"
          env = local.environment
        }

        container {
          name = "ui"
          image = "europe-west1-docker.pkg.dev/${local.project}/googleshopping-storybook:latest"
          image_pull_policy = "Always"
        }
      }
    }
  }
}

# https://www.terraform.io/docs/providers/kubernetes/r/service.html
resource "kubernetes_service" "storybook" {
  metadata {
    name      = "${terraform.workspace}-storybook"
    namespace = "google-shopping"
    labels = {
      "name"       = "${terraform.workspace}-storybook"
      "part-of"    = "google-shopping"
      "version"    = var.app_version
      "managed-by" = "terraform"
      "component"  = "ui"
    }
  }

  spec {
    # get client ip
    session_affinity = "ClientIP"
    # Don't expose directly, use the ingress
    type             = "NodePort"
    external_traffic_policy = "Cluster"

    selector = {
      name    = "${terraform.workspace}-storybook"
    }

    port {
      port        = "8081"
      target_port = "80"
      name        = "http-api"
    }
  }
}

# https://www.terraform.io/docs/providers/kubernetes/r/ingress.html
resource "kubernetes_ingress" "storybook" {
  metadata {
    name = "${terraform.workspace}-storybook"
    namespace = "google-shopping"
    annotations = {
      "kubernetes.io/ingress.global-static-ip-name" = google_compute_global_address.storybook.name
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
      "kubernetes.io/ingress.allow-http" = "false"
    }
  }

  spec {
    rule {
      host = google_compute_global_address.storybook.description
      http {
        path {
          backend {
            service_name = "${terraform.workspace}-storybook"
            service_port = kubernetes_service.storybook.spec[0].port[0].port
          }
          path = "/*"
        }
      }
    }
    tls {
      secret_name = "certificate"
      hosts = [
        google_compute_global_address.storybook.description
      ]
    }
  }
}
