"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/sideCardRoutes.ts
const express_1 = require("express");
const sideCardController_1 = require("../../controllers/sideCard/sideCardController");
const JWT_1 = require("../../controllers/secure/JWT");
const router = (0, express_1.Router)();
// Public routes
router.get("/get-side-cards", sideCardController_1.getSideCards);
// Protected routes (admin only)
router.get("/get-all-side-cards", JWT_1.decoded, sideCardController_1.getAllSideCards);
router.get("/get-side-card/:id", JWT_1.decoded, sideCardController_1.getSideCard);
router.post("/add-side-card", JWT_1.decoded, sideCardController_1.uploadSideCardMiddleware, sideCardController_1.addSideCard);
router.put("/edit-side-card/:id", JWT_1.decoded, sideCardController_1.uploadSideCardMiddleware, sideCardController_1.editSideCard);
router.delete("/delete-side-card/:id", JWT_1.decoded, sideCardController_1.deleteSideCard);
router.patch("/toggle-side-card-active/:id", JWT_1.decoded, sideCardController_1.toggleSideCardActive);
exports.default = router;
