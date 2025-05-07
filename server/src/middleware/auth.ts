import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Secret should be in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'inventory-management-secret-key';

// Extended Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Generate JWT for a user
export const generateToken = (user: any): string => {
  // Remove sensitive information
  const { password, ...userInfo } = user;
  
  return jwt.sign(
    userInfo,
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin role check middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // First make sure user is authenticated
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  // Check if user has admin role
  if (req.user.role !== 'Admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  
  next();
};

// For operations that should only be performed by admins or the user themselves
export const requireAdminOrSelf = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  // The userId from the route parameter
  const { userId } = req.params;
  
  // Allow if admin or if it's the user's own data
  if (req.user.role === 'Admin' || req.user.userId === userId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}; 