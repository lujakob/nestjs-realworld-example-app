terraform {
  backend "pg" {
  }
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
}

resource "heroku_build" "build" {
  app = heroku_app.default.name

  source {
    # A local directory, changing its contents will
    # force a new build during `terraform apply`
    # could also use a github release
    # url     = "https://github.com/mars/cra-example-app/archive/v2.1.1.tar.gz"
    # version = "v2.1.1"
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