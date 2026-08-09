import express from "express";
import {
  getEvents,
  getAllEvents,
  getEvent,
  getEventBySlug,
  getUpcomingEvents,
  getPastEvents,
  addEvent,
  editEvent,
  deleteEvent,
  deleteEvents,
  toggleEventStatus,
  uploadMultipleMiddleware,
} from "../../controllers/event/event.controller";
const router = express.Router();

// ============== PUBLIC ROUTES ==============
router.get("/get-events", getEvents);
router.get("/get-all-events", getAllEvents);
router.get("/get-event/:id", getEvent);
router.get("/get-event-by-slug/:slug", getEventBySlug);
router.get("/get-upcoming-events", getUpcomingEvents);
router.get("/get-past-events", getPastEvents);
router.post("/add-event",  uploadMultipleMiddleware, addEvent);
router.put("/edit-event/:id",  uploadMultipleMiddleware, editEvent);
router.delete("/delete-event/:id",  deleteEvent);
router.delete("/delete-events",  deleteEvents);
router.patch("/toggle-event-status/:id", toggleEventStatus);

export default router;