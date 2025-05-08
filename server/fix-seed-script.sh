#!/bin/bash

# Script to fix database seeding issues on EC2
echo "Starting seed script fix..."

# Check if bcrypt is installed
if ! npm list bcrypt | grep -q bcrypt; then
  echo "Installing bcrypt..."
  npm install bcrypt
  npm install @types/bcrypt --save-dev
fi

# Create a DB truncation script that bypasses foreign key constraints
echo "Creating database truncation script..."
cat > prisma/truncate-db.ts << 'EOF'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function truncateAllTables() {
  // Using raw SQL to disable foreign key checks and truncate tables
  try {
    // PostgreSQL command to disable triggers temporarily
    await prisma.$executeRaw`SET session_replication_role = 'replica';`;
    
    // Truncate all tables in the correct order
    await prisma.$executeRaw`TRUNCATE TABLE "Sales" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "SalesSummary" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Purchases" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "PurchaseSummary" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Expenses" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "ExpenseByCategory" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "ExpenseSummary" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Products" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Users" CASCADE;`;
    
    // Re-enable triggers
    await prisma.$executeRaw`SET session_replication_role = 'origin';`;
    
    console.log('All tables truncated successfully');
  } catch (error) {
    console.error('Error truncating tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

truncateAllTables();
EOF

# Update the seed script
echo "Updating seed.ts with foreign key handling..."
cat > prisma/seed.ts << 'EOF'
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
EOF

echo "Generating Prisma client..."
npx prisma generate

echo "Truncating database tables..."
npx ts-node prisma/truncate-db.ts

echo "Running seed script..."
npm run seed

echo "Fix process completed!" 