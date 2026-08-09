import express, { Router } from "express";
import { decoded } from "../../controllers/secure/JWT";
import {
  addlogo,
  deletelogo,
  editlogo,
  getlogo,
  getLogos,
  uploadMiddleware,
} from "../../controllers/logo/logo";

const router: Router = express.Router();

router.get("/get-Logos", getLogos);
router.get("/get-Logo/:id", getlogo);

router.post("/add-logo", decoded, uploadMiddleware, addlogo);

router.put("/edit-logo/:id", uploadMiddleware, editlogo);

router.delete("/delete-Logo/:id", decoded, deletelogo);

export default router;
