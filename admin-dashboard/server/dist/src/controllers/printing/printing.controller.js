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
exports.deletePrinting = exports.editPrinting = exports.addPrinting = exports.getPrinting = exports.getPrintings = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// 📋 Get all printing types
const getPrintings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const printings = yield prisma.printing.findMany({
            orderBy: { name: "asc" },
        });
        res.json({ result: printings, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-printings)",
            error,
            success: false,
        });
    }
});
exports.getPrintings = getPrintings;
// 🔍 Get single printing type
const getPrinting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const printing = yield prisma.printing.findUnique({
            where: { id: parseInt(id) },
        });
        if (!printing) {
            return res.status(404).json({
                message: `Printing with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: printing, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-printing)",
            error,
            success: false,
        });
    }
});
exports.getPrinting = getPrinting;
// ➕ Add new printing type
const addPrinting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, size, price, description } = req.body;
        // Validation
        if (!name || !price) {
            return res.status(400).json({
                message: "Name and price are required",
                success: false,
            });
        }
        // Check if name already exists
        const existingPrinting = yield prisma.printing.findUnique({
            where: { name },
        });
        if (existingPrinting) {
            return res.status(400).json({
                message: `Printing type "${name}" already exists`,
                success: false,
            });
        }
        const printing = yield prisma.printing.create({
            data: {
                name,
                size: size || "",
                price: parseFloat(price),
                description: description || null,
            },
        });
        res.json({
            result: printing,
            message: "Printing type created successfully",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-printing)",
            error,
            success: false,
        });
    }
});
exports.addPrinting = addPrinting;
// ✏️ Edit printing type
const editPrinting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, size, price, description } = req.body;
        const existingPrinting = yield prisma.printing.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingPrinting) {
            return res.status(404).json({
                message: "Printing type not found",
                success: false,
            });
        }
        // Check if new name conflicts with another record
        if (name && name !== existingPrinting.name) {
            const nameExists = yield prisma.printing.findUnique({
                where: { name },
            });
            if (nameExists) {
                return res.status(400).json({
                    message: `Printing type "${name}" already exists`,
                    success: false,
                });
            }
        }
        const updatedData = {
            name: name || existingPrinting.name,
            size: size !== undefined ? size : existingPrinting.size,
            price: price ? parseFloat(price) : existingPrinting.price,
            description: description !== undefined ? description : existingPrinting.description,
        };
        const printing = yield prisma.printing.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        res.json({
            result: printing,
            message: "Printing type updated successfully",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-printing)",
            error,
            success: false,
        });
    }
});
exports.editPrinting = editPrinting;
// 🗑️ Delete printing type
const deletePrinting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingPrinting = yield prisma.printing.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingPrinting) {
            return res.status(404).json({
                message: "Printing type not found",
                success: false,
            });
        }
        const printing = yield prisma.printing.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: printing,
            message: "Printing type deleted successfully",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-printing)",
            error,
            success: false,
        });
    }
});
exports.deletePrinting = deletePrinting;
