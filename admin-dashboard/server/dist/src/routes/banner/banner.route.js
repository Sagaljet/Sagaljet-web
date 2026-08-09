"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const banner_controller_1 = require("../../controllers/banner/banner.controller");
const JWT_1 = require("../../controllers/secure/JWT");
const router = (0, express_1.Router)();
// ================== PUBLIC ROUTES ==================
// Get active banners by type
// GET /api/banners/:type/active
// Types: projects, design, events, blogs, about, contact
router.get("/:type/active", banner_controller_1.getBanners);
// ================== PROTECTED ROUTES (Admin Only) ==================
// Get all banners by type (including inactive)
// GET /api/banners/:type/all
router.get("/:type/all", JWT_1.decoded, banner_controller_1.getAllBanners);
// Get single banner by type and id
// GET /api/banners/:type/:id
router.get("/:type/:id", JWT_1.decoded, banner_controller_1.getBanner);
// Add new banner
// POST /api/banners/:type
router.post("/:type", JWT_1.decoded, banner_controller_1.uploadBannerMiddleware, banner_controller_1.addBanner);
// Edit banner
// PUT /api/banners/:type/:id
router.put("/:type/:id", JWT_1.decoded, banner_controller_1.uploadBannerMiddleware, banner_controller_1.editBanner);
// Delete banner
// DELETE /api/banners/:type/:id
router.delete("/:type/:id", JWT_1.decoded, banner_controller_1.deleteBanner);
// Toggle banner active status
// PATCH /api/banners/:type/:id/toggle
router.patch("/:type/:id/toggle", JWT_1.decoded, banner_controller_1.toggleBannerActive);
// Reorder banners
// PATCH /api/banners/:type/reorder
router.patch("/:type/reorder", JWT_1.decoded, banner_controller_1.reorderBanners);
// Get banner statistics for all types
// GET /api/banners/stats
router.get("/stats/all", JWT_1.decoded, banner_controller_1.getBannerStats);
exports.default = router;
