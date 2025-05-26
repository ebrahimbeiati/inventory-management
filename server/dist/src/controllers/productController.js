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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, rating, stockQuantity } = req.body;
        // Validate required fields
        if (!name || price === undefined || stockQuantity === undefined) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        // Validate numeric fields
        if (isNaN(price) || isNaN(stockQuantity) || (rating !== undefined && isNaN(rating))) {
            res.status(400).json({ message: "Invalid numeric values" });
            return;
        }
        // Validate rating range
        if (rating !== undefined && (rating < 0 || rating > 5)) {
            res.status(400).json({ message: "Rating must be between 0 and 5" });
            return;
        }
        const product = yield prisma.products.create({
            data: {
                productId: (0, uuid_1.v4)(),
                name,
                price: parseFloat(price),
                rating: rating !== undefined ? parseFloat(rating) : null,
                stockQuantity: parseInt(stockQuantity),
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, price, rating, stockQuantity } = req.body;
        // Validate required fields
        if (!name || price === undefined || stockQuantity === undefined) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        // Validate numeric fields
        if (isNaN(price) || isNaN(stockQuantity) || (rating !== undefined && isNaN(rating))) {
            res.status(400).json({ message: "Invalid numeric values" });
            return;
        }
        // Validate rating range
        if (rating !== undefined && (rating < 0 || rating > 5)) {
            res.status(400).json({ message: "Rating must be between 0 and 5" });
            return;
        }
        const product = yield prisma.products.update({
            where: { productId },
            data: {
                name,
                price: parseFloat(price),
                rating: rating !== undefined ? parseFloat(rating) : null,
                stockQuantity: parseInt(stockQuantity),
            },
        });
        res.json(product);
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield prisma.products.delete({
            where: { productId },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
