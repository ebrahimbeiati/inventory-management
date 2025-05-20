import { Router } from "express";
import { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct,
  getCategories,
  getTags
} from "../controllers/productController";
import { authenticate, requireAdmin } from "../middleware/cognitoAuth";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/tags", getTags);

// Protected routes (require authentication and admin role)
router.post("/", authenticate, requireAdmin, createProduct);
router.put("/:productId", authenticate, requireAdmin, updateProduct);
router.delete("/:productId", authenticate, requireAdmin, deleteProduct);

export default router;