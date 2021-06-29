# VPC

A module to provide an ECR.

## Example Usage 
```terraform
module "ecr" {
  source = "modules/ecr"

  app_name     = var.app_name
  environment  = var.environment
  project_name = var.project
  tags         = var.tags
}
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| terraform | >= 0.13 |

## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| app\_name | n/a | `any` | n/a | yes |
| days\_untagged\_image\_expiration | n/a | `number` | `7` | no |
| environment | n/a | `any` | n/a | yes |
| number\_images\_to\_keep | n/a | `number` | `10` | no |
| project\_name | n/a | `any` | n/a | yes |
| scan\_on\_push | n/a | `bool` | `true` | no |
| tags | n/a | `map(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| ecr\_repository\_arn | n/a |
| ecr\_repository\_name | n/a |
| ecr\_repository\_url | n/a |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
