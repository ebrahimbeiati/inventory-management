import { Router } from "express";
import { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct,
  getCategories,
  getTags
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);
router.get("/categories", getCategories);
router.get("/tags", getTags);

export default router;
