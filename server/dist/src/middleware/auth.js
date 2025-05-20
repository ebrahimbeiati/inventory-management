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
exports.isActive = exports.isAdmin = exports.verifyToken = void 0;
const client_1 = require("@prisma/client");
const aws_jwt_verify_1 = require("aws-jwt-verify");
const prisma = new client_1.PrismaClient();
// Initialize Cognito JWT verifier
const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: 'id',
    clientId: process.env.COGNITO_CLIENT_ID,
});
// Verify user middleware
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        console.log('Verifying token with Cognito...');
        const payload = yield verifier.verify(token);
        // Find user in database
        const user = yield prisma.users.findUnique({
            where: { userId: payload.sub }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid user' });
            return;
        }
        if (user.status !== 'Active') {
            res.status(403).json({ message: 'User account is inactive' });
            return;
        }
        req.user = {
            userId: user.userId,
            email: user.email,
            role: user.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});
exports.verifyToken = verifyToken;
// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
// Middleware to check if user is active
const isActive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }
    try {
        const dbUser = yield prisma.users.findUnique({
            where: { userId: user.userId }
        });
        if (!dbUser || dbUser.status !== 'Active') {
            res.status(403).json({ message: 'Access denied. Account is inactive.' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking user status' });
    }
});
exports.isActive = isActive;
