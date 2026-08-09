"use strict";
// controllers/events/Event.ts
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
exports.toggleEventStatus = exports.deleteEvents = exports.deleteEvent = exports.editEvent = exports.addEvent = exports.getPastEvents = exports.getUpcomingEvents = exports.getEventBySlug = exports.getEvent = exports.getAllEvents = exports.getEvents = exports.uploadMultipleMiddleware = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
// ============== MULTER CONFIGURATION ==============
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10, // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});
// ✅ IMPORTANT: Field name "images" must match frontend
exports.uploadMultipleMiddleware = upload.array("images", 10);
// ============== HELPER FUNCTIONS ==============
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};
const parseBoolean = (value, defaultValue = true) => {
    if (typeof value === "boolean")
        return value;
    if (typeof value === "string")
        return value.toLowerCase() === "true";
    return defaultValue;
};
// ============== GET OPERATIONS ==============
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            orderBy: { startAt: "desc" },
            where: { isActive: true },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        console.error("Get Events Error:", error);
        res.status(500).json({
            message: "Error fetching events",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.getEvents = getEvents;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            orderBy: { startAt: "desc" },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        console.error("Get All Events Error:", error);
        res.status(500).json({
            message: "Error fetching all events",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.getAllEvents = getAllEvents;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield prisma.event.findUnique({
            where: { id: parseInt(id) },
        });
        if (!event) {
            return res.status(404).json({
                message: `Event with id ${id} not found`,
                success: false,
            });
        }
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        console.error("Get Event Error:", error);
        res.status(500).json({
            message: "Error fetching event",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.getEvent = getEvent;
const getEventBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        let event = yield prisma.event.findFirst({
            where: { slug, isActive: true },
        });
        // Fallback: try by ID if slug is numeric
        if (!event && !isNaN(Number(slug))) {
            event = yield prisma.event.findUnique({
                where: { id: parseInt(slug) },
            });
        }
        if (!event) {
            return res.status(404).json({
                message: `Event with slug "${slug}" not found`,
                success: false,
            });
        }
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        console.error("Get Event By Slug Error:", error);
        res.status(500).json({
            message: "Error fetching event by slug",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.getEventBySlug = getEventBySlug;
const getUpcomingEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            where: {
                startAt: { gte: new Date() },
                isActive: true,
            },
            orderBy: { startAt: "asc" },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        console.error("Get Upcoming Events Error:", error);
        res.status(500).json({
            message: "Error fetching upcoming events",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.getUpcomingEvents = getUpcomingEvents;
const getPastEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            where: {
                OR: [
                    { endAt: { lt: new Date() } },
                    { endAt: null, startAt: { lt: new Date() } },
                ],
                isActive: true,
            },
            orderBy: { startAt: "desc" },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        console.error("Get Past Events Error:", error);
        res.status(500).json({
            message: "Error fetching past events",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.getPastEvents = getPastEvents;
// ============== CREATE OPERATION ==============
const addEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("=== ADD EVENT ===");
        console.log("Body:", req.body);
        console.log("Files:", req.files);
        const { title, description, location, link, client, startAt, endAt, isActive, } = req.body;
        // Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required",
                success: false,
            });
        }
        if (!startAt) {
            return res.status(400).json({
                message: "Start date is required",
                success: false,
            });
        }
        // ✅ Handle multiple image uploads
        let imageUrl = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            console.log(`Uploading ${req.files.length} images...`);
            const uploadPromises = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`Uploading: ${file.originalname}`);
                return (0, uploadToR2_1.uploadToR2)(file);
            }));
            imageUrl = yield Promise.all(uploadPromises);
            console.log("Uploaded URLs:", imageUrl);
        }
        // Generate slug
        const slug = generateSlug(title);
        // Create event
        const event = yield prisma.event.create({
            data: {
                title: title.trim(),
                slug,
                description: (description === null || description === void 0 ? void 0 : description.trim()) || null,
                location: (location === null || location === void 0 ? void 0 : location.trim()) || null,
                link: (link === null || link === void 0 ? void 0 : link.trim()) || null,
                client: (client === null || client === void 0 ? void 0 : client.trim()) || null,
                startAt: new Date(startAt),
                endAt: endAt ? new Date(endAt) : null,
                imageUrl,
                isActive: parseBoolean(isActive, true),
            },
        });
        res.status(201).json({
            result: event,
            message: "Event created successfully",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating event",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.addEvent = addEvent;
// ============== UPDATE OPERATION ==============
const editEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        console.log("=== EDIT EVENT ===");
        console.log("ID:", req.params.id);
        console.log("Body:", req.body);
        console.log("Files:", req.files);
        const { id } = req.params;
        // Find existing event
        const existingEvent = yield prisma.event.findUnique({
            where: { id: Number(id) },
        });
        if (!existingEvent) {
            return res.status(404).json({
                message: "Event not found",
                success: false,
            });
        }
        // Handle images
        let imageUrl = [...(existingEvent.imageUrl || [])];
        // Option 1: Replace all images
        if (req.body.replaceImages === "true") {
            imageUrl = [];
        }
        // Option 2: Keep specific images
        if (req.body.keepImages) {
            try {
                const keepImages = typeof req.body.keepImages === "string"
                    ? JSON.parse(req.body.keepImages)
                    : req.body.keepImages;
                imageUrl = Array.isArray(keepImages) ? keepImages : [];
            }
            catch (e) {
                console.error("Error parsing keepImages:", e);
            }
        }
        // Option 3: Remove specific images
        if (req.body.removeImages) {
            try {
                const removeImages = typeof req.body.removeImages === "string"
                    ? JSON.parse(req.body.removeImages)
                    : req.body.removeImages;
                if (Array.isArray(removeImages)) {
                    imageUrl = imageUrl.filter((img) => !removeImages.includes(img));
                }
            }
            catch (e) {
                console.error("Error parsing removeImages:", e);
            }
        }
        // Upload new images
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const uploadPromises = req.files.map((file) => (0, uploadToR2_1.uploadToR2)(file));
            const newUrls = yield Promise.all(uploadPromises);
            imageUrl = [...imageUrl, ...newUrls];
        }
        // Generate new slug if title changed
        let slug = existingEvent.slug;
        if (req.body.title && req.body.title !== existingEvent.title) {
            slug = generateSlug(req.body.title);
        }
        // Build update data
        const updateData = {
            title: ((_a = req.body.title) === null || _a === void 0 ? void 0 : _a.trim()) || existingEvent.title,
            slug,
            description: req.body.description !== undefined
                ? (((_b = req.body.description) === null || _b === void 0 ? void 0 : _b.trim()) || null)
                : existingEvent.description,
            location: req.body.location !== undefined
                ? (((_c = req.body.location) === null || _c === void 0 ? void 0 : _c.trim()) || null)
                : existingEvent.location,
            link: req.body.link !== undefined
                ? (((_d = req.body.link) === null || _d === void 0 ? void 0 : _d.trim()) || null)
                : existingEvent.link,
            client: req.body.client !== undefined
                ? (((_e = req.body.client) === null || _e === void 0 ? void 0 : _e.trim()) || null)
                : existingEvent.client,
            imageUrl,
            isActive: req.body.isActive !== undefined
                ? parseBoolean(req.body.isActive)
                : existingEvent.isActive,
        };
        // Handle dates
        if (req.body.startAt) {
            updateData.startAt = new Date(req.body.startAt);
        }
        if (req.body.endAt !== undefined) {
            updateData.endAt = req.body.endAt ? new Date(req.body.endAt) : null;
        }
        // Update event
        const event = yield prisma.event.update({
            where: { id: Number(id) },
            data: updateData,
        });
        res.json({
            result: event,
            message: "Event updated successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Edit Event Error:", error);
        res.status(500).json({
            message: "Error updating event",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.editEvent = editEvent;
// ============== DELETE OPERATIONS ==============
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield prisma.event.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: event,
            message: "Event deleted successfully",
            success: true,
        });
    }
    catch (error) {
        console.error("Delete Event Error:", error);
        res.status(500).json({
            message: "Error deleting event",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.deleteEvent = deleteEvent;
const deleteEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Invalid input. Expected array of IDs.",
                success: false,
            });
        }
        const result = yield prisma.event.deleteMany({
            where: { id: { in: ids.map((id) => parseInt(id)) } },
        });
        res.json({
            message: `${result.count} events deleted successfully`,
            success: true,
        });
    }
    catch (error) {
        console.error("Delete Events Error:", error);
        res.status(500).json({
            message: "Error deleting events",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.deleteEvents = deleteEvents;
// ============== TOGGLE STATUS ==============
const toggleEventStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingEvent = yield prisma.event.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingEvent) {
            return res.status(404).json({
                message: "Event not found",
                success: false,
            });
        }
        const event = yield prisma.event.update({
            where: { id: parseInt(id) },
            data: { isActive: !existingEvent.isActive },
        });
        res.json({
            result: event,
            message: `Event ${event.isActive ? "activated" : "deactivated"} successfully`,
            success: true,
        });
    }
    catch (error) {
        console.error("Toggle Event Status Error:", error);
        res.status(500).json({
            message: "Error toggling event status",
            error: error instanceof Error ? error.message : error,
            success: false,
        });
    }
});
exports.toggleEventStatus = toggleEventStatus;
