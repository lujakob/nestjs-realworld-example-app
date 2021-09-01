## What is done so far

- Built project docker image based on node docker container
- Pushed it to public registry under ichtar/fe

- deployement is done thru docker-compose
	- out of the shelf postgres
        - using env variable to set password

- CI/CD
        - process: update code, build and push image, make a PR -> trigger basic test
	- github actions
        - terraform cloud
        - AWS
        - only capable to use :latest
        - test really basic, spawn 2 containers and check that node program can create db`
        - building image is manual this is rather week
 

- terraform
	- spawn instance
        - push docker-compose on a cooked AMI based on Debian
        - use remote_exec to start docker-compose, using ssh key

- security consideration
	- ssh key used in terraform is encrypted with KMS
        - docker-compose.yaml is encrypte with KMS
        - AWS credentials in terraform cloud
        - terraform credential in github action

## What is not done

- checking API endpoint
- seed script to populate db

## What needs to be done

- docker image need to be built in github
- add a reverse proxy (nginx) to protect API and add SSL
- write a Makefile that build docker image and push using short commit tag
- using github action to inject short commit tag to be able to pull new image
- improve test by running something more meaningful
- check API endpoint
- seed script
