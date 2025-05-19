import { Router } from "express";
import { 
  getUsers, 
  deleteUser, 
  createUser, 
  getUserById, 
  updateUser, 
  setUserAsAdmin,
  validateToken
} from "../controllers/userController";
import { authenticate, requireAdmin, requireAdminOrSelf } from "../middleware/cognitoAuth";

const router = Router();

// Protected routes
router.get("/validate-token", authenticate, validateToken);
router.get("/", authenticate, requireAdmin, getUsers);
router.get("/:userId", authenticate, requireAdminOrSelf, getUserById);
router.post("/", authenticate, requireAdmin, createUser);
router.put("/:userId", authenticate, requireAdminOrSelf, updateUser);
router.delete("/:userId", authenticate, requireAdmin, deleteUser);
router.put("/:userId/admin", authenticate, requireAdmin, setUserAsAdmin);

export default router;