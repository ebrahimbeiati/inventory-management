"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrSelf = exports.requireAdmin = exports.authenticate = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Secret should be in environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'inventory-management-secret-key';
// Generate JWT for a user
const generateToken = (user) => {
    // Remove sensitive information
    const { password } = user, userInfo = __rest(user, ["password"]);
    return jsonwebtoken_1.default.sign(userInfo, JWT_SECRET, { expiresIn: '24h' });
};
exports.generateToken = generateToken;
// Authentication middleware
const authenticate = (req, res, next) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
// Admin role check middleware
const requireAdmin = (req, res, next) => {
    // First make sure user is authenticated
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    // Check if user has admin role
    if (req.user.role !== 'Admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
// For operations that should only be performed by admins or the user themselves
const requireAdminOrSelf = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
    }
    // The userId from the route parameter
    const { userId } = req.params;
    // Allow if admin or if it's the user's own data
    if (req.user.role === 'Admin' || req.user.userId === userId) {
        next();
    }
    else {
        res.status(403).json({ message: 'Access denied' });
    }
};
exports.requireAdminOrSelf = requireAdminOrSelf;
