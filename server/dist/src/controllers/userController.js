"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.setUserAsAdmin = exports.login = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const auth_1 = require("../middleware/auth");
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        console.log("Fetching users with search:", search);
        // Get users with search filter if provided
        const users = yield prisma.users.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { role: { contains: search, mode: 'insensitive' } }
                    ]
                }
                : {},
            orderBy: { name: 'asc' }
        });
        // Remove passwords from response
        const usersWithoutPasswords = users.map(user => {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
        res.json(usersWithoutPasswords);
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Error retrieving users" });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield prisma.users.findUnique({
            where: { userId }
        });
        if (!user) {
            res.status(404).json({ message: `User with ID ${userId} not found` });
            return;
        }
        // Remove password from response
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json(userWithoutPassword);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Creating user with data:", req.body);
        // Validate required fields
        const { name, email, password, role, status } = req.body;
        if (!name || !email || !password) {
            console.log("Missing required fields for user creation");
            res.status(400).json({ message: "Name, email, and password are required" });
            return;
        }
        // Check if user with same email already exists
        const existingUser = yield prisma.users.findFirst({
            where: { email }
        });
        if (existingUser) {
            console.log(`User with email ${email} already exists`);
            res.status(409).json({ message: `User with email ${email} already exists` });
            return;
        }
        // Create the user with a generated UUID
        const newUser = yield prisma.users.create({
            data: {
                userId: (0, uuid_1.v4)(),
                name,
                email,
                password, // In a real app, this should be hashed
                role: role || "Employee",
                status: status || "Active",
                createdAt: new Date().toISOString()
            }
        });
        // Remove password from response
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        console.log("User created successfully:", userWithoutPassword);
        res.status(201).json(userWithoutPassword);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        console.log(`Updating user with ID: ${userId}, Data:`, req.body);
        // Check if user exists
        const existingUser = yield prisma.users.findUnique({
            where: { userId }
        });
        if (!existingUser) {
            console.log(`User with ID ${userId} not found`);
            res.status(404).json({ message: `User with ID ${userId} not found` });
            return;
        }
        // Extract update data, excluding userId which can't be changed
        const { name, email, password, role, status } = req.body;
        // If changing email, check that it's not already taken by another user
        if (email && email !== existingUser.email) {
            const emailExists = yield prisma.users.findFirst({
                where: {
                    email,
                    userId: { not: userId } // Exclude current user from check
                }
            });
            if (emailExists) {
                console.log(`Email ${email} is already in use by another user`);
                res.status(409).json({ message: `Email ${email} is already in use by another user` });
                return;
            }
        }
        // Prepare update data
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password)
            updateData.password = password; // Should be hashed in a real app
        if (role)
            updateData.role = role;
        if (status)
            updateData.status = status;
        // Update the user
        const updatedUser = yield prisma.users.update({
            where: { userId },
            data: updateData
        });
        // Remove password from response
        const { password: _ } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        console.log(`Successfully updated user with ID: ${userId}`);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        console.log(`Attempting to delete user with ID: ${userId}`);
        // Check if the user exists
        const existingUser = yield prisma.users.findUnique({
            where: { userId }
        });
        if (!existingUser) {
            console.log(`User with ID ${userId} not found`);
            res.status(404).json({ message: `User with ID ${userId} not found` });
            return;
        }
        // If the user is an admin, check if they're the last admin user
        if (existingUser.role === 'Admin') {
            const adminCount = yield prisma.users.count({
                where: { role: 'Admin' }
            });
            if (adminCount <= 1) {
                console.log(`Prevented deletion of the last admin user (${existingUser.email})`);
                res.status(403).json({
                    message: "Cannot delete the last admin user. Create another admin user first before deleting this one."
                });
                return;
            }
        }
        // Delete the user
        yield prisma.users.delete({
            where: { userId }
        });
        console.log(`Successfully deleted user with ID: ${userId}`);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
});
exports.deleteUser = deleteUser;
// Login endpoint
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        // Find user by email
        const user = yield prisma.users.findFirst({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // In a real app, use bcrypt to compare password hashes
        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        // Update last login time
        yield prisma.users.update({
            where: { userId: user.userId },
            data: { lastLogin: new Date().toISOString() }
        });
        // Generate JWT token
        const token = (0, auth_1.generateToken)(user);
        // Remove password from response
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json({
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login" });
    }
});
exports.login = login;
// Function to set a user as admin
const setUserAsAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Check if the user exists
        const user = yield prisma.users.findUnique({
            where: { userId }
        });
        if (!user) {
            res.status(404).json({ message: `User with ID ${userId} not found` });
            return;
        }
        // Update user to admin role
        const updatedUser = yield prisma.users.update({
            where: { userId },
            data: { role: "Admin" }
        });
        // Remove password from response
        const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        res.json({
            message: "User role updated to Admin",
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error("Error setting user as admin:", error);
        res.status(500).json({ message: "Error updating user role" });
    }
});
exports.setUserAsAdmin = setUserAsAdmin;
// Token validation endpoint
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Authentication middleware already verified the token and attached user to request
        // We just need to return a success response
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ valid: false, message: "Invalid token" });
            return;
        }
        // Optionally, you can check if the user still exists and is active
        const user = yield prisma.users.findUnique({
            where: { userId }
        });
        if (!user || user.status !== 'Active') {
            res.status(401).json({ valid: false, message: "User not found or inactive" });
            return;
        }
        res.status(200).json({ valid: true });
    }
    catch (error) {
        console.error("Token validation error:", error);
        res.status(500).json({ valid: false, message: "Error validating token" });
    }
});
exports.validateToken = validateToken;
