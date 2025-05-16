import { Request, Response, NextFunction } from 'express';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { fromEnv } from '@aws-sdk/credential-providers';

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'eu-west-2',
  credentials: fromEnv()
});

// Extended Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('=== Authentication Debug ===');
  console.log('Request path:', req.path);
  console.log('Request method:', req.method);
  
  // Get token from header
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token present:', !!token);
  
  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  try {
    // Decode the ID token to get user information
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', {
      sub: tokenPayload.sub,
      email: tokenPayload.email,
      role: tokenPayload['custom:role'],
      exp: new Date(tokenPayload.exp * 1000).toISOString()
    });
    
    // Extract user information from the token
    const user = {
      userId: tokenPayload.sub,
      email: tokenPayload.email,
      role: (tokenPayload['custom:role'] || 'Employee').toLowerCase(),
      status: 'CONFIRMED'
    };
    
    console.log('Extracted user:', user);
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin role check middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  console.log('=== Admin Check Debug ===');
  console.log('User:', req.user);
  
  if (!req.user) {
    console.log('No user found in request');
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  console.log('Checking admin role for user:', req.user);
  console.log('User role:', req.user.role);
  
  if (req.user.role?.toLowerCase() === 'admin') {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied');
    res.status(403).json({ message: 'Admin access required' });
  }
};

// For operations that should only be performed by admins or the user themselves
export const requireAdminOrSelf = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  // The userId from the route parameter
  const { userId } = req.params;
  
  // Allow if admin or if it's the user's own data (case-insensitive)
  if (req.user.role?.toLowerCase() === 'admin' || req.user.userId === userId) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}; 