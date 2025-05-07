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
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables
dotenv_1.default.config();
// Create a local .env file for admin credentials if it doesn't exist
const envPath = path_1.default.join(process.cwd(), '.env');
if (!process.env.ADMIN_EMAIL && !fs_1.default.existsSync(envPath)) {
    console.log('Creating sample .env file with admin credentials template...');
    const envContent = `# Admin credentials - UPDATE THESE VALUES!
ADMIN_EMAIL=ebrahim@example.com
ADMIN_PASSWORD=change_this_password
ADMIN_NAME=Ebrahim
`;
    fs_1.default.writeFileSync(envPath, envContent);
    console.log(`Created .env file at ${envPath}`);
    console.log('Please update the values in this file and run the script again.');
    process.exit(0);
}
const prisma = new client_1.PrismaClient();
// Get admin configuration from environment variables with fallbacks to ensure
// we always have string values even if the environment variables are undefined
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ebrahim@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin User";
// Log what we're using to create the admin
console.log('Using the following admin credentials:');
console.log(`Email: ${ADMIN_EMAIL}`);
console.log(`Name: ${ADMIN_NAME}`);
console.log(`Password: ${ADMIN_PASSWORD.replace(/./g, '*')}`);
function createEbrahimAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Checking if admin user already exists...');
            // Check if admin already exists
            const existingAdmin = yield prisma.users.findFirst({
                where: {
                    email: ADMIN_EMAIL,
                }
            });
            if (existingAdmin) {
                console.log('Admin user already exists - updating to admin role');
                // Update existing user to admin role
                const updatedUser = yield prisma.users.update({
                    where: { userId: existingAdmin.userId },
                    data: {
                        role: 'Admin',
                        password: ADMIN_PASSWORD
                    }
                });
                console.log('Admin user updated successfully:');
                console.log(`Name: ${updatedUser.name}`);
                console.log(`Email: ${updatedUser.email}`);
                console.log(`Role: ${updatedUser.role}`);
                return;
            }
            // Create admin user
            const adminUser = yield prisma.users.create({
                data: {
                    userId: (0, uuid_1.v4)(),
                    name: ADMIN_NAME,
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    role: 'Admin',
                    status: 'Active',
                    createdAt: new Date().toISOString()
                }
            });
            console.log('Admin user created successfully:');
            console.log(`Name: ${adminUser.name}`);
            console.log(`Email: ${adminUser.email}`);
            console.log(`Role: ${adminUser.role}`);
            console.log('\n*** IMPORTANT: Your admin account has been created! ***');
            console.log('Please change your password after your first login for security reasons.');
        }
        catch (error) {
            console.error('Error creating admin user:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
// Run the function
createEbrahimAdmin();
