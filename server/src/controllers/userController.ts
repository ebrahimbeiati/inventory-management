import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from "../middleware/auth";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    console.log("Fetching users with search:", search);
    
    // Get users with search filter if provided
    const users = await prisma.users.findMany({
      where: search 
        ? {
            OR: [
              { name: { contains: search as string, mode: 'insensitive' as const } },
              { email: { contains: search as string, mode: 'insensitive' as const } },
              { role: { contains: search as string, mode: 'insensitive' as const } }
            ]
          } 
        : {},
      orderBy: { name: 'asc' }
    });
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    const user = await prisma.users.findUnique({
      where: { userId }
    });
    
    if (!user) {
      res.status(404).json({ message: `User with ID ${userId} not found` });
      return;
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Creating user with data:", req.body);
    
    // Validate required fields
    const { name, email, password, role, status } = req.body;
    
    if (!name || !email || !password) {
      console.log("Missing required fields for user creation");
      res.status(400).json({ message: "Name, email, and password are required" });
      return;
    }
    
    // Check if user with same email already exists
    const existingUser = await prisma.users.findFirst({
      where: { email }
    });
    
    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      res.status(409).json({ message: `User with email ${email} already exists` });
      return;
    }
    
    // Create the user with a generated UUID
    const newUser = await prisma.users.create({
      data: {
        userId: uuidv4(),
        name,
        email,
        password, // In a real app, this should be hashed
        role: role || "Employee",
        status: status || "Active",
        createdAt: new Date().toISOString()
      }
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    console.log("User created successfully:", userWithoutPassword);
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    console.log(`Updating user with ID: ${userId}, Data:`, req.body);
    
    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { userId }
    });
    
    if (!existingUser) {
      console.log(`User with ID ${userId} not found`);
      res.status(404).json({ message: `User with ID ${userId} not found` });
      return;
    }
    
    // Extract update data, excluding userId which can't be changed
    const { name, email, password, role, status } = req.body;
    
    // If changing email, check that it's not already taken by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.users.findFirst({
        where: {
          email,
          userId: { not: userId } // Exclude current user from check
        }
      });
      
      if (emailExists) {
        console.log(`Email ${email} is already in use by another user`);
        res.status(409).json({ message: `Email ${email} is already in use by another user` });
        return;
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // Should be hashed in a real app
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    
    // Update the user
    const updatedUser = await prisma.users.update({
      where: { userId },
      data: updateData
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    console.log(`Successfully updated user with ID: ${userId}`);
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  
  try {
    console.log(`Attempting to delete user with ID: ${userId}`);
    
    // Check if the user exists
    const existingUser = await prisma.users.findUnique({
      where: { userId }
    });
    
    if (!existingUser) {
      console.log(`User with ID ${userId} not found`);
      res.status(404).json({ message: `User with ID ${userId} not found` });
      return;
    }
    
    // If the user is an admin, check if they're the last admin user
    if (existingUser.role === 'Admin') {
      const adminCount = await prisma.users.count({
        where: { role: 'Admin' }
      });
      
      if (adminCount <= 1) {
        console.log(`Prevented deletion of the last admin user (${existingUser.email})`);
        res.status(403).json({ 
          message: "Cannot delete the last admin user. Create another admin user first before deleting this one." 
        });
        return;
      }
    }
    
    // Delete the user
    await prisma.users.delete({
      where: { userId }
    });
    
    console.log(`Successfully deleted user with ID: ${userId}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Login endpoint
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
    
    // Find user by email
    const user = await prisma.users.findFirst({
      where: { email }
    });
    
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
    // In a real app, use bcrypt to compare password hashes
    const isPasswordValid = user.password === password;
    
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    
    // Update last login time
    await prisma.users.update({
      where: { userId: user.userId },
      data: { lastLogin: new Date().toISOString() }
    });
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

// Function to set a user as admin
export const setUserAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    // Check if the user exists
    const user = await prisma.users.findUnique({
      where: { userId }
    });
    
    if (!user) {
      res.status(404).json({ message: `User with ID ${userId} not found` });
      return;
    }
    
    // Update user to admin role
    const updatedUser = await prisma.users.update({
      where: { userId },
      data: { role: "Admin" }
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: "User role updated to Admin",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error setting user as admin:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

// Token validation endpoint
export const validateToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Authentication middleware already verified the token and attached user to request
    // We just need to return a success response
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      res.status(401).json({ valid: false, message: "Invalid token" });
      return;
    }
    
    // Optionally, you can check if the user still exists and is active
    const user = await prisma.users.findUnique({
      where: { userId }
    });
    
    if (!user || user.status !== 'Active') {
      res.status(401).json({ valid: false, message: "User not found or inactive" });
      return;
    }
    
    res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ valid: false, message: "Error validating token" });
  }
};