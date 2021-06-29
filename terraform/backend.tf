terraform {
  required_version = ">= 0.13"
  backend "s3" {
    bucket = "hassan-test-bucket-p2" #assume bucket is in s3
    key    = "prd"
    region = "eu-west-2"
  }
}