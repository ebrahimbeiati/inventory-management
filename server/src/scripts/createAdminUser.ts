import { CognitoService } from '../services/cognitoService';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Configuration - customize these values
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Should be secure in production

// Validate required environment variables
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  process.exit(1);
}

// After validation, we can safely assert these are strings
const adminEmail = ADMIN_EMAIL as string;
const adminPassword = ADMIN_PASSWORD as string;

async function createAdminUser() {
  try {
    console.log('Starting admin user creation...');
    console.log('Environment variables:', {
      email: adminEmail,
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
      return;
    }
    
    
    // Create admin in Cognito
    await CognitoService.createAdminUser(adminEmail, adminPassword);

    // Create admin in database without password
    const adminUser = await prisma.users.create({
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
  
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
