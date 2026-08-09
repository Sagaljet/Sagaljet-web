"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../../controllers/event/event.controller");
const router = express_1.default.Router();
// Get routes
router.get("/get-events", event_controller_1.getEvents); // Get active events
router.get("/get-all-events", event_controller_1.getAllEvents); // Get all events (including inactive)
router.get("/get-upcoming-events", event_controller_1.getUpcomingEvents); // Get upcoming events
router.get("/get-past-events", event_controller_1.getPastEvents); // Get past events
router.get("/get-event/:id", event_controller_1.getEvent); // Get single event by ID
router.get("/get-event-by-slug/:slug", event_controller_1.getEventBySlug);
// Post routes
router.post("/add-event", event_controller_1.uploadMiddleware, event_controller_1.addEvent); // Add single event
router.post("/add-events", event_controller_1.uploadMultipleMiddleware, event_controller_1.addEvents); // Add multiple events
// Put routes
router.put("/edit-event/:id", event_controller_1.uploadMiddleware, event_controller_1.editEvent); // Edit single event
router.put("/toggle-event-status/:id", event_controller_1.toggleEventStatus); // Toggle active/inactive status
// Batch edit
router.post("/edit-events", event_controller_1.uploadMultipleMiddleware, event_controller_1.editEvents); // Edit multiple events
// Delete routes
router.delete("/delete-event/:id", event_controller_1.deleteEvent); // Delete single event
router.delete("/delete-events", event_controller_1.deleteEvents); // Delete multiple events
exports.default = router;
