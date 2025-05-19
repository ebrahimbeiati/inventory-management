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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.setUserAsAdmin = exports.login = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const roles_1 = require("../constants/roles");
const cognitoService_1 = require("../services/cognitoService");
const prisma = new client_1.PrismaClient();
const createTestUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if any users exist
        const userCount = yield prisma.users.count();
        console.log('Current user count:', userCount);
        if (userCount === 0) {
            console.log('Creating test user...');
            yield prisma.users.create({
                data: {
                    userId: (0, uuid_1.v4)(),
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'employee',
                    status: 'Active',
                    createdAt: new Date().toISOString()
                }
            });
            console.log('Test user created');
        }
    }
    catch (error) {
        console.error('Error creating test user:', error);
    }
});
// Call this function when the server starts
createTestUser();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        console.log("=== GetUsers Debug Info ===");
        console.log("Request headers:", req.headers);
        console.log("Authenticated user:", req.user);
        console.log("Search term:", search);
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
            orderBy: { name: 'asc' },
            select: {
                userId: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                lastLogin: true
            }
        });
        console.log("Found users count:", users.length);
        console.log("Users found:", users);
        res.json(users);
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
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role = roles_1.ROLES.EMPLOYEE, status = 'Active' } = req.body;
        // Validate required fields
        if (!name || !email) {
            res.status(400).json({ error: 'Name and email are required' });
            return;
        }
        // Validate role
        if (!Object.values(roles_1.ROLES).includes(role)) {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }
        // Check if user already exists
        const existingUser = yield prisma.users.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({ error: 'User with this email already exists' });
            return;
        }
        // Create user in database
        const user = yield prisma.users.create({
            data: {
                userId: (0, uuid_1.v4)(),
                name,
                email,
                role,
                status,
                createdAt: new Date().toISOString()
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
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
        const { name, email, role, status } = req.body;
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
        if (role)
            updateData.role = role;
        if (status)
            updateData.status = status;
        // Update the user
        const updatedUser = yield prisma.users.update({
            where: { userId },
            data: updateData
        });
        console.log(`Successfully updated user with ID: ${userId}`);
        res.status(200).json(updatedUser);
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
        if (existingUser.role === 'admin') {
            const adminCount = yield prisma.users.count({
                where: { role: 'admin' }
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
        console.log('Login attempt with:', { email });
        if (!email || !password) {
            console.log('Missing credentials');
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        // Authenticate with Cognito
        try {
            const { token, user } = yield cognitoService_1.CognitoService.signIn(email, password);
            res.json({ token, user });
        }
        catch (authError) {
            console.error('Cognito authentication failed:', authError);
            res.status(401).json({ message: "Invalid credentials" });
        }
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
            data: { role: "admin" }
        });
        res.json({
            message: "User role updated to admin",
            user: updatedUser
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
