import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;