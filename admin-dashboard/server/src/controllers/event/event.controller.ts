// controllers/events/Event.ts

import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";
import { uploadToR2 } from "../../lib/uploadToR2";
import multer from "multer";

const prisma = new PrismaClient();

// ============== MULTER CONFIGURATION ==============
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// ✅ IMPORTANT: Field name "images" must match frontend
export const uploadMultipleMiddleware = upload.array("images", 10);

// ============== HELPER FUNCTIONS ==============
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

const parseBoolean = (value: any, defaultValue: boolean = true): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return defaultValue;
};

// ============== GET OPERATIONS ==============

export const getEvents = async (req: projectRequest, res: Response | any) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startAt: "desc" },
      where: { isActive: true },
    });

    res.json({
      result: events,
      success: true,
    });
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({
      message: "Error fetching events",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

export const getAllEvents = async (req: projectRequest, res: Response | any) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startAt: "desc" },
    });

    res.json({
      result: events,
      success: true,
    });
  } catch (error) {
    console.error("Get All Events Error:", error);
    res.status(500).json({
      message: "Error fetching all events",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

export const getEvent = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
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
  } catch (error) {
    console.error("Get Event Error:", error);
    res.status(500).json({
      message: "Error fetching event",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

export const getEventBySlug = async (req: projectRequest, res: Response | any) => {
  try {
    const { slug } = req.params;

    let event = await prisma.event.findFirst({
      where: { slug, isActive: true },
    });

    // Fallback: try by ID if slug is numeric
    if (!event && !isNaN(Number(slug))) {
      event = await prisma.event.findUnique({
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
  } catch (error) {
    console.error("Get Event By Slug Error:", error);
    res.status(500).json({
      message: "Error fetching event by slug",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

export const getUpcomingEvents = async (req: projectRequest, res: Response | any) => {
  try {
    const events = await prisma.event.findMany({
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
  } catch (error) {
    console.error("Get Upcoming Events Error:", error);
    res.status(500).json({
      message: "Error fetching upcoming events",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

export const getPastEvents = async (req: projectRequest, res: Response | any) => {
  try {
    const events = await prisma.event.findMany({
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
  } catch (error) {
    console.error("Get Past Events Error:", error);
    res.status(500).json({
      message: "Error fetching past events",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

// ============== CREATE OPERATION ==============

export const addEvent = async (req: projectRequest, res: Response | any) => {
  try {
    console.log("=== ADD EVENT ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const {
      title,
      description,
      location,
      link,
      client,
      startAt,
      endAt,
      isActive,
    } = req.body;

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
    let imageUrl: string[] = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log(`Uploading ${req.files.length} images...`);
      
      const uploadPromises = (req.files as Express.Multer.File[]).map(
        async (file: Express.Multer.File) => {
          console.log(`Uploading: ${file.originalname}`);
          return uploadToR2(file);
        }
      );
      
      imageUrl = await Promise.all(uploadPromises);
      console.log("Uploaded URLs:", imageUrl);
    }

    // Generate slug
    const slug = generateSlug(title);

    // Create event
    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        location: location?.trim() || null,
        link: link?.trim() || null,
        client: client?.trim() || null,
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
  } catch (error) {
    res.status(500).json({
      message: "Error creating event",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

// ============== UPDATE OPERATION ==============

export const editEvent = async (req: projectRequest, res: Response | any) => {
  try {
    console.log("=== EDIT EVENT ===");
    console.log("ID:", req.params.id);
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { id } = req.params;

    // Find existing event
    const existingEvent = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    // Handle images
    let imageUrl: string[] = [...(existingEvent.imageUrl || [])];

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
      } catch (e) {
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
      } catch (e) {
        console.error("Error parsing removeImages:", e);
      }
    }

    // Upload new images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = (req.files as Express.Multer.File[]).map(
        (file: Express.Multer.File) => uploadToR2(file)
      );
      const newUrls = await Promise.all(uploadPromises);
      imageUrl = [...imageUrl, ...newUrls];
    }

    // Generate new slug if title changed
    let slug = existingEvent.slug;
    if (req.body.title && req.body.title !== existingEvent.title) {
      slug = generateSlug(req.body.title);
    }

    // Build update data
    const updateData: any = {
      title: req.body.title?.trim() || existingEvent.title,
      slug,
      description: req.body.description !== undefined 
        ? (req.body.description?.trim() || null) 
        : existingEvent.description,
      location: req.body.location !== undefined 
        ? (req.body.location?.trim() || null) 
        : existingEvent.location,
      link: req.body.link !== undefined 
        ? (req.body.link?.trim() || null) 
        : existingEvent.link,
      client: req.body.client !== undefined 
        ? (req.body.client?.trim() || null) 
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
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json({
      result: event,
      message: "Event updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Edit Event Error:", error);
    res.status(500).json({
      message: "Error updating event",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

// ============== DELETE OPERATIONS ==============

export const deleteEvent = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: event,
      message: "Event deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({
      message: "Error deleting event",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

export const deleteEvents = async (req: projectRequest, res: Response | any) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid input. Expected array of IDs.",
        success: false,
      });
    }

    const result = await prisma.event.deleteMany({
      where: { id: { in: ids.map((id) => parseInt(id)) } },
    });

    res.json({
      message: `${result.count} events deleted successfully`,
      success: true,
    });
  } catch (error) {
    console.error("Delete Events Error:", error);
    res.status(500).json({
      message: "Error deleting events",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};

// ============== TOGGLE STATUS ==============

export const toggleEventStatus = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
        success: false,
      });
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: { isActive: !existingEvent.isActive },
    });

    res.json({
      result: event,
      message: `Event ${event.isActive ? "activated" : "deactivated"} successfully`,
      success: true,
    });
  } catch (error) {
    console.error("Toggle Event Status Error:", error);
    res.status(500).json({
      message: "Error toggling event status",
      error: error instanceof Error ? error.message : error,
      success: false,
    });
  }
};