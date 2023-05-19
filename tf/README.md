# Transcendence

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
