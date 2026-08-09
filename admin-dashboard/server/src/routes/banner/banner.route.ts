import { Router } from "express";
import {
  getBanners,
  getAllBanners,
  getBanner,
  addBanner,
  editBanner,
  deleteBanner,
  toggleBannerActive,
  reorderBanners,
  getBannerStats,
  uploadBannerMiddleware,
} from "../../controllers/banner/banner.controller";
import { decoded } from "../../controllers/secure/JWT";

const router = Router();

// ================== PUBLIC ROUTES ==================

// Get active banners by type
// GET /api/banners/:type/active
// Types: projects, design, events, blogs, about, contact
router.get("/:type/active", getBanners);

// ================== PROTECTED ROUTES (Admin Only) ==================

// Get all banners by type (including inactive)
// GET /api/banners/:type/all
router.get("/:type/all", decoded, getAllBanners);

// Get single banner by type and id
// GET /api/banners/:type/:id
router.get("/:type/:id", decoded, getBanner);

// Add new banner
// POST /api/banners/:type
router.post("/:type", decoded, uploadBannerMiddleware, addBanner);

// Edit banner
// PUT /api/banners/:type/:id
router.put("/:type/:id", decoded, uploadBannerMiddleware, editBanner);

// Delete banner
// DELETE /api/banners/:type/:id
router.delete("/:type/:id", decoded, deleteBanner);

// Toggle banner active status
// PATCH /api/banners/:type/:id/toggle
router.patch("/:type/:id/toggle", decoded, toggleBannerActive);

// Reorder banners
// PATCH /api/banners/:type/reorder
router.patch("/:type/reorder", decoded, reorderBanners);

// Get banner statistics for all types
// GET /api/banners/stats
router.get("/stats/all", decoded, getBannerStats);

export default router;
