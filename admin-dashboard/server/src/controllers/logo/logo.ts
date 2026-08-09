import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import multer from "multer";
import { uploadToR2 } from "../../lib/uploadToR2"; 
import { projectRequest } from "../secure/JWT";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage });
export const getLogos = async (req: projectRequest, res: Response | any) => {
  try {
    const logos = await prisma.logo.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json({
      result: logos,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-logos)",
      error: error,
      success: false,
    });
  }
};

export const getlogo = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    const logo = await prisma.logo.findUnique({
      where: { id: parseInt(id) },
    });

    // If the logo doesn't exist, return a 404 response
    if (!logo) {
      return res.status(404).json({
        message: `logo with ID ${id} not found.`,
        success: false,
      });
    }

    res.json({
      result: { ...logo },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/get-logos)",
      error: error,
      success: false,
    });
  }
};

export const addlogo = async (req: projectRequest, res: Response | any) => {
  try {
    const { name, description, color, createAt } = req.body;

    const file: Express.Multer.File | undefined = req.file;

    // Upload the file if present
    const imageUrl = file ? await uploadToR2(file) : "";

    const logo = await prisma.logo.create({
      data: {
        name,
        description,
        imageUrl,
        color,
        createAt,
      },
    });
    res.json({
      result: { ...logo },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/add-logo)",
      error: error,

      success: false,
    });
  }
};

export const editlogo = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;
    const file = req.file;

    // Finding the existing logo to check if it exists
    const existinglogo = await prisma.logo.findUnique({
      where: { id: Number(id) },
    });

    if (!existinglogo) {
      return res.status(404).json({ error: "logo not found" });
    }

    const imageUrl = file ? await uploadToR2(file) : existinglogo.imageUrl;

    const updatedData = {
      name: req.body.name || existinglogo.name,
      description: req.body.description || existinglogo.description,
      imageUrl: imageUrl,
      link: req.body.link || existinglogo.color,
    };

    const logo = await prisma.logo.update({
      where: { id: Number(id) },
      data: updatedData,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        color: true,
        createAt: true,
        updateAt: true,
      },
    });

    res.json({
      result: logo,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-logo)",
      error: error,
      success: false,
    });
  }
};

export const deletelogo = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;
    const logo = await prisma.logo.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      result: { ...logo },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/remove-logo)",
      error: error,
      success: false,
    });
  }
};

// Export the multer middleware for use in your routes
export const uploadMiddleware = upload.single("imageUrl");
