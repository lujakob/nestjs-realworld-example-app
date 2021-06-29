
# outputs.tf

output "alb_hostname" {
  value = aws_alb.main.dns_name
}

output "sec_gp_id" {
  value = aws_security_group.lb.id
}