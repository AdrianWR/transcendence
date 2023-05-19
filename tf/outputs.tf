output "backend_ecr_repository_url" {
  description = "Backend ECR repository URL"
  value       = module.backend.ecr_repository_endpoint
}

output "frontend_s3_bucket_id" {
  description = "Frontend S3 bucket ID"
  value       = module.frontend.s3_bucket_id
}
