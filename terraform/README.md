# IAM module

Module that allows creation of IAM specific to the problem given.

## Prerequisites

- terraform > 0.13	
- awscli
- configure aws profile
- aws s3 bucket (if state files are to be stored remotely. RECOMMENDED)

## Usage

Use the Makefile to connect to our remote state file and run `terraform` commands. For example:

```Bash
$ make init 
$ make validate 
$ make plan 
$ make apply
```
The Makefile has build local which validates, fmt, lint and does tfsec sec analysis

```Bash
$ make local-build 
```

