# Transcendence

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)

## AWS Architecture

I planned the infrastructure of the project to be as simple and cheap as possible, while still providing a good user experience and featuring some new (at least to me) AWS resources. The main idea is to have a serverless backend, with a React frontend hosted on S3 and served through CloudFront. The backend is provisioned by a FARGATE launch type task, hidden behind an Application Load Balancer. Finally, the database is a simple RDS instance and the network is composed of a VPC, two subnets (one private and one public) and an Internet Gateway.

![AWS Architecture](./assets/architecture.png 'AWS Architecture')

### Network

The network module comprises a new AWS VPC, one private and one public subnet, with a Internet Gateway attached to a Route Table Association. I decided to include here the Route 53 Hosted Zone, which is used to manage the DNS records of the other three modules. The private and public subnets are configured to be applied in three different Availability Zones.

At first I tried to include here some VPC endpoints as well, as a mean for the ECS Tasks to have access to some AWS services without having to go through the Internet Gateway. At the end, it would imply in higher infrastructure costs, so I decided to remove them and create the tasks on the public subnet instead.

### Database

This is probably the simplest infrastructure module. The core component is a t2.micro RDS instance running PostgreSQL 12.4, deployed in the private subnet created at the previous module. A security group is also included, letting only the ECS Tasks access the database on port 5432.

### Backend

The backend module comprises mainly an ECS Cluster, an ECS Service and its main task definition. The ECS Service is configured to use the FARGATE launch type, therefore we don~t need to bother with EC2 instances. Behind the service lies an Application Load Balancer, routing the requests to the task and attaching the Route 53 record dedicated to our API.

The task definition is configured to use the `transcendence-backend` container image, which is built from the `backend` directory code and stored in the ECR repository created by this very own module. Other than that, some additional variables and secrets are declared to be used on the task definition rendered template.

Two security groups were also created for this module. The first one is attached to the ECS Service, allowing the Load Balancer to receive internet requests on ports 80 and 443. The second one is attached to the task, allowing the ECS Service to receive the requests from the Load Balancer.

### Frontend

As we are dealing here with a React application, we don't need to keep a server infrastructure for this module, opting for the static website hosting feature provided by S3. The bucket is configured to be private, and user requests are routed through a dedicated CloudFront distribution configured to use a new Route 53 record. The bucket access is managed by an Origin Access Identity resource.

## Infrastructure Deployment

The infrastructure is deployed using Terraform, with the code organized in four different modules. The modules are deployed in the following order:

1. Network
2. Database
3. Backend
4. Frontend

For the whole project, the only variables explicitly required are the following secrets for the backend task definition:

- `intra_client_id`
- `intra_client_secret`
- `google_client_id`
- `google_client_secret`

You may choose to provide them as environment variables or as a `.tfvars` file. The variables are declared in the `variables.tf` file of the main module.

To deploy the infrastructure, you need to have Terraform installed and configured with your AWS credentials. Then, you can run the following commands:

```bash
terraform init
terraform validate
terraform plan
terraform apply
```

Double check the plan before applying it, as it may incur in some costs. The infrastructure is deployed in the `us-east-1` region by default, but you can change it by editing the `provider.tf` file. Type `yes` when prompted to confirm the deployment.

## Requirements

| Name                                                                     | Version  |
| ------------------------------------------------------------------------ | -------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.2.0 |
| <a name="requirement_aws"></a> [aws](#requirement_aws)                   | ~> 4.16  |

## Inputs

| Name                                                                                          | Description                         | Type     | Default                               | Required |
| --------------------------------------------------------------------------------------------- | ----------------------------------- | -------- | ------------------------------------- | :------: |
| <a name="input_backend_domain"></a> [backend_domain](#input_backend_domain)                   | The domain for the backend          | `string` | `"transcendence-api.adrianroque.dev"` |    no    |
| <a name="input_frontend_domain"></a> [frontend_domain](#input_frontend_domain)                | The domain for the frontend         | `string` | `"transcendence.adrianroque.dev"`     |    no    |
| <a name="input_google_client_id"></a> [google_client_id](#input_google_client_id)             | Google client ID                    | `string` | n/a                                   |   yes    |
| <a name="input_google_client_secret"></a> [google_client_secret](#input_google_client_secret) | Google client secret                | `string` | n/a                                   |   yes    |
| <a name="input_intra_client_id"></a> [intra_client_id](#input_intra_client_id)                | Intra client ID                     | `string` | n/a                                   |   yes    |
| <a name="input_intra_client_secret"></a> [intra_client_secret](#input_intra_client_secret)    | Intra client secret                 | `string` | n/a                                   |   yes    |
| <a name="input_root_domain"></a> [root_domain](#input_root_domain)                            | The root domain for the application | `string` | `"adrianroque.dev"`                   |    no    |

## Outputs

| Name                                                                                                              | Description                |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------- |
| <a name="output_backend_ecr_repository_url"></a> [backend_ecr_repository_url](#output_backend_ecr_repository_url) | Backend ECR repository URL |
| <a name="output_frontend_s3_bucket_id"></a> [frontend_s3_bucket_id](#output_frontend_s3_bucket_id)                | Frontend S3 bucket ID      |
