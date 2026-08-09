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
exports.deleteCategoryDesign = exports.editCategoryDesign = exports.addCategoryDesign = exports.getCategoryDesign = exports.getCategoriesDesign = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all Categories
const getCategoriesDesign = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database to get a list of all categories with specific fields selected
        const categories = yield prisma.categoryDesign.findMany({
            include: {
                design: true,
            },
        });
        // Respond with the list of categories and indicate success
        res.json({
            result: [...categories],
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-categories)",
            error,
            success: false,
        });
    }
});
exports.getCategoriesDesign = getCategoriesDesign;
// Get a single Category by ID
const getCategoryDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Query the database to get the category with specific fields selected
        const category = yield prisma.categoryDesign.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                description: true,
                createAt: true,
                updateAt: true,
                design: true,
            },
        });
        if (!category) {
            return res.status(404).json({
                message: `Category with ID ${id} not found.`,
                success: false,
            });
        }
        // Respond with the category and indicate success
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-category)",
            error,
            success: false,
        });
    }
});
exports.getCategoryDesign = getCategoryDesign;
// Add a new Category
const addCategoryDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const category = yield prisma.categoryDesign.create({
            data: {
                name,
                description,
            },
        });
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
            error,
            success: false,
        });
    }
});
exports.addCategoryDesign = addCategoryDesign;
// Edit a Category by ID
const editCategoryDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const existingCategory = yield prisma.categoryDesign.findUnique({
            where: { id: Number(id) },
        });
        if (!existingCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        const category = yield prisma.categoryDesign.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
            },
        });
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-category)",
            error,
            success: false,
        });
    }
});
exports.editCategoryDesign = editCategoryDesign;
// Delete a Category by ID
const deleteCategoryDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield prisma.categoryDesign.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-category)",
            error,
            success: false,
        });
    }
});
exports.deleteCategoryDesign = deleteCategoryDesign;
