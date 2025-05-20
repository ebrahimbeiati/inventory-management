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
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  const authHeader = req.headers.authorization;
  
  
  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    console.log('Verifying token with Cognito...');
    const payload = await verifier.verify(token);
    // Find user in database
    const user = await prisma.users.findUnique({
      where: { userId: payload.sub }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid user' });
      return;
    }

    if (user.status !== 'Active') {
      res.status(403).json({ message: 'User account is inactive' });
      return;
    }

    (req as any).user = {
      userId: user.userId,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
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
    res.status(500).json({ message: 'Error checking user status' });
  }
}; 