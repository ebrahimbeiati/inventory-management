"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const cognitoAuth_1 = require("../middleware/cognitoAuth");
const router = (0, express_1.Router)();
// Public routes
router.post("/login", userController_1.login);
// Protected routes
router.get("/validate-token", cognitoAuth_1.authenticate, userController_1.validateToken);
router.get("/", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, userController_1.getUsers);
router.get("/:userId", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdminOrSelf, userController_1.getUserById);
router.post("/", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, userController_1.createUser);
router.put("/:userId", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdminOrSelf, userController_1.updateUser);
router.delete("/:userId", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, userController_1.deleteUser);
router.post("/:userId/admin", cognitoAuth_1.authenticate, cognitoAuth_1.requireAdmin, userController_1.setUserAsAdmin);
exports.default = router;
