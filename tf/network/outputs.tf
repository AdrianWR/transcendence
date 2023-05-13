output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public_subnets.*.id
}

output "private_subnet_ids" {
  value = aws_subnet.private_subnets.*.id
}

output "vpc_cidr" {
  value = aws_vpc.main.cidr_block
}

output "route53_zone_id" {
  value = aws_route53_zone.transcendence.id
}

output "route53_zone_name_servers" {
  value = aws_route53_zone.transcendence.name_servers
}
