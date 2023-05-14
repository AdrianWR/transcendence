resource "aws_lb_target_group" "backend" {
  name        = "transcendence-backend-tg"
  port        = 8080
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    matcher = "200,301,302"
    path    = "/"
  }
}
