resource "aws_ecr_repository" "this" {
  name = "${var.project_name}/${var.environment}/${var.app_name}"

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "ecr" {
  repository = aws_ecr_repository.this.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Expire untagged images after 7 days",
            "selection": {
                "tagStatus": "untagged",
                "countType": "sinceImagePushed",
                "countUnit": "days",
                "countNumber": ${var.days_untagged_image_expiration}
            },
            "action": {
                "type": "expire"
            }
        },
        {
            "rulePriority": 999,
            "description": "Keep latest 10 images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": ${var.number_images_to_keep}
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
