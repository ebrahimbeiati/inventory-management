"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
// Function to hash passwords
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const saltRounds = 10;
        return bcrypt_1.default.hash(password, saltRounds);
    });
}
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
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
                const model = prisma[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
                if (model) {
                    yield model.deleteMany({});
                    console.log(`Cleared data from ${modelName}`);
                }
                else {
                    console.error(`Model ${modelName} not found. Please ensure the model name is correctly specified.`);
                }
            }
            catch (error) {
                console.error(`Error deleting data from ${modelName}:`, error);
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDirectory = path_1.default.join(__dirname, "seedData");
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
            yield deleteAllData();
            // Hash the default password once
            const defaultPassword = yield hashPassword("password123");
            for (const fileName of seedOrder) {
                try {
                    const filePath = path_1.default.join(dataDirectory, fileName);
                    if (!fs_1.default.existsSync(filePath)) {
                        console.log(`File ${fileName} not found, skipping...`);
                        continue;
                    }
                    const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
                    const modelName = path_1.default.basename(fileName, path_1.default.extname(fileName));
                    const model = prisma[modelName];
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
                            yield model.create({
                                data,
                            });
                        }
                        catch (error) {
                            console.error(`Error creating ${modelName} record:`, error);
                            console.error('Data:', JSON.stringify(data, null, 2));
                        }
                    }
                    console.log(`Seeded ${modelName} with data from ${fileName}`);
                }
                catch (error) {
                    console.error(`Error processing file ${fileName}:`, error);
                }
            }
        }
        catch (error) {
            console.error("Error during seeding process:", error);
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
