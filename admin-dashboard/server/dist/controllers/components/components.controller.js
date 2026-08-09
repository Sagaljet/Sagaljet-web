"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductComponentsByDesign = exports.deleteProductComponent = exports.editProductComponent = exports.addBulkProductComponents = exports.addProductComponent = exports.getProductComponent = exports.getProductComponentsByDesign = exports.getProductComponents = exports.deleteComponentOption = exports.editComponentOption = exports.addComponentOption = exports.getComponentOption = exports.getComponentOptionsByType = exports.getComponentOptions = exports.deleteComponentType = exports.editComponentType = exports.addComponentType = exports.getComponentType = exports.getComponentTypes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ============================================
// COMPONENT TYPE CONTROLLERS
// ============================================
// Get all component types (with their options)
const getComponentTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const componentTypes = yield prisma.componentType.findMany({
            orderBy: { id: "asc" },
            include: {
                options: true,
            },
        });
        res.json({ result: componentTypes, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-component-types)",
            error,
            success: false,
        });
    }
});
exports.getComponentTypes = getComponentTypes;
// Get component type by ID
const getComponentType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const componentType = yield prisma.componentType.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: true,
            },
        });
        if (!componentType) {
            return res.status(404).json({
                message: `Component type with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: componentType, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-component-type)",
            error,
            success: false,
        });
    }
});
exports.getComponentType = getComponentType;
// Add a new component type
const addComponentType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Component type name is required",
                success: false,
            });
        }
        const componentType = yield prisma.componentType.create({
            data: {
                name: name.trim(),
            },
        });
        res.json({
            result: componentType,
            success: true,
            message: "Component type created successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-component-type)",
            error,
            success: false,
        });
    }
});
exports.addComponentType = addComponentType;
// Edit component type
const editComponentType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const existingComponentType = yield prisma.componentType.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingComponentType) {
            return res.status(404).json({
                message: "Component type not found",
                success: false,
            });
        }
        const componentType = yield prisma.componentType.update({
            where: { id: parseInt(id) },
            data: {
                name: name || existingComponentType.name,
            },
        });
        res.json({
            result: componentType,
            success: true,
            message: "Component type updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-component-type)",
            error,
            success: false,
        });
    }
});
exports.editComponentType = editComponentType;
// Delete component type
const deleteComponentType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if component type has options
        const componentType = yield prisma.componentType.findUnique({
            where: { id: parseInt(id) },
            include: {
                options: true,
            },
        });
        if (!componentType) {
            return res.status(404).json({
                message: "Component type not found",
                success: false,
            });
        }
        if (componentType.options.length > 0) {
            return res.status(400).json({
                message: "Cannot delete component type with existing options. Delete options first.",
                success: false,
            });
        }
        yield prisma.componentType.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: componentType,
            success: true,
            message: "Component type deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-component-type)",
            error,
            success: false,
        });
    }
});
exports.deleteComponentType = deleteComponentType;
// ============================================
// COMPONENT OPTION CONTROLLERS
// ============================================
// Get all component options
const getComponentOptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const componentOptions = yield prisma.componentOption.findMany({
            orderBy: { id: "asc" },
            include: {
                type: true,
            },
        });
        res.json({ result: componentOptions, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-component-options)",
            error,
            success: false,
        });
    }
});
exports.getComponentOptions = getComponentOptions;
// Get component options by type ID
const getComponentOptionsByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeId } = req.params;
        const componentOptions = yield prisma.componentOption.findMany({
            where: { typeId: parseInt(typeId) },
            orderBy: { id: "asc" },
            include: {
                type: true,
            },
        });
        res.json({ result: componentOptions, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-component-options-by-type)",
            error,
            success: false,
        });
    }
});
exports.getComponentOptionsByType = getComponentOptionsByType;
// Get component option by ID
const getComponentOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const componentOption = yield prisma.componentOption.findUnique({
            where: { id: parseInt(id) },
            include: {
                type: true,
            },
        });
        if (!componentOption) {
            return res.status(404).json({
                message: `Component option with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: componentOption, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-component-option)",
            error,
            success: false,
        });
    }
});
exports.getComponentOption = getComponentOption;
// Add a new component option
const addComponentOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { value, typeId } = req.body;
        if (!value || value.trim() === "") {
            return res.status(400).json({
                message: "Option value is required",
                success: false,
            });
        }
        if (!typeId) {
            return res.status(400).json({
                message: "Component type ID is required",
                success: false,
            });
        }
        // Check if component type exists
        const componentType = yield prisma.componentType.findUnique({
            where: { id: parseInt(typeId) },
        });
        if (!componentType) {
            return res.status(404).json({
                message: "Component type not found",
                success: false,
            });
        }
        const componentOption = yield prisma.componentOption.create({
            data: {
                value: value.trim(),
                typeId: parseInt(typeId),
            },
            include: {
                type: true,
            },
        });
        res.json({
            result: componentOption,
            success: true,
            message: "Component option created successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-component-option)",
            error,
            success: false,
        });
    }
});
exports.addComponentOption = addComponentOption;
// Edit component option
const editComponentOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { value, typeId } = req.body;
        const existingOption = yield prisma.componentOption.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingOption) {
            return res.status(404).json({
                message: "Component option not found",
                success: false,
            });
        }
        // If typeId is being changed, verify the new type exists
        if (typeId && typeId !== existingOption.typeId) {
            const componentType = yield prisma.componentType.findUnique({
                where: { id: parseInt(typeId) },
            });
            if (!componentType) {
                return res.status(404).json({
                    message: "Component type not found",
                    success: false,
                });
            }
        }
        const componentOption = yield prisma.componentOption.update({
            where: { id: parseInt(id) },
            data: {
                value: value || existingOption.value,
                typeId: typeId ? parseInt(typeId) : existingOption.typeId,
            },
            include: {
                type: true,
            },
        });
        res.json({
            result: componentOption,
            success: true,
            message: "Component option updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-component-option)",
            error,
            success: false,
        });
    }
});
exports.editComponentOption = editComponentOption;
// Delete component option
const deleteComponentOption = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const componentOption = yield prisma.componentOption.findUnique({
            where: { id: parseInt(id) },
            include: {
                usedBy: true,
            },
        });
        if (!componentOption) {
            return res.status(404).json({
                message: "Component option not found",
                success: false,
            });
        }
        if (componentOption.usedBy.length > 0) {
            return res.status(400).json({
                message: "Cannot delete component option that is used by products. Remove from products first.",
                success: false,
            });
        }
        yield prisma.componentOption.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: componentOption,
            success: true,
            message: "Component option deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-component-option)",
            error,
            success: false,
        });
    }
});
exports.deleteComponentOption = deleteComponentOption;
// ============================================
// PRODUCT COMPONENT CONTROLLERS
// ============================================
// Get all product components
const getProductComponents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productComponents = yield prisma.productComponent.findMany({
            orderBy: { id: "asc" },
            include: {
                design: true,
                option: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        res.json({ result: productComponents, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-product-components)",
            error,
            success: false,
        });
    }
});
exports.getProductComponents = getProductComponents;
// Get product components by design/product ID
const getProductComponentsByDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const productComponents = yield prisma.productComponent.findMany({
            where: { productId: parseInt(productId) },
            include: {
                option: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        res.json({ result: productComponents, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-product-components-by-design)",
            error,
            success: false,
        });
    }
});
exports.getProductComponentsByDesign = getProductComponentsByDesign;
// Get product component by ID
const getProductComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productComponent = yield prisma.productComponent.findUnique({
            where: { id: parseInt(id) },
            include: {
                design: true,
                option: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        if (!productComponent) {
            return res.status(404).json({
                message: `Product component with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: productComponent, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-product-component)",
            error,
            success: false,
        });
    }
});
exports.getProductComponent = getProductComponent;
// Add a new product component
const addProductComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, optionId, extraPrice } = req.body;
        if (!productId || !optionId) {
            return res.status(400).json({
                message: "Product ID and Option ID are required",
                success: false,
            });
        }
        // Verify design exists
        const design = yield prisma.design.findUnique({
            where: { id: parseInt(productId) },
        });
        if (!design) {
            return res.status(404).json({
                message: "Design/Product not found",
                success: false,
            });
        }
        // Verify option exists
        const option = yield prisma.componentOption.findUnique({
            where: { id: parseInt(optionId) },
        });
        if (!option) {
            return res.status(404).json({
                message: "Component option not found",
                success: false,
            });
        }
        const productComponent = yield prisma.productComponent.create({
            data: {
                productId: parseInt(productId),
                optionId: parseInt(optionId),
                extraPrice: extraPrice ? parseFloat(extraPrice) : null,
            },
            include: {
                design: true,
                option: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        res.json({
            result: productComponent,
            success: true,
            message: "Product component created successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-product-component)",
            error,
            success: false,
        });
    }
});
exports.addProductComponent = addProductComponent;
// Bulk add product components for a design
const addBulkProductComponents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, components } = req.body;
        // components should be an array like: [{ optionId: 1, extraPrice: 2.5 }, { optionId: 2 }]
        if (!productId || !components || !Array.isArray(components)) {
            return res.status(400).json({
                message: "Product ID and components array are required",
                success: false,
            });
        }
        // Verify design exists
        const design = yield prisma.design.findUnique({
            where: { id: parseInt(productId) },
        });
        if (!design) {
            return res.status(404).json({
                message: "Design/Product not found",
                success: false,
            });
        }
        // Create multiple product components
        const productComponents = yield prisma.productComponent.createMany({
            data: components.map((comp) => ({
                productId: parseInt(productId),
                optionId: parseInt(comp.optionId),
                extraPrice: comp.extraPrice ? parseFloat(comp.extraPrice) : null,
            })),
        });
        // Fetch created components with relations
        const createdComponents = yield prisma.productComponent.findMany({
            where: { productId: parseInt(productId) },
            include: {
                option: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        res.json({
            result: createdComponents,
            success: true,
            message: `${productComponents.count} product components created successfully`,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-bulk-product-components)",
            error,
            success: false,
        });
    }
});
exports.addBulkProductComponents = addBulkProductComponents;
// Edit product component
const editProductComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { productId, optionId, extraPrice } = req.body;
        const existingComponent = yield prisma.productComponent.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingComponent) {
            return res.status(404).json({
                message: "Product component not found",
                success: false,
            });
        }
        // Verify new productId if being changed
        if (productId && productId !== existingComponent.productId) {
            const design = yield prisma.design.findUnique({
                where: { id: parseInt(productId) },
            });
            if (!design) {
                return res.status(404).json({
                    message: "Design/Product not found",
                    success: false,
                });
            }
        }
        // Verify new optionId if being changed
        if (optionId && optionId !== existingComponent.optionId) {
            const option = yield prisma.componentOption.findUnique({
                where: { id: parseInt(optionId) },
            });
            if (!option) {
                return res.status(404).json({
                    message: "Component option not found",
                    success: false,
                });
            }
        }
        const productComponent = yield prisma.productComponent.update({
            where: { id: parseInt(id) },
            data: {
                productId: productId ? parseInt(productId) : existingComponent.productId,
                optionId: optionId ? parseInt(optionId) : existingComponent.optionId,
                extraPrice: extraPrice !== undefined ? (extraPrice ? parseFloat(extraPrice) : null) : existingComponent.extraPrice,
            },
            include: {
                design: true,
                option: {
                    include: {
                        type: true,
                    },
                },
            },
        });
        res.json({
            result: productComponent,
            success: true,
            message: "Product component updated successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-product-component)",
            error,
            success: false,
        });
    }
});
exports.editProductComponent = editProductComponent;
// Delete product component
const deleteProductComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const productComponent = yield prisma.productComponent.findUnique({
            where: { id: parseInt(id) },
        });
        if (!productComponent) {
            return res.status(404).json({
                message: "Product component not found",
                success: false,
            });
        }
        yield prisma.productComponent.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: productComponent,
            success: true,
            message: "Product component deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-product-component)",
            error,
            success: false,
        });
    }
});
exports.deleteProductComponent = deleteProductComponent;
// Delete all product components for a design
const deleteProductComponentsByDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const deleted = yield prisma.productComponent.deleteMany({
            where: { productId: parseInt(productId) },
        });
        res.json({
            result: deleted,
            success: true,
            message: `${deleted.count} product components deleted successfully`,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-product-components-by-design)",
            error,
            success: false,
        });
    }
});
exports.deleteProductComponentsByDesign = deleteProductComponentsByDesign;
