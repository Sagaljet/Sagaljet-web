"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/bannerRoutes.ts
const express_1 = require("express");
const banner_controller_1 = require("../../controllers/banner/banner.controller");
const JWT_1 = require("../../controllers/secure/JWT");
const router = (0, express_1.Router)();
// Public routes
router.get("/get-banners", banner_controller_1.getBanners);
// Protected routes (admin only)
router.get("/get-all-banners", JWT_1.decoded, banner_controller_1.getAllBanners);
router.get("/get-banner/:id", JWT_1.decoded, banner_controller_1.getBanner);
router.post("/add-banner", JWT_1.decoded, banner_controller_1.uploadBannerMiddleware, banner_controller_1.addBanner);
router.put("/edit-banner/:id", JWT_1.decoded, banner_controller_1.uploadBannerMiddleware, banner_controller_1.editBanner);
router.delete("/delete-banner/:id", JWT_1.decoded, banner_controller_1.deleteBanner);
router.patch("/toggle-banner-active/:id", JWT_1.decoded, banner_controller_1.toggleBannerActive);
exports.default = router;
