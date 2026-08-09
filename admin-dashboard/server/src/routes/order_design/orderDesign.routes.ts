// src/routes/orderDesign.routes.ts

import { Router } from "express";
import multer from "multer";
import {
  createOrderDesign,
  getAllOrderDesigns,
  getOrderDesignById,
  updateOrderDesign,
  deleteOrderDesign,
  getPostTypes,
  getOrderDesignByTitle,
} from "../../controllers/order_design/orderDesign.controller";

const router = Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Maximum 10 files
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Routes
router.get("/post-types", getPostTypes);
router.get("/", getAllOrderDesigns);
router.get("/:id", getOrderDesignById);
router.post("/", upload.array("images", 10), createOrderDesign);
router.put("/:id", upload.array("images", 10), updateOrderDesign);
router.get("/title/:title", getOrderDesignByTitle);
router.delete("/:id", deleteOrderDesign);

export default router;
