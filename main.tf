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
    organization = "ichtar"

    workspaces {
      name = "gh-actions-demo"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "eu-west-3"
}
data "aws_kms_secrets" "example" {
  secret {
    name    = "secret_key"
    payload = "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"
    context = {
      foo = "bar"
    }
  }
  secret {
    name    = "docker-compose"
    payload = "AQICAHjx3l2NzFJPqRwiXR7uMVW80VaLN1EOI1ZMnp9SqvY/YgFoinYH3i9zNUR6i0+VTBjWAAAGKDCCBiQGCSqGSIb3DQEHBqCCBhUwggYRAgEAMIIGCgYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAwhdbxO8BVfHu9XN44CARCAggXbvuZaFurqey6c5odd66io03Rtt4GBm53fLDii2Zcc0UPkar8vmZsQXvhj6OYdtaGWy/PtOlMZdNfINbHCTM9bqI/dqutzuh5w8EOHTSdE+a9w7MrZZ3qMAk6IBesO+P+HLCHjsQPKI9w6QN4yqd7lQK9WWRsSv7AZULuGmYleYQVgNFxhCHWVcw3mUxhf3dEZEVpLXLqL5vSlNKbg+qAAB+WQtWLOk+7zMl4oom8ZwZ5lLFmFDlKQuQ0Zcm9f88DqajVSs5S7JUjUTeJOy4J5829/1SUgKMfTKYd7FygLgZN6ECNzaFcz4kdw46FAcLPUneVkX/ShTp3FsXIriL8EI7Wq7MOjUaBVWVr2EpgxIzMQtgyHsb+upUVvffvNV+5+GrzAwT9oTEP5fgur6GiZIseYzg7aXMUsBjtuZM4kjrUym7Sj6Rv6DH/m/FMlFFg44bd3JxH0UYJTQhkrR1TERi7dvytiuTSO+/l0xgjYyrX+F6BMX1dzXhq+LTtbb8MXlrt2zkVVfYzaDoymmBaIQ8QDTU7D8YWBXV/pVYlAVDBErCLPJkgNnxjJe6vCY2IBhCUezKrSOhC7OKK3lvNVCZLmSQrE2fVGZ4JQX8NYQZS2EHb+6kilJsZpdFRt2J7ejNPegjBBASA1knEMJEWboH47HFTYlqjKeZAkmHvG38RUA0GGq08kejeZk1Ey72MlW0XwIHd1Vmn5AiNgDibibeckgjJxMWgz44C+0FOjYRw1SxnleB6DMuxXYI1N8Cv6hGLjvJ4uiAA1ojCaYAU4PiI20IbfYyCIXau/gJ723ZYkhrg9lZ/BvuNsVbrqOrQtisGrjreMQf+XNpzSuJ+UyVODt0VM9Y0hfz3ZLdfB5nc9/+1Ae1rNOylQhJqA6khv7Ebqos4jK2kPOxZ3y9hUt66P70qepQWYo+zOre/LfrdRJj31t6z4lzdCifiLk627OiN7Svetf6PYq0PyMvHN/PmpspM4wadOnh19lCp0gjvVXdySJtVIKt8H+83s3eVDUdj2yqoflYuESu19t4KZH2J0rLnGEoLLaua88VhYZXZwn48MFkwMArYBTGH5Wvbwr9ZzbkoHJCsRsUfTlq5j69Lqa1h+YIePLtHNdAw3gXiLZwVAnJg+DzWvgkSF87aH/txHmL/XOrWwuu/VjL/4qv4Ipnu1PAOIUNJM4RNHKtWwbCzPv/AmRf29/Z6m2/WBjFMkMynx3/PixwbmtR5p6Y7j060BDQRQcLKD2EaLyja83Gkn9I1GI/cu+89Z5K4/892f1EltSP3tp+e/B/iuHLvWWhIEwhUuxXpOzMEW2X+UXYpsAdCLj0KBxyQVszcXV4Qs2IvNMYgOqnoM6Ta6JoSjzyXYeweHY7JyX46tZS3FtG+itn4w9AJng+rRTeM5Vh5kX9yELvKnAsfvqfOODIvQ3aGQFSY70h/5F+OrRLYqgEMfQhDbInzuUjuY9afyJNMfFgYdePbQqA3Zn2A2ihumQr1WHxuOh33ESAVkEay/VU2nzxozKGz4p5ZRosImebdBCyAHzOJx0yvcFR9ky+4t78oL/HFverfrn3Ggxlh1q7PqXCtqgiam+zgIFYjR00U0RwTga28VCrnQtV+JQeIClYnWQ/no8SfqYow4VzPHnrDXRWkUsgeJ+E8W76sr+tFzC91iTCDDET0U58PHHdSLWEumA9c0z8PAwM7dqaAqihgEXp57g7AG2Frr8Id285Jb0j42xAoZ+ANtZbvLSdzKdTfTtAwnTt18WA6t405cnB5lEB86RV/L+uA4cw90iJDInjgI+G5Z69sHx3wRMMiKSQrXAprTngPvpL+L9oBg3usWZudBkY6w1xC/CQ7PzbTVt/wxUxmYKhEu0551jpGtPL9b6hkhZpqbGiecB7dzx5w+53on41BNVPFO627kQLdVbGOJRfjH9mCEX4/mX8PN1AiPbD+wkc/qXc/aq5t/TaiyoGZFMLkp89TtbyRMOPqwspIqJK5PnG8="
    context = {
      foo = "bar"
    }
  }
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
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  tags = {
    Name = "vpn"
  }
  provisioner "file" {
    content     = data.aws_kms_secrets.example.plaintext["docker-compose"]
    destination = "docker-compose.yml"

    connection {
      host        = self.public_dns
      user        = "admin"
      private_key = data.aws_kms_secrets.example.plaintext["secret_key"]
    }
  }
  provisioner "remote-exec" {
    inline = [
      "docker-compose up -d",
    ]
    connection {
      host        = self.public_dns
      user        = "admin"
      private_key = file("${path.module}/files/mine2.pem")
    }
  }

  provisioner "local-exec" {
    command = "echo ssh -fND 9060 -i files/mine2.pem admin@${self.public_ip}"
  }
}


