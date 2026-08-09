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
exports.toggleBannerActive = exports.deleteBanner = exports.editBanner = exports.addBanner = exports.getBanner = exports.getAllBanners = exports.getBanners = exports.uploadBannerMiddleware = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Middleware exports
exports.uploadBannerMiddleware = upload.single("image");
// Get all active banners
const getBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield prisma.banner.findMany({
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
        // Calculate discounted prices
        const formattedBanners = banners.map((banner) => {
            var _a, _b, _c;
            let finalPrice = ((_a = banner.Design) === null || _a === void 0 ? void 0 : _a.price) || 0;
            let originalPrice = ((_b = banner.Design) === null || _b === void 0 ? void 0 : _b.price) || 0;
            if (banner.discount) {
                if (banner.discountType === "percentage") {
                    finalPrice = originalPrice - (originalPrice * banner.discount) / 100;
                }
                else {
                    finalPrice = originalPrice - banner.discount;
                }
            }
            return Object.assign(Object.assign({}, banner), { image: banner.image || ((_c = banner.Design) === null || _c === void 0 ? void 0 : _c.images[0]) || "", originalPrice,
                finalPrice });
        });
        res.json({ result: formattedBanners, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-banners)",
            error,
            success: false,
        });
    }
});
exports.getBanners = getBanners;
// Get all banners (including inactive)
const getAllBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield prisma.banner.findMany({
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
        res.json({ result: banners, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-all-banners)",
            error,
            success: false,
        });
    }
});
exports.getAllBanners = getAllBanners;
// Get banner by ID
const getBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const banner = yield prisma.banner.findUnique({
            where: { id: parseInt(id) },
            include: {
                Design: true,
            },
        });
        if (!banner) {
            return res.status(404).json({
                message: `Banner with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: banner, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-banner)",
            error,
            success: false,
        });
    }
});
exports.getBanner = getBanner;
// Add new banner
const addBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, subtitle, label, discount, discountType, order, isActive, designId, } = req.body;
        const file = req.file;
        let imageUrl = "";
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
        const banner = yield prisma.banner.create({
            data: {
                title,
                subtitle,
                label,
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
            result: banner,
            success: true,
            message: "Banner created successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-banner)",
            error,
            success: false,
        });
    }
});
exports.addBanner = addBanner;
// Edit banner
const editBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        const existingBanner = yield prisma.banner.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingBanner) {
            return res.status(404).json({
                message: "Banner not found",
                success: false,
            });
        }
        let imageUrl = existingBanner.image;
        // Upload new image if provided
        if (file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(file);
        }
        const updatedData = {
            title: req.body.title || existingBanner.title,
            subtitle: req.body.subtitle || existingBanner.subtitle,
            label: req.body.label || existingBanner.label,
            image: imageUrl,
            order: req.body.order ? parseInt(req.body.order) : existingBanner.order,
            isActive: req.body.isActive !== undefined
                ? req.body.isActive === "true" || req.body.isActive === true
                : existingBanner.isActive,
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
        const banner = yield prisma.banner.update({
            where: { id: parseInt(id) },
            data: updatedData,
            include: {
                Design: true,
            },
        });
        res.json({
            result: banner,
            success: true,
            message: "Banner updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-banner)",
            error,
            success: false,
        });
    }
});
exports.editBanner = editBanner;
// Delete banner
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const banner = yield prisma.banner.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: banner,
            success: true,
            message: "Banner deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-banner)",
            error,
            success: false,
        });
    }
});
exports.deleteBanner = deleteBanner;
// Toggle banner active status
const toggleBannerActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingBanner = yield prisma.banner.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingBanner) {
            return res.status(404).json({
                message: "Banner not found",
                success: false,
            });
        }
        const banner = yield prisma.banner.update({
            where: { id: parseInt(id) },
            data: { isActive: !existingBanner.isActive },
        });
        res.json({
            result: banner,
            message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/toggle-banner-active)",
            error,
            success: false,
        });
    }
});
exports.toggleBannerActive = toggleBannerActive;
