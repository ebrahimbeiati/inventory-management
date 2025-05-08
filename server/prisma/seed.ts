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