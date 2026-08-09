"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../../controllers/event/event.controller");
const router = express_1.default.Router();
// ============== PUBLIC ROUTES ==============
router.get("/get-events", event_controller_1.getEvents);
router.get("/get-all-events", event_controller_1.getAllEvents);
router.get("/get-event/:id", event_controller_1.getEvent);
router.get("/get-event-by-slug/:slug", event_controller_1.getEventBySlug);
router.get("/get-upcoming-events", event_controller_1.getUpcomingEvents);
router.get("/get-past-events", event_controller_1.getPastEvents);
router.post("/add-event", event_controller_1.uploadMultipleMiddleware, event_controller_1.addEvent);
router.put("/edit-event/:id", event_controller_1.uploadMultipleMiddleware, event_controller_1.editEvent);
router.delete("/delete-event/:id", event_controller_1.deleteEvent);
router.delete("/delete-events", event_controller_1.deleteEvents);
router.patch("/toggle-event-status/:id", event_controller_1.toggleEventStatus);
exports.default = router;
