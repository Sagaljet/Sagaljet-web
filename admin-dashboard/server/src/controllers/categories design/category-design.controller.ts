import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all Categories
export const getCategoriesDesign = async (
  _req: projectRequest,
  res: Response | any
) => {
  try {
    // Query the database to get a list of all categories with specific fields selected
    const categories = await prisma.categoryDesign.findMany({
      include: {
        design: true,
      },
    });

    // Respond with the list of categories and indicate success
    res.json({
      result: [...categories],
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-categories)",
      error,
      success: false,
    });
  }
};

// Get a single Category by ID
export const getCategoryDesign = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { id } = req.params;

    // Query the database to get the category with specific fields selected
    const category = await prisma.categoryDesign.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        description: true,
        createAt: true,
        updateAt: true,
        design: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: `Category with ID ${id} not found.`,
        success: false,
      });
    }

    // Respond with the category and indicate success
    res.json({
      result: category,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-category)",
      error,
      success: false,
    });
  }
};

// Add a new Category
export const addCategoryDesign = async (req: projectRequest, res: Response | any) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.categoryDesign.create({
      data: {
        name,
        description,
      },
    });
    res.json({
      result: category,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
      error,
      success: false,
    });
  }
};

// Edit a Category by ID
export const editCategoryDesign = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingCategory = await prisma.categoryDesign.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const category = await prisma.categoryDesign.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
      },
    });

    res.json({
      result: category,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-category)",
      error,
      success: false,
    });
  }
};

// Delete a Category by ID
export const deleteCategoryDesign = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { id } = req.params;
    const category = await prisma.categoryDesign.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      result: category,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-category)",
      error,
      success: false,
    });
  }
};

