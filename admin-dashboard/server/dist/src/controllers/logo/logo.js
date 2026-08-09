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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.deletelogo = exports.editlogo = exports.addlogo = exports.getlogo = exports.getLogos = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const uploadToR2_1 = require("../../lib/uploadToR2");
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const getLogos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logos = yield prisma.logo.findMany({
            orderBy: {
                id: "desc",
            },
        });
        res.json({
            result: logos,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-logos)",
            error: error,
            success: false,
        });
    }
});
exports.getLogos = getLogos;
const getlogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const logo = yield prisma.logo.findUnique({
            where: { id: parseInt(id) },
        });
        // If the logo doesn't exist, return a 404 response
        if (!logo) {
            return res.status(404).json({
                message: `logo with ID ${id} not found.`,
                success: false,
            });
        }
        res.json({
            result: Object.assign({}, logo),
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "error happened at calling endpoint (/get-logos)",
            error: error,
            success: false,
        });
    }
});
exports.getlogo = getlogo;
const addlogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, color, createAt } = req.body;
        const file = req.file;
        // Upload the file if present
        const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : "";
        const logo = yield prisma.logo.create({
            data: {
                name,
                description,
                imageUrl,
                color,
                createAt,
            },
        });
        res.json({
            result: Object.assign({}, logo),
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "error happened at calling endpoint (/add-logo)",
            error: error,
            success: false,
        });
    }
});
exports.addlogo = addlogo;
const editlogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        // Finding the existing logo to check if it exists
        const existinglogo = yield prisma.logo.findUnique({
            where: { id: Number(id) },
        });
        if (!existinglogo) {
            return res.status(404).json({ error: "logo not found" });
        }
        const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : existinglogo.imageUrl;
        const updatedData = {
            name: req.body.name || existinglogo.name,
            description: req.body.description || existinglogo.description,
            imageUrl: imageUrl,
            link: req.body.link || existinglogo.color,
        };
        const logo = yield prisma.logo.update({
            where: { id: Number(id) },
            data: updatedData,
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                color: true,
                createAt: true,
                updateAt: true,
            },
        });
        res.json({
            result: logo,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-logo)",
            error: error,
            success: false,
        });
    }
});
exports.editlogo = editlogo;
const deletelogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const logo = yield prisma.logo.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: Object.assign({}, logo),
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "error happened at calling endpoint (/remove-logo)",
            error: error,
            success: false,
        });
    }
});
exports.deletelogo = deletelogo;
// Export the multer middleware for use in your routes
exports.uploadMiddleware = upload.single("imageUrl");
