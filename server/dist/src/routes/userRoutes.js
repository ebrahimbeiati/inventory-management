"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post("/login", userController_1.login);
// Token validation route
router.get("/validate-token", auth_1.authenticate, userController_1.validateToken);
// Protected routes - require authentication
router.get("/", auth_1.authenticate, userController_1.getUsers);
router.get("/:userId", auth_1.authenticate, auth_1.requireAdminOrSelf, userController_1.getUserById);
// Admin-only routes
router.post("/", auth_1.authenticate, auth_1.requireAdmin, userController_1.createUser);
router.put("/:userId", auth_1.authenticate, auth_1.requireAdminOrSelf, userController_1.updateUser);
router.delete("/:userId", auth_1.authenticate, auth_1.requireAdmin, userController_1.deleteUser);
router.put("/:userId/set-admin", auth_1.authenticate, auth_1.requireAdmin, userController_1.setUserAsAdmin);
exports.default = router;
