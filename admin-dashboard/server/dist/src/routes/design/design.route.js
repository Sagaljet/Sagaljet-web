"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const design_controller_1 = require("../../controllers/designs/design.controller");
// Import component controllers
const components_controller_1 = require("../../controllers/components/components.controller");
const router = express_1.default.Router();
// ============================================
// EXISTING DESIGN ROUTES (UNCHANGED)
// ============================================
// Public routes
router.get("/get-designs", design_controller_1.getDesigns);
router.get("/get-all-designs", design_controller_1.getAllDesigns);
router.put("/update-order", design_controller_1.updateDesignsOrder);
router.get("/get-design/:id", design_controller_1.getDesign);
router.get("/get-design-by-slug/:slug", design_controller_1.getDesignBySlug);
// Admin routes (assuming secured in middleware)
router.post("/add-design", design_controller_1.uploadDesignMiddleware, design_controller_1.addDesign);
router.put("/edit-design/:id", design_controller_1.uploadDesignMiddleware, design_controller_1.editDesign);
router.delete("/delete-design/:id", design_controller_1.deleteDesign);
router.put("/toggle-design-printable/:id", design_controller_1.toggleDesignPrintable);
// ============================================
// NEW COMPONENT TYPE ROUTES
// ============================================
// Public/Admin routes
router.get("/get-component-types", components_controller_1.getComponentTypes);
router.get("/get-component-type/:id", components_controller_1.getComponentType);
// Admin routes
router.post("/add-component-type", components_controller_1.addComponentType);
router.put("/edit-component-type/:id", components_controller_1.editComponentType);
router.delete("/delete-component-type/:id", components_controller_1.deleteComponentType);
// ============================================
// NEW COMPONENT OPTION ROUTES
// ============================================
// Public/Admin routes
router.get("/get-component-options", components_controller_1.getComponentOptions);
router.get("/get-component-options-by-type/:typeId", components_controller_1.getComponentOptionsByType);
router.get("/get-component-option/:id", components_controller_1.getComponentOption);
// Admin routes
router.post("/add-component-option", components_controller_1.addComponentOption);
router.put("/edit-component-option/:id", components_controller_1.editComponentOption);
router.delete("/delete-component-option/:id", components_controller_1.deleteComponentOption);
// ============================================
// NEW PRODUCT COMPONENT ROUTES
// ============================================
// Public/Admin routes
router.get("/get-product-components", components_controller_1.getProductComponents);
router.get("/get-product-components-by-design/:productId", components_controller_1.getProductComponentsByDesign);
router.get("/get-product-component/:id", components_controller_1.getProductComponent);
// Admin routes
router.post("/add-product-component", components_controller_1.addProductComponent);
router.post("/add-bulk-product-components", components_controller_1.addBulkProductComponents);
router.put("/edit-product-component/:id", components_controller_1.editProductComponent);
router.delete("/delete-product-component/:id", components_controller_1.deleteProductComponent);
router.delete("/delete-product-components-by-design/:productId", components_controller_1.deleteProductComponentsByDesign);
exports.default = router;
