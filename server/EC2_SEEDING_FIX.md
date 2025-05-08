# Fixing the Database Seeding Issue on EC2

This document explains how to fix the seeding issues when running the seed script on EC2.

## Problem 1: Missing Password Field

The error `Argument 'password' is missing` occurs because the seed script is trying to create user records without the required `password` field. The `Users` table in the Prisma schema requires a `password` field, but this field is missing from the users.json seed data.

## Problem 2: Foreign Key Constraints

The error `Foreign key constraint violated on the constraint: Sales_productId_fkey` occurs because the seed script is trying to delete tables in an order that violates foreign key constraints. Tables with foreign key references should be deleted before the tables they reference.

## Automated Fix in CI/CD

The GitHub Actions workflow has been updated to:
1. Install bcrypt during deployment
2. Run the prisma generate command 
3. Run the database seed script with better error handling
4. Continue the deployment even if the seed script encounters non-critical errors

## Manual Fix for EC2

If you need to fix these issues manually on an existing EC2 instance, follow these steps:

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

4. Update the seed.ts file to include password handling and proper foreign key constraint handling:
   ```bash
   nano prisma/seed.ts
   ```

   Replace the content with the updated seed script:
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

   async function deleteAllData() {
     // Delete data in the correct order to respect foreign key constraints
     // Tables with foreign key references must be deleted before the tables they reference
     const deleteOrder = [
       // First delete tables that reference other tables
       "Sales",
       "SalesSummary", 
       "Purchases",
       "PurchaseSummary",
       "Expenses",
       "ExpenseByCategory",
       "ExpenseSummary",
       
       // Then delete the referenced tables
       "Products",
       "Users",
     ];

     for (const modelName of deleteOrder) {
       try {
         const model: any = prisma[modelName.toLowerCase() as keyof typeof prisma];
         if (model) {
           await model.deleteMany({});
           console.log(`Cleared data from ${modelName}`);
         } else {
           console.error(
             `Model ${modelName} not found. Please ensure the model name is correctly specified.`
           );
         }
       } catch (error) {
         console.error(`Error deleting data from ${modelName}:`, error);
       }
     }
   }

   async function main() {
     const dataDirectory = path.join(__dirname, "seedData");

     // Define the order for seeding (based on dependencies)
     const seedOrder = [
       // First seed tables that are referenced by others
       "users.json",
       "products.json",
       
       // Then seed the tables with foreign key references
       "expenseSummary.json",
       "sales.json",
       "salesSummary.json",
       "purchases.json",
       "purchaseSummary.json",
       "expenses.json",
       "expenseByCategory.json",
     ];

     try {
       await deleteAllData();
       
       // Hash the default password once
       const defaultPassword = await hashPassword("password123");

       for (const fileName of seedOrder) {
         try {
           const filePath = path.join(dataDirectory, fileName);
           if (!fs.existsSync(filePath)) {
             console.log(`File ${fileName} not found, skipping...`);
             continue;
           }
           
           const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
           const modelName = path.basename(fileName, path.extname(fileName));
           const model: any = prisma[modelName as keyof typeof prisma];

           if (!model) {
             console.error(`No Prisma model matches the file name: ${fileName}`);
             continue;
           }

           for (const data of jsonData) {
             try {
               // Add password for User model if it's missing
               if (modelName === "users" && !data.password) {
                 data.password = defaultPassword;
               }
               
               await model.create({
                 data,
               });
             } catch (error) {
               console.error(`Error creating ${modelName} record:`, error);
               console.error('Data:', JSON.stringify(data, null, 2));
             }
           }

           console.log(`Seeded ${modelName} with data from ${fileName}`);
         } catch (error) {
           console.error(`Error processing file ${fileName}:`, error);
         }
       }
     } catch (error) {
       console.error("Error during seeding process:", error);
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

## Understanding Foreign Key Constraints

Foreign key constraints ensure data integrity by preventing the deletion of records that are referenced by other tables. In our database:

1. The `Sales` table has a foreign key reference to the `Products` table through the `productId` field
2. When trying to delete all products, the database refuses because there are sales records that reference those products
3. To resolve this, we must delete the `Sales` records before deleting the `Products` records

The updated seed script now handles this correctly by deleting tables in the proper order and adding better error handling to continue through non-critical issues. 