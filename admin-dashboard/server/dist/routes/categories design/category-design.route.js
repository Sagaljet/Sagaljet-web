"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/categories/Category.ts
const express_1 = require("express");
const category_design_controller_1 = require("../../controllers/categories design/category-design.controller");
const router = (0, express_1.Router)();
router.get("/get-categories", category_design_controller_1.getCategoriesDesign);
router.get("/get-category/:id", category_design_controller_1.getCategoryDesign);
router.post("/add-category", category_design_controller_1.addCategoryDesign);
router.put("/edit-category/:id", category_design_controller_1.editCategoryDesign);
router.delete("/delete-category/:id", category_design_controller_1.deleteCategoryDesign);
exports.default = router;
