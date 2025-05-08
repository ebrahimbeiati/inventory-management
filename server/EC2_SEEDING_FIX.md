# Fixing the Database Seeding Issue on EC2

This document explains how to fix the "Argument `password` is missing" error when running the seed script on EC2.

## The Problem

The error occurs because the seed script is trying to create user records without the required `password` field. The `Users` table in the Prisma schema requires a `password` field, but this field is missing from the users.json seed data.

## Automated Fix in CI/CD

The GitHub Actions workflow has been updated to:
1. Install bcrypt during deployment
2. Run the prisma generate command 
3. Run the database seed script

## Manual Fix for EC2

If you need to fix this issue manually on an existing EC2 instance, follow these steps:

1. SSH into your EC2 instance:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-ip
   ```

2. Navigate to the server directory:
   ```bash
   cd /var/www/inventory-management/server
   ```

3. Install bcrypt:
   ```bash
   npm install bcrypt
   npm install @types/bcrypt --save-dev
   ```

4. Update the seed.ts file to include password hashing:
   ```bash
   nano prisma/seed.ts
   ```

   Replace the content with the updated seed script that includes password handling:
   ```typescript
   import { PrismaClient } from "@prisma/client";
   import fs from "fs";
   import path from "path";
   import bcrypt from "bcrypt";

   const prisma = new PrismaClient();

   // Function to hash passwords
   async function hashPassword(password: string): Promise<string> {
     const saltRounds = 10;
     return bcrypt.hash(password, saltRounds);
   }

   async function deleteAllData(orderedFileNames: string[]) {
     const modelNames = orderedFileNames.map((fileName) => {
       const modelName = path.basename(fileName, path.extname(fileName));
       return modelName.charAt(0).toUpperCase() + modelName.slice(1);
     });

     for (const modelName of modelNames) {
       const model: any = prisma[modelName as keyof typeof prisma];
       if (model) {
         await model.deleteMany({});
         console.log(`Cleared data from ${modelName}`);
       } else {
         console.error(
           `Model ${modelName} not found. Please ensure the model name is correctly specified.`
         );
       }
     }
   }

   async function main() {
     const dataDirectory = path.join(__dirname, "seedData");

     const orderedFileNames = [
       "products.json",
       "expenseSummary.json",
       "sales.json",
       "salesSummary.json",
       "purchases.json",
       "purchaseSummary.json",
       "users.json",
       "expenses.json",
       "expenseByCategory.json",
     ];

     await deleteAllData(orderedFileNames);

     // Hash the default password once
     const defaultPassword = await hashPassword("password123");

     for (const fileName of orderedFileNames) {
       const filePath = path.join(dataDirectory, fileName);
       const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
       const modelName = path.basename(fileName, path.extname(fileName));
       const model: any = prisma[modelName as keyof typeof prisma];

       if (!model) {
         console.error(`No Prisma model matches the file name: ${fileName}`);
         continue;
       }

       for (const data of jsonData) {
         // Add password for User model if it's missing
         if (modelName === "users" && !data.password) {
           data.password = defaultPassword;
         }
         
         await model.create({
           data,
         });
       }

       console.log(`Seeded ${modelName} with data from ${fileName}`);
     }
   }

   main()
     .catch((e) => {
       console.error(e);
       process.exit(1);
     })
     .finally(async () => {
       await prisma.$disconnect();
     });
   ```

5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run the seed script:
   ```bash
   npm run seed
   ```

7. Restart the application:
   ```bash
   pm2 restart all
   ```

## Default User Credentials

After successful seeding, you can log in with any of the seeded users using the default password:

- Default password for all seeded users: `password123`

For security reasons, you should change these passwords after logging in for the first time.

## Alternate Approach: Update Seed Data

Another approach is to directly update the users.json file to include passwords:

1. Edit the seedData/users.json file:
   ```bash
   nano prisma/seedData/users.json
   ```

2. Add a password field to each user entry:
   ```json
   [
     {
       "userId": "3b0fd66b-a4d6-4d95-94e4-01940c99aedb",
       "name": "Carly",
       "email": "cvansalzberger0@cisco.com",
       "password": "$2b$10$YourHashedPasswordHere"
     },
     ...
   ]
   ```

This approach requires pre-hashing the passwords, so the dynamic approach in the seed.ts file is generally preferred. 