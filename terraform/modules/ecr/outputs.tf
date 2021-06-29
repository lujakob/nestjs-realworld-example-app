output "ecr_repository_arn" {
  value = aws_ecr_repository.this.arn
}

output "ecr_repository_name" {
  value = aws_ecr_repository.this.name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.this.repository_url
}
