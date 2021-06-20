terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "~> 4.0"
    }
  }
}

resource "heroku_app" "default" {
  name   = "realworld-example-app"
  region = "eu"
  stack  = "container"

  config_vars = {
    FOOBAR = "baz"
  }
}

resource "heroku_build" "build" {
  app = heroku_app.default.name

  source {
    # A local directory, changing its contents will
    # force a new build during `terraform apply`
    path = "../app"
  }
}

resource "heroku_addon" "database" {
  app  = heroku_app.default.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_formation" "foobar" {
  app        = heroku_app.default.id
  type       = "web"
  quantity   = 1
  size       = "Free"
  depends_on = [heroku_build.build]
}