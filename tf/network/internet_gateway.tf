resource "aws_internet_gateway" "transcendence_igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "Transcendence Internet Gateway"
  }
}
