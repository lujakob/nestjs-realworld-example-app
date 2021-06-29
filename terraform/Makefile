## Commands

init: 
	rm -rf .terraform/
	terraform init -backend=true

init_no_backend: 
	rm -rf .terraform/
	terraform init -backend=false

validate: 
	terraform validate 

validate_no_backend:  init_no_backend
	terraform validate 

plan: 
	terraform plan -no-color \
	-out /tmp/iam.plan 

apply: 
	terraform apply -auto-approve /tmp/iam.plan

destroy: 
	terraform destroy 

lint:
	tflint .

security_analysis:
	tfsec --no-colour .

format: 
	terraform fmt -recursive -diff .

local-build: init validate format lint security_analysis

