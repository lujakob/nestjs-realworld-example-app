module "ecs" {
  source = "./modules/ecs"
}

module "ecr" {

  source       = "./modules/ecr"
  app_name     = "realworld"
  environment  = "dev"
  project_name = "test-project"
  tags         = { "name" = "test" }
}

resource "aws_db_instance" "default" {
  allocated_storage    = 10
  engine               = "postgres"
  engine_version       = "12.5"
  instance_class       = "db.t2.micro"
  name                 = "mydb"
  username             = "postgres"
  password             = "postgres"
  parameter_group_name = "default.postgres12"
  publicly_accessible  = true
}

# module "ecr_db" {

#   source = "./modules/ecr"
#   app_name     = "postgres"
#   environment  = "dev"
#   project_name = "test-db"
#   tags         = {"name" = "db"}
# }

# data "aws_ami" "amazon_linux" {
#   most_recent = true
#   filter {
#     name   = "name"
#     values = ["amzn2-ami-hvm-2.0.*.0-x86_64-gp2"]
#   }
#   owners = ["amazon"]
# }

# resource "aws_instance" "bastion" {
#   ami           = data.aws_ami.amazon_linux.id
#   instance_type = "t2.micro"
# }