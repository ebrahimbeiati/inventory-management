# Inventory Management System

A full-stack inventory management application built with Next.js, Node.js, and PostgreSQL.

## Features

- Product inventory management
- User management with role-based access control
- Dashboard with key metrics
- Reports and analytics
- Help center with searchable FAQs

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/inventory-management.git
   cd inventory-management
   ```

2. Install dependencies:
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in both client and server folders
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start the client
   cd client
   npm run dev
   
   # Start the server
   cd ../server
   npm run dev
   ```

### Using Docker

You can also use Docker to run the entire stack:

1. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Deployment with GitHub Actions and AWS

This project uses GitHub Actions for CI/CD, deploying to AWS services automatically when changes are pushed to the main branch.

### AWS Deployment Options

The CI/CD pipeline supports multiple AWS deployment targets:

1. **Amazon EC2**
2. **Amazon ECS (Elastic Container Service)**
3. **AWS Elastic Beanstalk**

### Setting Up GitHub Actions

1. **Configure GitHub Secrets**:
   
   Navigate to your GitHub repository → Settings → Secrets and Variables → Actions → New repository secret, and add:

   - `AWS_ACCESS_KEY_ID` - Your AWS Access Key
   - `AWS_SECRET_ACCESS_KEY` - Your AWS Secret Key
   - `AWS_ACCOUNT_ID` - Your AWS Account ID

   Depending on your deployment target, also add:
   
   For EC2:
   - `EC2_INSTANCE_ID` - Your EC2 instance ID
   - `S3_BUCKET` - S3 bucket name for artifact transfer
   
   For ECS:
   - `ECS_CLUSTER` - ECS cluster name
   - `ECS_CLIENT_SERVICE` - ECS service name for client
   - `ECS_SERVER_SERVICE` - ECS service name for server
   
   For Elastic Beanstalk:
   - `EB_ENVIRONMENT` - Elastic Beanstalk environment name

2. **Configure GitHub Variables**:
   
   Add a variable to specify your deployment target:
   
   - `DEPLOYMENT_TARGET` - Set to either `ec2`, `ecs`, or `beanstalk`

### AWS Resources Setup

#### EC2 Setup

1. Launch an EC2 instance with Amazon Linux 2
2. Install required dependencies:
   ```bash
   sudo yum update -y
   sudo yum install -y nodejs npm git
   sudo amazon-linux-extras install docker
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```
3. Install PM2 for process management:
   ```bash
   sudo npm install -g pm2
   ```
4. Set up an S3 bucket for deployment artifacts
5. Configure instance profile with permissions for S3 access and SSM

#### ECS Setup

1. Create an ECR repository for each service
2. Create an ECS cluster
3. Define task definitions for your services
4. Create ECS services using your task definitions

#### Elastic Beanstalk Setup

1. Create a new Elastic Beanstalk application
2. Create an environment with the Node.js platform
3. Configure environment properties with your required variables

## Monitoring and Logs

- **CloudWatch**: Set up CloudWatch for monitoring metrics and logs
- **X-Ray**: Configure AWS X-Ray for distributed tracing

## Security Considerations

- Use IAM roles with least privilege
- Secure sensitive information in AWS Secrets Manager
- Enable VPC for network isolation
- Implement AWS WAF for web application security

## Backup and Disaster Recovery

- Set up automated database backups
- Create disaster recovery plans with defined RTO/RPO
- Test recovery procedures regularly

## License

This project is licensed under the MIT License - see the LICENSE file for details.