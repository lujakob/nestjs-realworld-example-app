.ONESHELL: # Applies to every targets in the file!

# Assumes local docker desktop is running
run-local:
	docker-compose up

# tears down local docker containers
destroy-local:
	docker-compose up

# Assumes being ran on MAC OSx
test-benchmark:
	brew install k6
	k6 run script.js

# cleansup local docker images containers etc
clean-dangling:
	docker system prune

## Below terraform commands to be used locally and in CI

init: 
	cd terraform; rm -rf .terraform/ ; \
	terraform init -backend=true

init_no_backend:
	cd terraform; rm -rf .terraform/ \
	terraform init -backend=false

validate:
	cd terraform; terraform validate;

validate_no_backend:  init_no_backend; \
	terraform validate 

plan:
	cd terraform; terraform plan -no-color \
	-out /tmp/iam.plan 

apply: 
	cd terraform; terraform apply -auto-approve /tmp/iam.plan ;

destroy:
	cd terraform; terraform destroy ; 

lint:
	cd terraform; tflint . ;

security_analysis:
	cd terraform; tfsec --no-colour . ;

format: 
	cd terraform; terraform fmt -recursive -diff . ;

local-build: cd terraform; init validate format lint security_analysis

