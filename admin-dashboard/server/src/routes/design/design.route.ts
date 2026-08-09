import express from "express";
import {
  getDesigns,
  getAllDesigns,
  getDesign,
  addDesign,
  editDesign,
  deleteDesign,
  toggleDesignPrintable,
  getDesignBySlug,
  uploadDesignMiddleware,
  updateDesignsOrder,
} from "../../controllers/designs/design.controller";

// Import component controllers
import {
  // Component Type
  getComponentTypes,
  getComponentType,
  addComponentType,
  editComponentType,
  deleteComponentType,
  
  // Component Option
  getComponentOptions,
  getComponentOptionsByType,
  getComponentOption,
  addComponentOption,
  editComponentOption,
  deleteComponentOption,
  
  // Product Component
  getProductComponents,
  getProductComponentsByDesign,
  getProductComponent,
  addProductComponent,
  addBulkProductComponents,
  editProductComponent,
  deleteProductComponent,
  deleteProductComponentsByDesign,
} from "../../controllers/components/components.controller";

const router = express.Router();

// ============================================
// EXISTING DESIGN ROUTES (UNCHANGED)
// ============================================

// Public routes
router.get("/get-designs", getDesigns);
router.get("/get-all-designs", getAllDesigns);
router.put("/update-order", updateDesignsOrder);
router.get("/get-design/:id", getDesign);
router.get("/get-design-by-slug/:slug", getDesignBySlug);

// Admin routes (assuming secured in middleware)
router.post("/add-design", uploadDesignMiddleware, addDesign);
router.put("/edit-design/:id", uploadDesignMiddleware, editDesign);
router.delete("/delete-design/:id", deleteDesign);
router.put("/toggle-design-printable/:id", toggleDesignPrintable);

// ============================================
// NEW COMPONENT TYPE ROUTES
// ============================================

// Public/Admin routes
router.get("/get-component-types", getComponentTypes);
router.get("/get-component-type/:id", getComponentType);

// Admin routes
router.post("/add-component-type", addComponentType);
router.put("/edit-component-type/:id", editComponentType);
router.delete("/delete-component-type/:id", deleteComponentType);

// ============================================
// NEW COMPONENT OPTION ROUTES
// ============================================

// Public/Admin routes
router.get("/get-component-options", getComponentOptions);
router.get("/get-component-options-by-type/:typeId", getComponentOptionsByType);
router.get("/get-component-option/:id", getComponentOption);

// Admin routes
router.post("/add-component-option", addComponentOption);
router.put("/edit-component-option/:id", editComponentOption);
router.delete("/delete-component-option/:id", deleteComponentOption);

// ============================================
// NEW PRODUCT COMPONENT ROUTES
// ============================================

// Public/Admin routes
router.get("/get-product-components", getProductComponents);
router.get("/get-product-components-by-design/:productId", getProductComponentsByDesign);
router.get("/get-product-component/:id", getProductComponent);

// Admin routes
router.post("/add-product-component", addProductComponent);
router.post("/add-bulk-product-components", addBulkProductComponents);
router.put("/edit-product-component/:id", editProductComponent);
router.delete("/delete-product-component/:id", deleteProductComponent);
router.delete("/delete-product-components-by-design/:productId", deleteProductComponentsByDesign);

export default router;