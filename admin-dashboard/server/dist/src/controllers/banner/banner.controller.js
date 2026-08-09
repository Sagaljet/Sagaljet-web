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
exports.getBannerStats = exports.reorderBanners = exports.toggleBannerActive = exports.deleteBanner = exports.editBanner = exports.addBanner = exports.getBanner = exports.getAllBanners = exports.getBanners = exports.uploadBannerMiddleware = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Middleware exports
exports.uploadBannerMiddleware = upload.single("image");
const bannerModels = {
    projects: prisma.bannerProjects,
    design: prisma.bannerDesign,
    events: prisma.bannerEvents,
    blogs: prisma.bannerBlogs,
    about: prisma.bannerAbout,
    contact: prisma.bannerContact,
    banner: prisma.banner,
};
// Validate banner type
const validateBannerType = (type) => {
    return ["projects", "design", "events", "blogs", "about", "contact", "banner"].includes(type);
};
// Get banner model by type
const getBannerModel = (type) => {
    return bannerModels[type];
};
// Get all active banners by type
const getBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}. Valid types are: projects, design, events, blogs, about, contact`,
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const banners = yield bannerModel.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
        // Calculate discounted prices if applicable
        const formattedBanners = banners.map((banner) => {
            let finalPrice = 0;
            let originalPrice = 0;
            if (banner.discount) {
                if (banner.discountType === "percentage") {
                    finalPrice = originalPrice - (originalPrice * banner.discount) / 100;
                }
                else {
                    finalPrice = originalPrice - banner.discount;
                }
            }
            return Object.assign(Object.assign({}, banner), { originalPrice,
                finalPrice });
        });
        res.json({ result: formattedBanners, success: true, type });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/get-banners/${req.params.type})`,
            error,
            success: false,
        });
    }
});
exports.getBanners = getBanners;
// Get all banners by type (including inactive)
const getAllBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const banners = yield bannerModel.findMany({
            orderBy: { order: "asc" },
        });
        res.json({ result: banners, success: true, type });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/get-all-banners/${req.params.type})`,
            error,
            success: false,
        });
    }
});
exports.getAllBanners = getAllBanners;
// Get banner by ID and type
const getBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.params;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const banner = yield bannerModel.findUnique({
            where: { id: parseInt(id) },
        });
        if (!banner) {
            return res.status(404).json({
                message: `Banner with id ${id} not found in ${type}.`,
                success: false,
            });
        }
        res.json({ result: banner, success: true, type });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/get-banner/${req.params.type}/${req.params.id})`,
            error,
            success: false,
        });
    }
});
exports.getBanner = getBanner;
// Add new banner
const addBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const { title, subtitle, label, discount, discountType, order, isActive, url, } = req.body;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        const file = req.file;
        let imageUrl = "";
        // Upload custom image if provided
        if (file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(file);
        }
        if (!imageUrl && !file) {
            return res.status(400).json({
                message: "Image is required",
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const banner = yield bannerModel.create({
            data: {
                title,
                subtitle,
                url,
                label,
                image: imageUrl,
                discount: discount ? parseFloat(discount) : null,
                discountType: discountType || "percentage",
                order: order ? parseInt(order) : 0,
                isActive: typeof isActive === "string"
                    ? isActive.toLowerCase() === "true"
                    : Boolean(isActive !== null && isActive !== void 0 ? isActive : true),
            },
        });
        res.json({
            result: banner,
            success: true,
            message: `${type} banner created successfully`,
            type,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/add-banner/${req.params.type})`,
            error,
            success: false,
        });
    }
});
exports.addBanner = addBanner;
// Edit banner
const editBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { type, id } = req.params;
        const file = req.file;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const existingBanner = yield bannerModel.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingBanner) {
            return res.status(404).json({
                message: `Banner not found in ${type}`,
                success: false,
            });
        }
        let imageUrl = existingBanner.image;
        // Upload new image if provided
        if (file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(file);
        }
        const updatedData = {
            title: (_a = req.body.title) !== null && _a !== void 0 ? _a : existingBanner.title,
            subtitle: (_b = req.body.subtitle) !== null && _b !== void 0 ? _b : existingBanner.subtitle,
            label: (_c = req.body.label) !== null && _c !== void 0 ? _c : existingBanner.label,
            url: (_d = req.body.url) !== null && _d !== void 0 ? _d : existingBanner.url,
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
        const banner = yield bannerModel.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        res.json({
            result: banner,
            success: true,
            message: `${type} banner updated successfully`,
            type,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/edit-banner/${req.params.type}/${req.params.id})`,
            error,
            success: false,
        });
    }
});
exports.editBanner = editBanner;
// Delete banner
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.params;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const banner = yield bannerModel.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: banner,
            success: true,
            message: `${type} banner deleted successfully`,
            type,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/delete-banner/${req.params.type}/${req.params.id})`,
            error,
            success: false,
        });
    }
});
exports.deleteBanner = deleteBanner;
// Toggle banner active status
const toggleBannerActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.params;
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        const existingBanner = yield bannerModel.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingBanner) {
            return res.status(404).json({
                message: `Banner not found in ${type}`,
                success: false,
            });
        }
        const banner = yield bannerModel.update({
            where: { id: parseInt(id) },
            data: { isActive: !existingBanner.isActive },
        });
        res.json({
            result: banner,
            message: `${type} banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
            success: true,
            type,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/toggle-banner-active/${req.params.type}/${req.params.id})`,
            error,
            success: false,
        });
    }
});
exports.toggleBannerActive = toggleBannerActive;
// Reorder banners
const reorderBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const { bannerOrders } = req.body; // Array of { id: number, order: number }
        if (!validateBannerType(type)) {
            return res.status(400).json({
                message: `Invalid banner type: ${type}`,
                success: false,
            });
        }
        if (!Array.isArray(bannerOrders)) {
            return res.status(400).json({
                message: "bannerOrders must be an array of { id, order }",
                success: false,
            });
        }
        const bannerModel = getBannerModel(type);
        // Update all banner orders in a transaction
        yield prisma.$transaction(bannerOrders.map(({ id, order }) => bannerModel.update({
            where: { id },
            data: { order },
        })));
        const updatedBanners = yield bannerModel.findMany({
            orderBy: { order: "asc" },
        });
        res.json({
            result: updatedBanners,
            success: true,
            message: `${type} banners reordered successfully`,
            type,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: `Error happened at calling endpoint (/reorder-banners/${req.params.type})`,
            error,
            success: false,
        });
    }
});
exports.reorderBanners = reorderBanners;
// Get all banner types with their counts
const getBannerStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield Promise.all([
            prisma.bannerProjects
                .count()
                .then((count) => ({ type: "projects", count })),
            prisma.bannerDesign.count().then((count) => ({ type: "design", count })),
            prisma.bannerEvents.count().then((count) => ({ type: "events", count })),
            prisma.bannerBlogs.count().then((count) => ({ type: "blogs", count })),
            prisma.bannerAbout.count().then((count) => ({ type: "about", count })),
            prisma.bannerContact
                .count()
                .then((count) => ({ type: "contact", count })),
        ]);
        const activeStats = yield Promise.all([
            prisma.bannerProjects
                .count({ where: { isActive: true } })
                .then((count) => ({ type: "projects", activeCount: count })),
            prisma.bannerDesign
                .count({ where: { isActive: true } })
                .then((count) => ({ type: "design", activeCount: count })),
            prisma.bannerEvents
                .count({ where: { isActive: true } })
                .then((count) => ({ type: "events", activeCount: count })),
            prisma.bannerBlogs
                .count({ where: { isActive: true } })
                .then((count) => ({ type: "blogs", activeCount: count })),
            prisma.bannerAbout
                .count({ where: { isActive: true } })
                .then((count) => ({ type: "about", activeCount: count })),
            prisma.bannerContact
                .count({ where: { isActive: true } })
                .then((count) => ({ type: "contact", activeCount: count })),
        ]);
        const combined = stats.map((stat, index) => (Object.assign(Object.assign({}, stat), { activeCount: activeStats[index].activeCount })));
        res.json({
            result: combined,
            success: true,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/banner-stats)",
            error,
            success: false,
        });
    }
});
exports.getBannerStats = getBannerStats;
