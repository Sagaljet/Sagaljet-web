import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 📋 Get all printing types
export const getPrintings = async (req: projectRequest, res: Response) => {
  try {
    const printings = await prisma.printing.findMany({
      orderBy: { name: "asc" },
    });

    res.json({ result: printings, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-printings)",
      error,
      success: false,
    });
  }
};

// 🔍 Get single printing type
export const getPrinting = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const printing = await prisma.printing.findUnique({
      where: { id: parseInt(id) },
    });

    if (!printing) {
      return res.status(404).json({
        message: `Printing with id ${id} not found.`,
        success: false,
      });
    }

    res.json({ result: printing, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-printing)",
      error,
      success: false,
    });
  }
};

// ➕ Add new printing type
export const addPrinting = async (req: projectRequest, res: any) => {
  try {
    const { name, size, price, description } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required",
        success: false,
      });
    }

    // Check if name already exists
    const existingPrinting = await prisma.printing.findUnique({
      where: { name },
    });

    if (existingPrinting) {
      return res.status(400).json({
        message: `Printing type "${name}" already exists`,
        success: false,
      });
    }

    const printing = await prisma.printing.create({
      data: {
        name,
        size: size || "",
        price: parseFloat(price),
        description: description || null,
      },
    });

    res.json({
      result: printing,
      message: "Printing type created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-printing)",
      error,
      success: false,
    });
  }
};

// ✏️ Edit printing type
export const editPrinting = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const { name, size, price, description } = req.body;

    const existingPrinting = await prisma.printing.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPrinting) {
      return res.status(404).json({
        message: "Printing type not found",
        success: false,
      });
    }

    // Check if new name conflicts with another record
    if (name && name !== existingPrinting.name) {
      const nameExists = await prisma.printing.findUnique({
        where: { name },
      });

      if (nameExists) {
        return res.status(400).json({
          message: `Printing type "${name}" already exists`,
          success: false,
        });
      }
    }

    const updatedData: any = {
      name: name || existingPrinting.name,
      size: size !== undefined ? size : existingPrinting.size,
      price: price ? parseFloat(price) : existingPrinting.price,
      description: description !== undefined ? description : existingPrinting.description,
    };

    const printing = await prisma.printing.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json({
      result: printing,
      message: "Printing type updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-printing)",
      error,
      success: false,
    });
  }
};

// 🗑️ Delete printing type
export const deletePrinting = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    const existingPrinting = await prisma.printing.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPrinting) {
      return res.status(404).json({
        message: "Printing type not found",
        success: false,
      });
    }

    const printing = await prisma.printing.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: printing,
      message: "Printing type deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-printing)",
      error,
      success: false,
    });
  }
};