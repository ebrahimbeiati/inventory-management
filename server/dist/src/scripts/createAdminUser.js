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
const cognitoService_1 = require("../services/cognitoService");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// Configuration - customize these values
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Should be secure in production
// Validate required environment variables
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    process.exit(1);
}
// After validation, we can safely assert these are strings
const adminEmail = ADMIN_EMAIL;
const adminPassword = ADMIN_PASSWORD;
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting admin user creation...');
            console.log('Environment variables:', {
                email: adminEmail,
                password: adminPassword ? '****' : 'not set'
            });
            // Check if admin already exists
            const existingAdmin = yield prisma.users.findFirst({
                where: {
                    email: adminEmail,
                    role: 'Admin'
                }
            });
            if (existingAdmin) {
                return;
            }
            // Create admin in Cognito
            yield cognitoService_1.CognitoService.createAdminUser(adminEmail, adminPassword);
            // Create admin in database without password
            const adminUser = yield prisma.users.create({
                data: {
                    userId: adminEmail,
                    name: 'Admin User',
                    email: adminEmail,
                    role: 'admin',
                    status: 'Active',
                    createdAt: new Date().toISOString(),
                    lastLogin: null
                }
            });
        }
        catch (error) {
            console.error('Error creating admin user:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
createAdminUser();
