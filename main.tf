terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.26.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.0.1"
    }
  }
  required_version = ">= 0.14"

  backend "remote" {
    organization = "demo"

    workspaces {
      name = "gh-actions-demo"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region     = "eu-west-3"
  access_key = "AKIA4YCZC54WEWLLWDS4"
  secret_key = "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"
}

resource "aws_security_group" "allow_ssh" {
  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"

  ingress {
    description      = "SSH from VPC"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  ingress {
    description      = "node from VPC"
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }


  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "allow_tls"
  }
}

resource "aws_instance" "vpn" {
#  ami                    = "ami-03ff1df0309de1eb0"
  ami                    = "ami-05f46207225f7e094"
  instance_type          = "t2.micro"
  key_name               = "mine2"
  vpc_security_group_ids = [ aws_security_group.allow_ssh.id ]

  tags = {
    Name = "vpn"
  }
  provisioner "file" {
    source = "docker-compose.yml"
    destination = "docker-compose.yml"

  connection {
    host = self.public_dns
    user = "admin"
    private_key = file("${path.module}/files/mine2.pem")
  }
  }
  provisioner "remote-exec" {
    inline = [
      "docker-compose up -d",
    ]
  connection {
    host = self.public_dns
    user = "admin"
    private_key = file("${path.module}/files/mine2.pem")
  }
  }

  provisioner "local-exec" {
    command = "echo ssh -fND 9060 -i files/mine2.pem admin@${self.public_ip}"
  }
}

