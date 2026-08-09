// routes/sideCardRoutes.ts
import { Router } from "express";
import {
  getSideCards,
  getAllSideCards,
  getSideCard,
  addSideCard,
  editSideCard,
  deleteSideCard,
  toggleSideCardActive,
  uploadSideCardMiddleware,
} from "../../controllers/sideCard/sideCardController";
import { decoded } from "../../controllers/secure/JWT";

const router = Router();

// Public routes
router.get("/get-side-cards", getSideCards);

// Protected routes (admin only)
router.get("/get-all-side-cards", decoded, getAllSideCards);
router.get("/get-side-card/:id", decoded, getSideCard);
router.post("/add-side-card", decoded, uploadSideCardMiddleware, addSideCard);
router.put(
  "/edit-side-card/:id",
  decoded,
  uploadSideCardMiddleware,
  editSideCard
);
router.delete("/delete-side-card/:id", decoded, deleteSideCard);
router.patch("/toggle-side-card-active/:id", decoded, toggleSideCardActive);

export default router;
