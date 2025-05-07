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
exports.deleteProduct = exports.getTags = exports.getCategories = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const category = (_b = req.query.category) === null || _b === void 0 ? void 0 : _b.toString();
        const tag = (_c = req.query.tag) === null || _c === void 0 ? void 0 : _c.toString();
        const products = yield prisma.products.findMany({
            where: {
                AND: [
                    search
                        ? {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { category: { contains: search, mode: 'insensitive' } },
                                { tags: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                        : {},
                    category ? { category } : {},
                    tag ? { tags: { contains: tag } } : {}
                ]
            },
            orderBy: {
                name: 'asc'
            }
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
        // Log the incoming request body for debugging
        console.log("Creating product with data:", JSON.stringify(req.body, null, 2));
        // Extract required fields from the request
        const { name, price, stockQuantity, rating, imageUrl, category, tags, description } = req.body;
        // Validate required fields
        if (!name) {
            console.error("Missing required field: name");
            res.status(400).json({ message: "Product name is required" });
            return;
        }
        // Create a cleaned data object with validated values
        const cleanedData = {
            name,
            price: typeof price === 'number' && !isNaN(price) ? price : 0,
            stockQuantity: typeof stockQuantity === 'number' && !isNaN(stockQuantity) ? stockQuantity : 0,
        };
        // Add optional fields if they exist and are valid
        if (rating !== undefined && typeof rating === 'number' && !isNaN(rating)) {
            cleanedData.rating = rating;
        }
        if (imageUrl)
            cleanedData.imageUrl = imageUrl;
        if (category)
            cleanedData.category = category;
        if (tags)
            cleanedData.tags = tags;
        if (description)
            cleanedData.description = description;
        // Generate a UUID for productId
        const productId = (0, uuid_1.v4)();
        const productData = Object.assign(Object.assign({}, cleanedData), { productId });
        // Log the data being sent to Prisma
        console.log("Sending data to Prisma:", JSON.stringify(productData, null, 2));
        const product = yield prisma.products.create({
            data: productData
        });
        console.log("Product created successfully:", JSON.stringify(product, null, 2));
        res.status(201).json(product);
    }
    catch (error) {
        // More detailed error logging
        console.error("Error creating product:", error);
        // If it's a Prisma error, log more specific details
        if (error instanceof Error) {
            console.error("Error details:", error.message);
            console.error("Error stack:", error.stack);
        }
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, price, rating, stockQuantity, imageUrl, category, tags } = req.body;
        const product = yield prisma.products.update({
            where: { productId },
            data: {
                name,
                price,
                rating,
                stockQuantity,
                imageUrl,
                category,
                tags
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
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.products.findMany({
            where: {
                category: {
                    not: null
                }
            },
            select: {
                category: true
            },
            distinct: ['category']
        });
        const categories = products
            .map(p => p.category)
            .filter(Boolean);
        res.json(categories);
    }
    catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ message: "Error retrieving categories" });
    }
});
exports.getCategories = getCategories;
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.products.findMany({
            where: {
                tags: {
                    not: null
                }
            },
            select: {
                tags: true
            }
        });
        // Collect all tags from all products
        const allTags = products
            .map(p => { var _a; return (_a = p.tags) === null || _a === void 0 ? void 0 : _a.split(',').map(tag => tag.trim()); })
            .filter(Boolean)
            .flat();
        // Remove duplicates
        const uniqueTags = [...new Set(allTags)];
        res.json(uniqueTags);
    }
    catch (error) {
        console.error("Error retrieving tags:", error);
        res.status(500).json({ message: "Error retrieving tags" });
    }
});
exports.getTags = getTags;
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
