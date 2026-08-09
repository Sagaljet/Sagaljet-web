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
exports.toggleSideCardActive = exports.deleteSideCard = exports.editSideCard = exports.addSideCard = exports.getSideCard = exports.getAllSideCards = exports.getSideCards = exports.uploadSideCardMiddleware = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Middleware exports
exports.uploadSideCardMiddleware = upload.single("image");
// Get all active side cards
const getSideCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sideCards = yield prisma.sideCard.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
            include: {
                Design: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: true,
                        slug: true,
                    },
                },
            },
        });
        // Calculate discounted prices and format data
        const formattedSideCards = sideCards.map((card) => {
            var _a, _b, _c;
            let finalPrice = ((_a = card.Design) === null || _a === void 0 ? void 0 : _a.price) || 0;
            let originalPrice = ((_b = card.Design) === null || _b === void 0 ? void 0 : _b.price) || 0;
            if (card.discount) {
                if (card.discountType === "percentage") {
                    finalPrice = originalPrice - (originalPrice * card.discount) / 100;
                }
                else {
                    finalPrice = originalPrice - card.discount;
                }
            }
            // Format price display
            let priceDisplay = `$${finalPrice.toFixed(2)}`;
            if (card.discount) {
                if (card.discountType === "percentage") {
                    priceDisplay = `Get ${card.discount}% OFF`;
                }
                else {
                    priceDisplay = `Save $${card.discount}`;
                }
            }
            return Object.assign(Object.assign({}, card), { image: card.image || ((_c = card.Design) === null || _c === void 0 ? void 0 : _c.images[0]) || "", price: priceDisplay, originalPrice,
                finalPrice });
        });
        res.json({ result: formattedSideCards, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-side-cards)",
            error,
            success: false,
        });
    }
});
exports.getSideCards = getSideCards;
// Get all side cards (including inactive)
const getAllSideCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sideCards = yield prisma.sideCard.findMany({
            orderBy: { order: "asc" },
            include: {
                Design: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: true,
                        slug: true,
                    },
                },
            },
        });
        res.json({ result: sideCards, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-all-side-cards)",
            error,
            success: false,
        });
    }
});
exports.getAllSideCards = getAllSideCards;
// Get side card by ID
const getSideCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sideCard = yield prisma.sideCard.findUnique({
            where: { id: parseInt(id) },
            include: {
                Design: true,
            },
        });
        if (!sideCard) {
            return res.status(404).json({
                message: `Side card with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: sideCard, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-side-card)",
            error,
            success: false,
        });
    }
});
exports.getSideCard = getSideCard;
// Add new side card
const addSideCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { label, title, buttonText, badge, discount, discountType, order, isActive, designId, } = req.body;
        const file = req.file;
        let imageUrl = null;
        // Upload custom image if provided
        if (file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(file);
        }
        // If designId is provided, verify it exists
        if (designId) {
            const design = yield prisma.design.findUnique({
                where: { id: parseInt(designId) },
            });
            if (!design) {
                return res.status(404).json({
                    message: `Design with id ${designId} not found.`,
                    success: false,
                });
            }
        }
        const sideCard = yield prisma.sideCard.create({
            data: {
                label,
                title,
                buttonText: buttonText || "Order Now",
                badge: badge || null,
                image: imageUrl,
                discount: discount ? parseFloat(discount) : null,
                discountType: discountType || "percentage",
                order: order ? parseInt(order) : 0,
                isActive: typeof isActive === "string"
                    ? isActive.toLowerCase() === "true"
                    : Boolean(isActive !== null && isActive !== void 0 ? isActive : true),
                designId: designId ? parseInt(designId) : null,
            },
            include: {
                Design: true,
            },
        });
        res.json({
            result: sideCard,
            success: true,
            message: "Side card created successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-side-card)",
            error,
            success: false,
        });
    }
});
exports.addSideCard = addSideCard;
// Edit side card
const editSideCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        const existingSideCard = yield prisma.sideCard.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingSideCard) {
            return res.status(404).json({
                message: "Side card not found",
                success: false,
            });
        }
        let imageUrl = existingSideCard.image;
        // Upload new image if provided
        if (file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(file);
        }
        const updatedData = {
            label: req.body.label || existingSideCard.label,
            title: req.body.title || existingSideCard.title,
            buttonText: req.body.buttonText || existingSideCard.buttonText,
            badge: req.body.badge !== undefined ? req.body.badge : existingSideCard.badge,
            image: imageUrl,
            order: req.body.order ? parseInt(req.body.order) : existingSideCard.order,
            isActive: req.body.isActive !== undefined
                ? req.body.isActive === "true" || req.body.isActive === true
                : existingSideCard.isActive,
        };
        // Update discount if provided
        if (req.body.discount !== undefined) {
            updatedData.discount = req.body.discount
                ? parseFloat(req.body.discount)
                : null;
        }
        if (req.body.discountType !== undefined) {
            updatedData.discountType = req.body.discountType;
        }
        // Update designId if provided
        if (req.body.designId !== undefined) {
            updatedData.designId = req.body.designId
                ? parseInt(req.body.designId)
                : null;
        }
        const sideCard = yield prisma.sideCard.update({
            where: { id: parseInt(id) },
            data: updatedData,
            include: {
                Design: true,
            },
        });
        res.json({
            result: sideCard,
            success: true,
            message: "Side card updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-side-card)",
            error,
            success: false,
        });
    }
});
exports.editSideCard = editSideCard;
// Delete side card
const deleteSideCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sideCard = yield prisma.sideCard.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: sideCard,
            success: true,
            message: "Side card deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-side-card)",
            error,
            success: false,
        });
    }
});
exports.deleteSideCard = deleteSideCard;
// Toggle side card active status
const toggleSideCardActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingSideCard = yield prisma.sideCard.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingSideCard) {
            return res.status(404).json({
                message: "Side card not found",
                success: false,
            });
        }
        const sideCard = yield prisma.sideCard.update({
            where: { id: parseInt(id) },
            data: { isActive: !existingSideCard.isActive },
        });
        res.json({
            result: sideCard,
            message: `Side card ${sideCard.isActive ? "activated" : "deactivated"} successfully`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/toggle-side-card-active)",
            error,
            success: false,
        });
    }
});
exports.toggleSideCardActive = toggleSideCardActive;
