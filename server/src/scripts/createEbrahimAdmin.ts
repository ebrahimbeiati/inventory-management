import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Create a local .env file for admin credentials if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
if (!process.env.ADMIN_EMAIL && !fs.existsSync(envPath)) {
  console.log('Creating sample .env file with admin credentials template...');
  const envContent = `# Admin credentials - UPDATE THESE VALUES!
ADMIN_EMAIL=ebrahim@example.com
ADMIN_PASSWORD=change_this_password
ADMIN_NAME=Ebrahim
`;
  fs.writeFileSync(envPath, envContent);
  console.log(`Created .env file at ${envPath}`);
  console.log('Please update the values in this file and run the script again.');
  process.exit(0);
}

const prisma = new PrismaClient();

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

async function createEbrahimAdmin() {
  try {
    console.log('Checking if admin user already exists...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.users.findFirst({
      where: {
        email: ADMIN_EMAIL,
      }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists - updating to admin role');
      
      // Update existing user to admin role
      const updatedUser = await prisma.users.update({
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
    const adminUser = await prisma.users.create({
      data: {
        userId: uuidv4(),
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
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createEbrahimAdmin(); 