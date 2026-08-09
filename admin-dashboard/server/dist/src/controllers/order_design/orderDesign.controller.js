"use strict";
// src/controllers/orderDesign.controller.ts
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
exports.getPostTypes = exports.deleteOrderDesign = exports.getOrderDesignById = exports.getOrderDesignByTitle = exports.getAllOrderDesigns = exports.updateOrderDesign = exports.createOrderDesign = void 0;
const client_1 = require("@prisma/client");
const imageProcessor_1 = require("../../lib/imageProcessor");
const uploadToR2_1 = require("../../lib/uploadToR2");
const prisma = new client_1.PrismaClient();
const createOrderDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, price, size, postType, description } = req.body;
        const files = req.files;
        // Validation
        if (!title || !price) {
            return res.status(400).json({
                success: false,
                message: "Title and price are required",
            });
        }
        // Upload multiple images
        const imageUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    const processedImage = yield (0, imageProcessor_1.processImage)(file, {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        quality: 80,
                    });
                    const processedFile = Object.assign(Object.assign({}, file), { buffer: processedImage.buffer, mimetype: processedImage.mimetype, originalname: processedImage.originalname, size: processedImage.buffer.length });
                    const url = yield (0, uploadToR2_1.uploadToR2)(processedFile);
                    imageUrls.push(url);
                }
                catch (uploadError) {
                    console.error(`Failed to upload image ${file.originalname}:`, uploadError);
                }
            }
        }
        // Validate postType enum
        const validPostType = Object.values(client_1.PostType).includes(postType)
            ? postType
            : client_1.PostType.FACEBOOK_POST;
        const orderDesign = yield prisma.orderDesign.create({
            data: {
                title,
                price: parseFloat(price),
                images: imageUrls,
                size: size || null,
                postType: validPostType,
                description: description || null,
            },
        });
        res.status(201).json({
            success: true,
            message: "Order design created successfully",
            result: orderDesign,
        });
    }
    catch (error) {
        console.error("Error creating order design:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order design",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.createOrderDesign = createOrderDesign;
// ✅ UPDATE Order Design with Multiple Images
const updateOrderDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, price, size, postType, description, existingImages } = req.body;
        const files = req.files;
        // Check if exists
        const existing = yield prisma.orderDesign.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Order design not found",
            });
        }
        // Handle images
        let imageUrls = [];
        // Parse existing images from request body
        if (existingImages) {
            try {
                const parsed = typeof existingImages === "string"
                    ? JSON.parse(existingImages)
                    : existingImages;
                imageUrls = Array.isArray(parsed) ? parsed : [];
            }
            catch (e) {
                console.error("Error parsing existingImages:", e);
                imageUrls = [...existing.images];
            }
        }
        else {
            imageUrls = [...existing.images];
        }
        // Upload new images
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    const processedImage = yield (0, imageProcessor_1.processImage)(file, {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        quality: 80,
                    });
                    const processedFile = Object.assign(Object.assign({}, file), { buffer: processedImage.buffer, mimetype: processedImage.mimetype, originalname: processedImage.originalname, size: processedImage.buffer.length });
                    const url = yield (0, uploadToR2_1.uploadToR2)(processedFile);
                    imageUrls.push(url);
                }
                catch (uploadError) {
                    console.error(`Failed to upload image ${file.originalname}:`, uploadError);
                }
            }
        }
        // Validate postType
        let validPostType = existing.postType;
        if (postType && Object.values(client_1.PostType).includes(postType)) {
            validPostType = postType;
        }
        const updatedOrderDesign = yield prisma.orderDesign.update({
            where: { id: parseInt(id) },
            data: {
                title: title || existing.title,
                price: price ? parseFloat(price) : existing.price,
                images: imageUrls,
                size: size !== undefined ? size || null : existing.size,
                postType: validPostType,
                description: description !== undefined ? description || null : existing.description,
            },
        });
        res.json({
            success: true,
            message: "Order design updated successfully",
            result: updatedOrderDesign,
        });
    }
    catch (error) {
        console.error("Error updating order design:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order design",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.updateOrderDesign = updateOrderDesign;
// ✅ GET ALL Order Designs with Pagination & Filters
const getAllOrderDesigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search = "", postType, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        if (postType && Object.values(client_1.PostType).includes(postType)) {
            where.postType = postType;
        }
        // Get total count
        const total = yield prisma.orderDesign.count({ where });
        // Get data
        const orderDesigns = yield prisma.orderDesign.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: {
                [sortBy]: sortOrder,
            },
        });
        res.json({
            success: true,
            result: orderDesigns,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error("Error fetching order designs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order designs",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.getAllOrderDesigns = getAllOrderDesigns;
const getOrderDesignByTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.params;
        // Decode the URL-encoded title
        const decodedTitle = decodeURIComponent(title);
        // Try to find by exact title match first
        let orderDesign = yield prisma.orderDesign.findFirst({
            where: {
                title: {
                    equals: decodedTitle,
                    mode: "insensitive", // Case-insensitive search
                },
            },
        });
        // If not found, try with slug-like matching (replace dashes with spaces)
        if (!orderDesign) {
            const titleFromSlug = decodedTitle.replace(/-/g, " ");
            orderDesign = yield prisma.orderDesign.findFirst({
                where: {
                    title: {
                        equals: titleFromSlug,
                        mode: "insensitive",
                    },
                },
            });
        }
        // If still not found, try partial match
        if (!orderDesign) {
            orderDesign = yield prisma.orderDesign.findFirst({
                where: {
                    title: {
                        contains: decodedTitle.replace(/-/g, " "),
                        mode: "insensitive",
                    },
                },
            });
        }
        if (!orderDesign) {
            return res.status(404).json({
                success: false,
                message: "Order design not found",
            });
        }
        res.json({
            success: true,
            result: orderDesign,
        });
    }
    catch (error) {
        console.error("Error fetching order design by title:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order design",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.getOrderDesignByTitle = getOrderDesignByTitle;
// ✅ GET Single Order Design by ID
const getOrderDesignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const orderDesign = yield prisma.orderDesign.findUnique({
            where: { id: parseInt(id) },
        });
        if (!orderDesign) {
            return res.status(404).json({
                success: false,
                message: "Order design not found",
            });
        }
        res.json({
            success: true,
            result: orderDesign,
        });
    }
    catch (error) {
        console.error("Error fetching order design:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order design",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.getOrderDesignById = getOrderDesignById;
// ✅ DELETE Order Design
const deleteOrderDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existing = yield prisma.orderDesign.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Order design not found",
            });
        }
        yield prisma.orderDesign.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            success: true,
            message: "Order design deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting order design:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete order design",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.deleteOrderDesign = deleteOrderDesign;
// ✅ GET Post Types (for dropdown)
const getPostTypes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postTypes = Object.values(client_1.PostType).map((type) => ({
            value: type,
            label: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        }));
        res.json({
            success: true,
            result: postTypes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch post types",
        });
    }
});
exports.getPostTypes = getPostTypes;
