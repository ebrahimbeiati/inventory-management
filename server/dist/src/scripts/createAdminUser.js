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
// Load environment variables
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// Configuration - customize these values
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Should be secure in production
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Checking if admin user already exists...');
            // Check if admin already exists
            const existingAdmin = yield prisma.users.findFirst({
                where: {
                    email: ADMIN_EMAIL,
                    role: 'Admin'
                }
            });
            if (existingAdmin) {
                console.log('Admin user already exists:', existingAdmin.email);
                return;
            }
            // Create admin user
            const adminUser = yield prisma.users.create({
                data: {
                    userId: (0, uuid_1.v4)(),
                    name: ADMIN_NAME,
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD, // In production, use bcrypt to hash password
                    role: 'Admin',
                    status: 'Active',
                    createdAt: new Date().toISOString()
                }
            });
            console.log('Admin user created successfully:');
            console.log(`Name: ${adminUser.name}`);
            console.log(`Email: ${adminUser.email}`);
            console.log(`Role: ${adminUser.role}`);
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
createAdminUser();
// Instructions for use:
// 1. Run this script with: npx ts-node src/scripts/createAdminUser.ts
// 2. You can customize the admin user by setting environment variables:
//    - ADMIN_EMAIL
//    - ADMIN_PASSWORD
//    - ADMIN_NAME
// 3. In production, make sure to use secure passwords and store them safely 
