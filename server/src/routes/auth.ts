import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Verify authentication status
router.all('/verify', verifyToken, async (req, res) => {
  try {
    const user = (req as any).user;
    res.json(user);
  } catch (error) {
    console.error('Verification error:', error);
    res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router; 