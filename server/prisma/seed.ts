import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData() {
  const deleteOrder = [
    "Sales",
    "SalesSummary", 
    "Purchases",
    "PurchaseSummary",
    "Expenses",
    "ExpenseByCategory",
    "ExpenseSummary",
    "Products",
    "Users",
  ];

  for (const modelName of deleteOrder) {
    try {
      const model: any = prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1) as keyof typeof prisma];
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
    "users.json",
    "products.json",
    "expenseSummary.json",
    "expenseByCategory.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
    "expenses.json",
  ];

  try {
    // First clear all existing data
    await deleteAllData();

    // Then seed new data
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
            // Create records
            if (modelName === "Sales" || modelName === "Purchases") {
              const { productId, ...restData } = data;
              await model.create({
                data: {
                  ...restData,
                  product: {
                    connect: {
                      productId: productId,
                    },
                  },
                },
              });
            } else if (modelName === "ExpenseByCategory") {
              const { expenseSummaryId, ...restData } = data;
              await model.create({
                data: {
                  ...restData,
                  expenseSummary: {
                    connect: {
                      expenseSummaryId: expenseSummaryId,
                    },
                  },
                },
              });
            } else if (modelName === "Users") {
              // Add required fields for Users with proper defaults
              await model.create({
                data: {
                  ...data,
                  role: "Employee", // Default role
                  status: "Active", // Default status
                  createdAt: new Date().toISOString(), // Current timestamp
                  lastLogin: null, // No last login for new users
                },
              });
            } else {
              await model.create({
                data,
              });
            }
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