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
exports.uploadMultipleMiddleware = exports.uploadMiddleware = exports.getEventBySlug = exports.getPastEvents = exports.getUpcomingEvents = exports.toggleEventStatus = exports.deleteEvents = exports.deleteEvent = exports.editEvents = exports.editEvent = exports.addEvents = exports.addEvent = exports.getEvent = exports.getAllEvents = exports.getEvents = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            orderBy: {
                startAt: "desc",
            },
            where: {
                isActive: true, // Only fetch active events by default
            },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-events)",
            error: error,
            success: false,
        });
    }
});
exports.getEvents = getEvents;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield prisma.event.findMany({
            orderBy: {
                startAt: "desc",
            },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-all-events)",
            error: error,
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
        // If the event doesn't exist, return a 404 response
        if (!event) {
            return res.status(404).json({
                message: `Event with id ${id} not found.`,
                success: false,
            });
        }
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-event)",
            error: error,
            success: false,
        });
    }
});
exports.getEvent = getEvent;
const addEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, location, startAt, endAt, isActive } = req.body;
        const file = req.file;
        let imageUrl = null;
        if (file) {
            imageUrl = yield (0, uploadToR2_1.uploadToR2)(file);
        }
        // Create the event
        // Normalize isActive to a boolean (handles true/false strings)
        let parsedIsActive = true;
        if (typeof isActive === "boolean") {
            parsedIsActive = isActive;
        }
        else if (typeof isActive === "string") {
            parsedIsActive = isActive.toLowerCase() === "true";
        }
        else if (isActive !== undefined && isActive !== null) {
            parsedIsActive = Boolean(isActive);
        }
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        const event = yield prisma.event.create({
            data: {
                title,
                slug,
                description: description || null,
                location: location || null,
                startAt: new Date(startAt),
                endAt: endAt ? new Date(endAt) : null,
                imageUrl,
                isActive: parsedIsActive,
            },
        });
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-event)",
            error: error,
            success: false,
        });
    }
});
exports.addEvent = addEvent;
const addEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = req.body;
        const eventPromises = events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
            const file = event.file;
            const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : null;
            return prisma.event.create({
                data: {
                    title: event.title,
                    description: event.description || null,
                    location: event.location || null,
                    startAt: new Date(event.startAt),
                    endAt: event.endAt ? new Date(event.endAt) : null,
                    imageUrl,
                    isActive: event.isActive !== undefined ? event.isActive : true,
                },
            });
        }));
        const createdEvents = yield Promise.all(eventPromises);
        res.json({
            result: createdEvents,
            message: `${createdEvents.length} events have been successfully added.`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-events)",
            error: error,
            success: false,
        });
    }
});
exports.addEvents = addEvents;
const editEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const file = req.file;
        // Finding the existing event to check if it exists
        const existingEvent = yield prisma.event.findUnique({
            where: { id: Number(id) },
        });
        if (!existingEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        // Handle image upload, only if a file is provided
        const imageUrl = file
            ? yield (0, uploadToR2_1.uploadToR2)(file)
            : existingEvent.imageUrl;
        // Update only the fields that need to be updated
        const updatedData = {
            title: req.body.title || existingEvent.title,
            description: req.body.description !== undefined
                ? req.body.description
                : existingEvent.description,
            location: req.body.location !== undefined
                ? req.body.location
                : existingEvent.location,
            imageUrl: imageUrl,
            isActive: req.body.isActive !== undefined
                ? req.body.isActive
                : existingEvent.isActive,
        };
        // Handle date fields
        if (req.body.startAt) {
            updatedData.startAt = new Date(req.body.startAt);
        }
        if (req.body.endAt !== undefined) {
            updatedData.endAt = req.body.endAt ? new Date(req.body.endAt) : null;
        }
        const event = yield prisma.event.update({
            where: { id: Number(id) },
            data: updatedData,
        });
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-event)",
            error: error,
            success: false,
        });
    }
});
exports.editEvent = editEvent;
const editEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = req.body;
        const updatedEventsPromises = events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
            // Find the existing event by id
            const existingEvent = yield prisma.event.findUnique({
                where: { id: parseInt(event.id) },
            });
            if (!existingEvent) {
                throw new Error(`Event with id ${event.id} not found`);
            }
            // Handle image upload logic
            const imageUrl = event.file
                ? yield (0, uploadToR2_1.uploadToR2)(event.file)
                : event.imageUrl || existingEvent.imageUrl;
            // Prepare update data
            const updateData = {
                title: event.title || existingEvent.title,
                description: event.description !== undefined
                    ? event.description
                    : existingEvent.description,
                location: event.location !== undefined
                    ? event.location
                    : existingEvent.location,
                imageUrl: imageUrl,
                isActive: event.isActive !== undefined
                    ? event.isActive
                    : existingEvent.isActive,
            };
            // Handle date fields
            if (event.startAt) {
                updateData.startAt = new Date(event.startAt);
            }
            if (event.endAt !== undefined) {
                updateData.endAt = event.endAt ? new Date(event.endAt) : null;
            }
            // Update the event with new data
            return prisma.event.update({
                where: { id: parseInt(event.id) },
                data: updateData,
            });
        }));
        // Wait for all events to be updated
        const updatedEvents = yield Promise.all(updatedEventsPromises);
        res.json({
            result: updatedEvents,
            message: `${updatedEvents.length} events have been successfully updated.`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-events)",
            error: error,
            success: false,
        });
    }
});
exports.editEvents = editEvents;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const event = yield prisma.event.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-event)",
            error: error,
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
                message: "Invalid input format. Expected an array of event IDs.",
                success: false,
            });
        }
        // Deleting multiple events by their IDs
        const deletedEvents = yield prisma.event.deleteMany({
            where: {
                id: { in: ids.map((id) => parseInt(id)) },
            },
        });
        res.json({
            message: `${deletedEvents.count} events have been successfully deleted.`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-events)",
            error: error,
            success: false,
        });
    }
});
exports.deleteEvents = deleteEvents;
// Toggle event active status
const toggleEventStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingEvent = yield prisma.event.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        const event = yield prisma.event.update({
            where: { id: parseInt(id) },
            data: {
                isActive: !existingEvent.isActive,
            },
        });
        res.json({
            result: event,
            message: `Event ${event.isActive ? "activated" : "deactivated"} successfully`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/toggle-event-status)",
            error: error,
            success: false,
        });
    }
});
exports.toggleEventStatus = toggleEventStatus;
// Get upcoming events
const getUpcomingEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const events = yield prisma.event.findMany({
            where: {
                startAt: {
                    gte: currentDate,
                },
                isActive: true,
            },
            orderBy: {
                startAt: "asc",
            },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-upcoming-events)",
            error: error,
            success: false,
        });
    }
});
exports.getUpcomingEvents = getUpcomingEvents;
// Get past events
const getPastEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const events = yield prisma.event.findMany({
            where: {
                endAt: {
                    lt: currentDate,
                },
                isActive: true,
            },
            orderBy: {
                endAt: "desc",
            },
        });
        res.json({
            result: events,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-past-events)",
            error: error,
            success: false,
        });
    }
});
exports.getPastEvents = getPastEvents;
//get slug
// controllers/events/Event.ts - Add this function
const getEventBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        // First try to find by slug field if it exists
        let event = yield prisma.event.findFirst({
            where: {
                slug: slug,
                isActive: true,
            },
        });
        // If not found by slug, try to find by ID (if slug is numeric)
        if (!event && !isNaN(Number(slug))) {
            event = yield prisma.event.findUnique({
                where: {
                    id: parseInt(slug),
                },
            });
        }
        // If still not found, try to generate slug from title and search
        if (!event) {
            const events = yield prisma.event.findMany({
                where: { isActive: true },
            });
            event =
                events.find((e) => e.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "") === slug) || null;
        }
        if (!event) {
            return res.status(404).json({
                message: `Event with slug ${slug} not found.`,
                success: false,
            });
        }
        res.json({
            result: event,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-event-by-slug)",
            error: error,
            success: false,
        });
    }
});
exports.getEventBySlug = getEventBySlug;
// Export the multer middleware for use in your routes
exports.uploadMiddleware = upload.single("imageUrl");
exports.uploadMultipleMiddleware = upload.array("imageUrl", 10);
