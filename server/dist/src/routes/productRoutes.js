"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const cognitoAuth_1 = require("../middleware/cognitoAuth");
const router = (0, express_1.Router)();
// Public routes
router.get("/", productController_1.getProducts);
router.get("/categories", productController_1.getCategories);
router.get("/tags", productController_1.getTags);
// Protected routes (require authentication and admin role)
router.post("/", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, productController_1.createProduct);
router.put("/:productId", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, productController_1.updateProduct);
router.delete("/:productId", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, productController_1.deleteProduct);
exports.default = router;
