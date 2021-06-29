variable "app_name" {
}

variable "environment" {
}

variable "project_name" {
}

variable "tags" {
  type = map(string)
}

variable "days_untagged_image_expiration" {
  type    = number
  default = 7
}

variable "number_images_to_keep" {
  type    = number
  default = 10
}

variable "scan_on_push" {
  type    = bool
  default = true
}
