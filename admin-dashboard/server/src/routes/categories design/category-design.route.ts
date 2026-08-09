// src/routes/categories/Category.ts
import { Router } from "express";
import {
  addCategoryDesign,
  deleteCategoryDesign,
  editCategoryDesign,
  getCategoriesDesign,
  getCategoryDesign,
} from "../../controllers/categories design/category-design.controller";

const router = Router();

router.get("/get-categories", getCategoriesDesign);
router.get("/get-category/:id", getCategoryDesign);
router.post("/add-category", addCategoryDesign);
router.put("/edit-category/:id", editCategoryDesign);
router.delete("/delete-category/:id", deleteCategoryDesign);

export default router;
