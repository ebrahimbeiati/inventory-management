import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const prisma = new PrismaClient();

// Initialize Cognito JWT verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

// Verify user middleware
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  console.log('Auth header:', authHeader);
  
  if (!authHeader) {
    console.log('No auth header provided');
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token received:', token ? 'Yes' : 'No');
  
  try {
    console.log('Verifying token with Cognito...');
    const payload = await verifier.verify(token);
    console.log('Token verified successfully');
    console.log('User payload:', {
      userId: payload.sub,
      email: payload.email,
      role: payload['custom:role'] || 'Employee'
    });
    
    // Find user in database
    const user = await prisma.users.findUnique({
      where: { userId: payload.sub }
    });

    if (!user) {
      console.log('User not found in database');
      res.status(401).json({ message: 'Invalid user' });
      return;
    }

    if (user.status !== 'Active') {
      console.log('User is not active');
      res.status(403).json({ message: 'User account is inactive' });
      return;
    }

    console.log('User verified:', { userId: user.userId, email: user.email, role: user.role });
    (req as any).user = {
      userId: user.userId,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    return;
  }
  
  next();
};

// Middleware to check if user is active
export const isActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = (req as any).user;
  
  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  try {
    const dbUser = await prisma.users.findUnique({
      where: { userId: user.userId }
    });

    if (!dbUser || dbUser.status !== 'Active') {
      res.status(403).json({ message: 'Access denied. Account is inactive.' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Error checking user status:', error);
    res.status(500).json({ message: 'Error checking user status' });
  }
}; 