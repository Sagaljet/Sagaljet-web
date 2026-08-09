"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.uploadDesignMiddleware = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
// ✅ File size limit iyo file type validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} not allowed. Only JPEG, PNG, WebP, GIF allowed.`));
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE, // 10MB max per file
        files: 10, // Max 10 files
    },
    fileFilter,
});
// Middleware exports
exports.uploadDesignMiddleware = upload.array("images", 10);
// ✅ Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: `File-ka aad culus yahay. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                error: err.message,
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Files-ka aad badan yihiin. Maximum: 10 files',
                error: err.message,
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message,
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};
exports.handleMulterError = handleMulterError;
