import { Router } from "express";
import { 
  getUsers, 
  deleteUser, 
  createUser, 
  getUserById, 
  updateUser, 
  login,
  setUserAsAdmin,
  validateToken
} from "../controllers/userController";
import { authenticate, requireAdmin, requireAdminOrSelf } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/login", login);

// Token validation route
router.get("/validate-token", authenticate, validateToken);

// Protected routes - require authentication
router.get("/", authenticate, getUsers);
router.get("/:userId", authenticate, requireAdminOrSelf, getUserById);

// Admin-only routes
router.post("/", authenticate, requireAdmin, createUser);
router.put("/:userId", authenticate, requireAdminOrSelf, updateUser);
router.delete("/:userId", authenticate, requireAdmin, deleteUser);
router.put("/:userId/set-admin", authenticate, requireAdmin, setUserAsAdmin);

export default router;