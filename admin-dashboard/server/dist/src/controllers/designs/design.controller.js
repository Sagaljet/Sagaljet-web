"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getDesignBySlug = exports.toggleDesignPrintable = exports.deleteDesign = exports.updateSingleDesignOrder = exports.editDesign = exports.addDesign = exports.updateDesignsOrder = exports.getDesign = exports.getAllDesigns = exports.getDesigns = exports.uploadDesignMiddleware = void 0;
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
            orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
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
const updateDesignsOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderedIds } = req.body;
        // Validation
        if (!orderedIds) {
            return res.status(400).json({
                message: "orderedIds is required",
                success: false,
            });
        }
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                message: `orderedIds must be an array, received: ${typeof orderedIds}`,
                success: false,
            });
        }
        if (orderedIds.length === 0) {
            return res.status(400).json({
                message: "orderedIds array cannot be empty",
                success: false,
            });
        }
        // Convert all IDs to numbers (in case some are strings)
        const numericIds = orderedIds.map((id) => {
            const numId = typeof id === "string" ? parseInt(id, 10) : id;
            if (isNaN(numId)) {
                throw new Error(`Invalid ID: ${id}`);
            }
            return numId;
        });
        // Use transaction to update all orders atomically
        yield prisma.$transaction(numericIds.map((id, index) => prisma.design.update({
            where: { id },
            data: { displayOrder: index },
        })));
        res.json({
            message: "Order updated successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error in updateDesignsOrder:", error);
        res.status(500).json({
            message: "Error updating designs order",
            error: error instanceof Error ? error.message : String(error),
            success: false,
        });
    }
});
exports.updateDesignsOrder = updateDesignsOrder;
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
            parsedFeatures =
                typeof features === "string" ? JSON.parse(features) : features;
        }
        let parsedComponents = [];
        if (components) {
            parsedComponents =
                typeof components === "string" ? JSON.parse(components) : components;
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
    var _a;
    try {
        const { id } = req.params;
        const { title, description, price, isPrintable, categoryDesignId, features, components, existingImages, } = req.body;
        // Get files
        const files = req.files;
        // Find existing design
        const existingDesign = yield prisma.design.findUnique({
            where: { id: parseInt(id) },
            include: {
                features: true,
                productComponents: true,
            },
        });
        if (!existingDesign) {
            return res.status(404).json({
                message: "Design not found",
                success: false,
            });
        }
        // ✅ Parse existing images from request body
        let imageUrls = [];
        if (existingImages !== undefined && existingImages !== null) {
            try {
                let parsed;
                if (typeof existingImages === "string") {
                    // Handle empty string
                    if (existingImages.trim() === "" || existingImages === "[]") {
                        parsed = [];
                    }
                    else {
                        parsed = JSON.parse(existingImages);
                    }
                }
                else if (Array.isArray(existingImages)) {
                    parsed = existingImages;
                }
                else {
                    parsed = [];
                }
                if (Array.isArray(parsed)) {
                    imageUrls = parsed.filter((url) => typeof url === "string" && url.trim() !== "");
                }
            }
            catch (e) {
                imageUrls = [...existingDesign.images];
            }
        }
        else {
            imageUrls = [...existingDesign.images];
        }
        // ✅ Upload new images
        if (files && Array.isArray(files) && files.length > 0) {
            console.log(`📤 Uploading ${files.length} new images...`);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log(`   Processing file ${i + 1}:`, {
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    hasBuffer: !!file.buffer,
                    bufferLength: (_a = file.buffer) === null || _a === void 0 ? void 0 : _a.length,
                });
                try {
                    if (!file.buffer) {
                        console.error(`❌ File ${file.originalname} has no buffer!`);
                        console.error("   Multer might be using disk storage instead of memory storage");
                        // If using disk storage, read file from path
                        if (file.path) {
                            const fs = yield Promise.resolve().then(() => __importStar(require("fs/promises")));
                            const buffer = yield fs.readFile(file.path);
                            file.buffer = buffer;
                            console.log("   ✅ Read buffer from disk path");
                        }
                        else {
                            continue;
                        }
                    }
                    // Process image (resize/compress)
                    const processedImage = yield (0, imageProcessor_1.processImage)(file, {
                        maxWidth: 1920,
                        maxHeight: 1080,
                        quality: 80,
                    });
                    const processedFile = Object.assign(Object.assign({}, file), { buffer: processedImage.buffer, mimetype: processedImage.mimetype, originalname: processedImage.originalname, size: processedImage.buffer.length });
                    // Upload to R2
                    const uploadedUrl = yield (0, uploadToR2_1.uploadToR2)(processedFile);
                    if (uploadedUrl) {
                        console.log(`   ✅ Uploaded: ${uploadedUrl}`);
                        imageUrls.push(uploadedUrl);
                    }
                    else {
                        console.error(`   ❌ uploadToR2 returned null for ${file.originalname}`);
                    }
                }
                catch (uploadError) {
                    console.error(`   ❌ Failed to upload ${file.originalname}:`, uploadError);
                }
            }
        }
        // Generate slug if title changed
        let slug = existingDesign.slug;
        if (title && title !== existingDesign.title) {
            slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            const slugExists = yield prisma.design.findFirst({
                where: {
                    slug,
                    id: { not: parseInt(id) },
                },
            });
            if (slugExists) {
                slug = `${slug}-${Date.now()}`;
            }
        }
        // Parse features
        let parsedFeatures = [];
        if (features) {
            try {
                parsedFeatures =
                    typeof features === "string" ? JSON.parse(features) : features;
            }
            catch (parseError) {
                console.error("Error parsing features:", parseError);
            }
        }
        // Parse components
        let parsedComponents = [];
        if (components) {
            try {
                parsedComponents =
                    typeof components === "string" ? JSON.parse(components) : components;
            }
            catch (parseError) {
                console.error("Error parsing components:", parseError);
            }
        }
        // Calculate total price
        const basePrice = price ? parseFloat(price) : existingDesign.price;
        const totalPrice = basePrice +
            parsedFeatures.reduce((sum, f) => sum + (f.extraCost || 0), 0);
        // Transaction for atomic updates
        const updatedDesign = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Delete existing features if new ones provided
            if (parsedFeatures.length > 0) {
                yield tx.feature.deleteMany({
                    where: { designId: parseInt(id) },
                });
            }
            // Delete existing product components if new ones provided
            if (parsedComponents.length > 0) {
                yield tx.productComponent.deleteMany({
                    where: { id: parseInt(id) },
                });
            }
            // Update design
            const design = yield tx.design.update({
                where: { id: parseInt(id) },
                data: {
                    title: title || existingDesign.title,
                    slug: slug,
                    categoryDesignId: categoryDesignId
                        ? +categoryDesignId
                        : existingDesign.categoryDesignId,
                    description: description !== undefined
                        ? description || null
                        : existingDesign.description,
                    price: totalPrice,
                    images: imageUrls, // ✅ This should now work
                    isPrintable: isPrintable !== undefined
                        ? typeof isPrintable === "string"
                            ? isPrintable.toLowerCase() === "true"
                            : Boolean(isPrintable)
                        : existingDesign.isPrintable,
                    features: parsedFeatures.length > 0
                        ? {
                            create: parsedFeatures.map((f) => ({
                                name: f.name,
                                value: f.value,
                                extraCost: f.extraCost || 0,
                            })),
                        }
                        : undefined,
                    productComponents: parsedComponents.length > 0
                        ? {
                            create: parsedComponents.map((c) => ({
                                optionId: c.optionId,
                                extraPrice: c.extraPrice || 0,
                            })),
                        }
                        : undefined,
                },
            });
            return yield tx.design.findUnique({
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
                    CategoryDesign: true,
                },
            });
        }));
        return res.json({
            result: updatedDesign,
            success: true,
            message: "Design updated successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error updating design",
            error: error instanceof Error ? error.message : String(error),
            success: false,
        });
    }
});
exports.editDesign = editDesign;
const updateSingleDesignOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { designId, newOrder } = req.body;
        yield prisma.design.update({
            where: { id: designId },
            data: { displayOrder: newOrder },
        });
        res.json({
            message: "Design order updated successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Error in updateSingleDesignOrder:", error);
        res.status(500).json({
            message: "Error updating design order",
            error,
            success: false,
        });
    }
});
exports.updateSingleDesignOrder = updateSingleDesignOrder;
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
