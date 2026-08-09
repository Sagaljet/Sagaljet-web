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
exports.getDesignBySlug = exports.toggleDesignPrintable = exports.deleteDesign = exports.editDesign = exports.addDesign = exports.getDesign = exports.getAllDesigns = exports.getDesigns = exports.uploadDesignMiddleware = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const imageProcessor_1 = require("../../lib/imageProcessor");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Middleware exports (for use in router)
exports.uploadDesignMiddleware = upload.array("images", 10);
//  Get all active (printable) designs
const getDesigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const designs = yield prisma.design.findMany({
            where: { isPrintable: true },
            orderBy: { createdAt: "desc" },
            include: {
                features: true,
                CategoryDesign: true,
                productComponents: {
                    include: {
                        option: {
                            include: {
                                type: true,
                            },
                        },
                    },
                },
            },
        });
        // Transform the response to match frontend expectations
        const transformedDesigns = designs.map((design) => (Object.assign(Object.assign({}, design), { components: design.productComponents.map((pc) => ({
                id: pc.id,
                productId: pc.productId,
                optionId: pc.optionId,
                extraPrice: pc.extraPrice,
                option: {
                    id: pc.option.id,
                    value: pc.option.value,
                    typeId: pc.option.typeId,
                    type: {
                        id: pc.option.type.id,
                        name: pc.option.type.name,
                    },
                },
            })) })));
        res.json({ result: transformedDesigns, success: true });
    }
    catch (error) {
        console.error("Error in getDesigns:", error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-designs)",
            error,
            success: false,
        });
    }
});
exports.getDesigns = getDesigns;
const getAllDesigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const designs = yield prisma.design.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                features: true,
                CategoryDesign: true,
                productComponents: {
                    include: {
                        option: {
                            include: {
                                type: true,
                            },
                        },
                    },
                },
            },
        });
        // Transform the response
        const transformedDesigns = designs.map((design) => (Object.assign(Object.assign({}, design), { components: design.productComponents.map((pc) => ({
                id: pc.id,
                productId: pc.productId,
                optionId: pc.optionId,
                extraPrice: pc.extraPrice,
                option: {
                    id: pc.option.id,
                    value: pc.option.value,
                    typeId: pc.option.typeId,
                    type: {
                        id: pc.option.type.id,
                        name: pc.option.type.name,
                    },
                },
            })) })));
        res.json({ result: transformedDesigns, success: true });
    }
    catch (error) {
        console.error("Error in getAllDesigns:", error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-all-designs)",
            error,
            success: false,
        });
    }
});
exports.getAllDesigns = getAllDesigns;
//  Get design by ID
const getDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const design = yield prisma.design.findUnique({
            where: { id: parseInt(id) },
        });
        if (!design) {
            return res.status(404).json({
                message: `Design with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: design, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-design)",
            error,
            success: false,
        });
    }
});
exports.getDesign = getDesign;
//  Add a new design
const addDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, price, isPrintable, categoryDesignId, features, components, } = req.body;
        const files = req.files;
        const imageUrls = [];
        // ✅ Upload images with compression
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    // Process/compress the image first
                    const processedImage = yield (0, imageProcessor_1.processImage)(file, {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        quality: 80,
                    });
                    // Create a new file object with processed data
                    const processedFile = Object.assign(Object.assign({}, file), { buffer: processedImage.buffer, mimetype: processedImage.mimetype, originalname: processedImage.originalname, size: processedImage.buffer.length });
                    const url = yield (0, uploadToR2_1.uploadToR2)(processedFile);
                    imageUrls.push(url);
                }
                catch (uploadError) {
                    console.error(`Failed to upload image ${file.originalname}:`, uploadError);
                    // Continue with other images or throw error
                }
            }
        }
        // ... rest of the code remains the same
        // Slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        let parsedFeatures = [];
        if (features) {
            parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
        }
        let parsedComponents = [];
        if (components) {
            parsedComponents = typeof components === "string" ? JSON.parse(components) : components;
        }
        const productExist = yield prisma.design.findFirst({
            where: { slug },
        });
        if (productExist) {
            res.status(400).json({
                message: "product is already created",
                success: false,
            });
            return;
        }
        const totalPrice = parseFloat(price) +
            parsedFeatures.reduce((sum, f) => sum + (f.extraCost || 0), 0);
        const design = yield prisma.design.create({
            data: {
                title,
                slug,
                categoryDesignId: +categoryDesignId,
                description: description || null,
                price: totalPrice,
                images: imageUrls,
                isPrintable: typeof isPrintable === "string"
                    ? isPrintable.toLowerCase() === "true"
                    : Boolean(isPrintable),
                features: {
                    create: parsedFeatures.map((f) => ({
                        name: f.name,
                        value: f.value,
                        extraCost: f.extraCost || 0,
                    })),
                },
            },
            include: { features: true },
        });
        if (parsedComponents.length > 0) {
            yield prisma.productComponent.createMany({
                data: parsedComponents.map((comp) => ({
                    productId: design.id,
                    optionId: comp.optionId,
                    extraPrice: comp.extraPrice
                        ? parseFloat(comp.extraPrice.toString())
                        : null,
                })),
            });
        }
        const completeDesign = yield prisma.design.findUnique({
            where: { id: design.id },
            include: {
                features: true,
                productComponents: {
                    include: {
                        option: {
                            include: {
                                type: true,
                            },
                        },
                    },
                },
            },
        });
        res.json({
            result: completeDesign,
            success: true,
            message: "Design created successfully with features and components",
        });
    }
    catch (error) {
        console.error("Error in addDesign:", error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-design)",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.addDesign = addDesign;
//  Edit design
const editDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const files = req.files;
        const existingDesign = yield prisma.design.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingDesign) {
            return res.status(404).json({ error: "Design not found" });
        }
        const imageUrls = existingDesign.images;
        if (files && files.length > 0) {
            for (const file of files) {
                const url = yield (0, uploadToR2_1.uploadToR2)(file);
                imageUrls.push(url);
            }
        }
        const updatedData = {
            title: req.body.title || existingDesign.title,
            description: req.body.description !== undefined
                ? req.body.description
                : existingDesign.description,
            price: req.body.price ? parseFloat(req.body.price) : existingDesign.price,
            images: imageUrls,
            isPrintable: req.body.isPrintable !== undefined
                ? req.body.isPrintable === "true" || req.body.isPrintable === true
                : existingDesign.isPrintable,
        };
        const design = yield prisma.design.update({
            where: { id: parseInt(id) },
            data: updatedData,
        });
        res.json({ result: design, success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-design)",
            error,
            success: false,
        });
    }
});
exports.editDesign = editDesign;
//  Delete design
const deleteDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const design = yield prisma.design.delete({
            where: { id: parseInt(id) },
        });
        res.json({ result: design, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-design)",
            error,
            success: false,
        });
    }
});
exports.deleteDesign = deleteDesign;
//  Toggle printable status
const toggleDesignPrintable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingDesign = yield prisma.design.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingDesign) {
            return res.status(404).json({ error: "Design not found" });
        }
        const design = yield prisma.design.update({
            where: { id: parseInt(id) },
            data: { isPrintable: !existingDesign.isPrintable },
        });
        res.json({
            result: design,
            message: `Design ${design.isPrintable ? "made printable" : "set as non-printable"} successfully`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/toggle-design-printable)",
            error,
            success: false,
        });
    }
});
exports.toggleDesignPrintable = toggleDesignPrintable;
//  Get design by slug
const getDesignBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const design = yield prisma.design.findFirst({
            where: { slug, isPrintable: true },
            include: {
                features: true,
                productComponents: {
                    select: {
                        design: true,
                        extraPrice: true,
                        option: true,
                    },
                },
            },
        });
        if (!design) {
            return res.status(404).json({
                message: `Design with slug ${slug} not found.`,
                success: false,
            });
        }
        res.json({ result: design, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-design-by-slug)",
            error,
            success: false,
        });
    }
});
exports.getDesignBySlug = getDesignBySlug;
