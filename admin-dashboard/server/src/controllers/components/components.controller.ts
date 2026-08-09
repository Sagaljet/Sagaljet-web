import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================
// COMPONENT TYPE CONTROLLERS
// ============================================

// Get all component types (with their options)
export const getComponentTypes = async (req: projectRequest, res: Response) => {
  try {
    const componentTypes = await prisma.componentType.findMany({
      orderBy: { id: "asc" },
      include: {
        options: true,
      },
    });

    res.json({ result: componentTypes, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-component-types)",
      error,
      success: false,
    });
  }
};

// Get component type by ID
export const getComponentType = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    
    const componentType = await prisma.componentType.findUnique({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-component-type)",
      error,
      success: false,
    });
  }
};

// Add a new component type
export const addComponentType = async (req: projectRequest, res: any) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Component type name is required",
        success: false,
      });
    }

    const componentType = await prisma.componentType.create({
      data: {
        name: name.trim(),
      },
    });

    res.json({
      result: componentType,
      success: true,
      message: "Component type created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-component-type)",
      error,
      success: false,
    });
  }
};

// Edit component type
export const editComponentType = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingComponentType = await prisma.componentType.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingComponentType) {
      return res.status(404).json({
        message: "Component type not found",
        success: false,
      });
    }

    const componentType = await prisma.componentType.update({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-component-type)",
      error,
      success: false,
    });
  }
};

// Delete component type
export const deleteComponentType = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    // Check if component type has options
    const componentType = await prisma.componentType.findUnique({
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

    await prisma.componentType.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: componentType,
      success: true,
      message: "Component type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-component-type)",
      error,
      success: false,
    });
  }
};

// ============================================
// COMPONENT OPTION CONTROLLERS
// ============================================

// Get all component options
export const getComponentOptions = async (req: projectRequest, res: Response) => {
  try {
    const componentOptions = await prisma.componentOption.findMany({
      orderBy: { id: "asc" },
      include: {
        type: true,
      },
    });

    res.json({ result: componentOptions, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-component-options)",
      error,
      success: false,
    });
  }
};

// Get component options by type ID
export const getComponentOptionsByType = async (req: projectRequest, res: any) => {
  try {
    const { typeId } = req.params;

    const componentOptions = await prisma.componentOption.findMany({
      where: { typeId: parseInt(typeId) },
      orderBy: { id: "asc" },
      include: {
        type: true,
      },
    });

    res.json({ result: componentOptions, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-component-options-by-type)",
      error,
      success: false,
    });
  }
};

// Get component option by ID
export const getComponentOption = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    const componentOption = await prisma.componentOption.findUnique({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-component-option)",
      error,
      success: false,
    });
  }
};

// Add a new component option
export const addComponentOption = async (req: projectRequest, res: any) => {
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
    const componentType = await prisma.componentType.findUnique({
      where: { id: parseInt(typeId) },
    });

    if (!componentType) {
      return res.status(404).json({
        message: "Component type not found",
        success: false,
      });
    }

    const componentOption = await prisma.componentOption.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-component-option)",
      error,
      success: false,
    });
  }
};

// Edit component option
export const editComponentOption = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const { value, typeId } = req.body;

    const existingOption = await prisma.componentOption.findUnique({
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
      const componentType = await prisma.componentType.findUnique({
        where: { id: parseInt(typeId) },
      });

      if (!componentType) {
        return res.status(404).json({
          message: "Component type not found",
          success: false,
        });
      }
    }

    const componentOption = await prisma.componentOption.update({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-component-option)",
      error,
      success: false,
    });
  }
};

// Delete component option
export const deleteComponentOption = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    const componentOption = await prisma.componentOption.findUnique({
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

    await prisma.componentOption.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: componentOption,
      success: true,
      message: "Component option deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-component-option)",
      error,
      success: false,
    });
  }
};

// ============================================
// PRODUCT COMPONENT CONTROLLERS
// ============================================

// Get all product components
export const getProductComponents = async (req: projectRequest, res: Response) => {
  try {
    const productComponents = await prisma.productComponent.findMany({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-product-components)",
      error,
      success: false,
    });
  }
};

// Get product components by design/product ID
export const getProductComponentsByDesign = async (req: projectRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const productComponents = await prisma.productComponent.findMany({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-product-components-by-design)",
      error,
      success: false,
    });
  }
};

// Get product component by ID
export const getProductComponent = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    const productComponent = await prisma.productComponent.findUnique({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-product-component)",
      error,
      success: false,
    });
  }
};

// Add a new product component
export const addProductComponent = async (req: projectRequest, res: any) => {
  try {
    const { productId, optionId, extraPrice } = req.body;

    if (!productId || !optionId) {
      return res.status(400).json({
        message: "Product ID and Option ID are required",
        success: false,
      });
    }

    // Verify design exists
    const design = await prisma.design.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!design) {
      return res.status(404).json({
        message: "Design/Product not found",
        success: false,
      });
    }

    // Verify option exists
    const option = await prisma.componentOption.findUnique({
      where: { id: parseInt(optionId) },
    });

    if (!option) {
      return res.status(404).json({
        message: "Component option not found",
        success: false,
      });
    }

    const productComponent = await prisma.productComponent.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-product-component)",
      error,
      success: false,
    });
  }
};

// Bulk add product components for a design
export const addBulkProductComponents = async (req: projectRequest, res: any) => {
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
    const design = await prisma.design.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!design) {
      return res.status(404).json({
        message: "Design/Product not found",
        success: false,
      });
    }

    // Create multiple product components
    const productComponents = await prisma.productComponent.createMany({
      data: components.map((comp: any) => ({
        productId: parseInt(productId),
        optionId: parseInt(comp.optionId),
        extraPrice: comp.extraPrice ? parseFloat(comp.extraPrice) : null,
      })),
    });

    // Fetch created components with relations
    const createdComponents = await prisma.productComponent.findMany({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-bulk-product-components)",
      error,
      success: false,
    });
  }
};

// Edit product component
export const editProductComponent = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const { productId, optionId, extraPrice } = req.body;

    const existingComponent = await prisma.productComponent.findUnique({
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
      const design = await prisma.design.findUnique({
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
      const option = await prisma.componentOption.findUnique({
        where: { id: parseInt(optionId) },
      });

      if (!option) {
        return res.status(404).json({
          message: "Component option not found",
          success: false,
        });
      }
    }

    const productComponent = await prisma.productComponent.update({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-product-component)",
      error,
      success: false,
    });
  }
};

// Delete product component
export const deleteProductComponent = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    const productComponent = await prisma.productComponent.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productComponent) {
      return res.status(404).json({
        message: "Product component not found",
        success: false,
      });
    }

    await prisma.productComponent.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: productComponent,
      success: true,
      message: "Product component deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-product-component)",
      error,
      success: false,
    });
  }
};

// Delete all product components for a design
export const deleteProductComponentsByDesign = async (req: projectRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const deleted = await prisma.productComponent.deleteMany({
      where: { productId: parseInt(productId) },
    });

    res.json({
      result: deleted,
      success: true,
      message: `${deleted.count} product components deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-product-components-by-design)",
      error,
      success: false,
    });
  }
};