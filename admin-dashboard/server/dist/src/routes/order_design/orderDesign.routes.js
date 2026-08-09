"use strict";
// src/routes/orderDesign.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const orderDesign_controller_1 = require("../../controllers/order_design/orderDesign.controller");
const router = (0, express_1.Router)();
// Multer configuration
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10, // Maximum 10 files
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
// Routes
router.get("/post-types", orderDesign_controller_1.getPostTypes);
router.get("/", orderDesign_controller_1.getAllOrderDesigns);
router.get("/:id", orderDesign_controller_1.getOrderDesignById);
router.post("/", upload.array("images", 10), orderDesign_controller_1.createOrderDesign);
router.put("/:id", upload.array("images", 10), orderDesign_controller_1.updateOrderDesign);
router.get("/title/:title", orderDesign_controller_1.getOrderDesignByTitle);
router.delete("/:id", orderDesign_controller_1.deleteOrderDesign);
exports.default = router;
