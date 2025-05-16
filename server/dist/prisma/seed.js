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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData() {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield deleteAllData();
            // Then seed new data
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
                            // Create records
                            if (modelName === "Sales" || modelName === "Purchases") {
                                const { productId } = data, restData = __rest(data, ["productId"]);
                                yield model.create({
                                    data: Object.assign(Object.assign({}, restData), { product: {
                                            connect: {
                                                productId: productId,
                                            },
                                        } }),
                                });
                            }
                            else if (modelName === "ExpenseByCategory") {
                                const { expenseSummaryId } = data, restData = __rest(data, ["expenseSummaryId"]);
                                yield model.create({
                                    data: Object.assign(Object.assign({}, restData), { expenseSummary: {
                                            connect: {
                                                expenseSummaryId: expenseSummaryId,
                                            },
                                        } }),
                                });
                            }
                            else if (modelName === "Users") {
                                // Add required fields for Users with proper defaults
                                yield model.create({
                                    data: Object.assign(Object.assign({}, data), { password: "defaultPassword123", role: "Employee", status: "Active", createdAt: new Date().toISOString(), lastLogin: null }),
                                });
                            }
                            else {
                                yield model.create({
                                    data,
                                });
                            }
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
