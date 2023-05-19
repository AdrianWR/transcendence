output "s3_bucket_id" {
  description = "The frontend S3 bucket ID"
  value       = aws_s3_bucket.frontend.id
}
