import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Configuration - customize these values
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ; // Should be secure in production
const ADMIN_NAME = process.env.ADMIN_NAME;

// Validate required environment variables
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
  console.error('Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME');
  process.exit(1);
}

// After validation, we can safely assert these are strings
const adminEmail = ADMIN_EMAIL as string;
const adminPassword = ADMIN_PASSWORD as string;
const adminName = ADMIN_NAME as string;

async function createAdminUser() {
  try {
    console.log('Starting admin user creation...');
    console.log('Environment variables:', {
      email: adminEmail,
      name: adminName,
      password: adminPassword ? '****' : 'not set'
    });
    
    // Check if admin already exists
    const existingAdmin = await prisma.users.findFirst({
      where: {
        email: adminEmail,
        role: 'Admin'
      }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }
    
    console.log('Creating new admin user...');
    
    // Create admin user
    const adminUser = await prisma.users.create({
      data: {
        userId: uuidv4(),
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'Admin',
        status: 'Active',
        createdAt: new Date().toISOString()
      }
    });
    
    console.log('Admin user created successfully:');
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
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