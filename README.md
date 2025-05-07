# Inventory Management System

A full-stack inventory management application built with Next.js, Express, and PostgreSQL.

## Security Instructions

### Environment Variables

This application uses environment variables for configuration to ensure security. **Never commit your actual .env files to version control.**

1. Copy the `.env.example` file in the server directory to create your own `.env` file:
   ```
   cp server/.env.example server/.env
   ```

2. Update the values in the `.env` file with your own credentials. Pay special attention to:
   - Database credentials
   - JWT secret (use a strong, randomly generated string)
   - Admin credentials

### Admin User Setup

1. After setting up your environment variables, create an admin user:
   ```
   cd server
   npm run create-admin
   ```
   
   Or for a specific user:
   ```
   # First ensure you've set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME in your .env file
   npm run create-ebrahim-admin  
   ```

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/inventory-management.git
   cd inventory-management
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Set up your database:
   ```
   cd ../server
   npx prisma migrate dev
   ```

5. Start the server:
   ```
   npm run start
   ```

6. In a new terminal, start the client:
   ```
   cd ../client
   npm run dev
   ```

7. Access the application at http://localhost:3000

## AWS Free Tier Deployment

This application is designed to work well with AWS Free Tier services:

1. EC2 (t2.micro) for hosting the server
2. RDS PostgreSQL for the database
3. S3 (optional) for image storage

Follow the deployment instructions in the documentation for AWS-specific setup.

## License

This project is licensed under the MIT License - see the LICENSE file for details.