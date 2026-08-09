// src/controllers/orderDesign.controller.ts

import { Request, Response } from "express";
import { PrismaClient, PostType } from "@prisma/client";
import { processImage } from "../../lib/imageProcessor";
import { uploadToR2 } from "../../lib/uploadToR2";

const prisma = new PrismaClient();

export const createOrderDesign = async (req: Request, res: any) => {
  try {
    const { title, price, size, postType, description } = req.body;
    const files = req.files as Express.Multer.File[];

    // Validation
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    // Upload multiple images
    const imageUrls: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const processedImage = await processImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 80,
          });

          const processedFile: Express.Multer.File = {
            ...file,
            buffer: processedImage.buffer,
            mimetype: processedImage.mimetype,
            originalname: processedImage.originalname,
            size: processedImage.buffer.length,
          };

          const url = await uploadToR2(processedFile);
          imageUrls.push(url);
        } catch (uploadError) {
          console.error(`Failed to upload image ${file.originalname}:`, uploadError);
        }
      }
    }

    // Validate postType enum
    const validPostType = Object.values(PostType).includes(postType as PostType)
      ? (postType as PostType)
      : PostType.FACEBOOK_POST;

    const orderDesign = await prisma.orderDesign.create({
      data: {
        title,
        price: parseFloat(price),
        images: imageUrls,
        size: size || null,
        postType: validPostType,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Order design created successfully",
      result: orderDesign,
    });
  } catch (error) {
    console.error("Error creating order design:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order design",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ✅ UPDATE Order Design with Multiple Images
export const updateOrderDesign = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const { title, price, size, postType, description, existingImages } = req.body;
    const files = req.files as Express.Multer.File[];

    // Check if exists
    const existing = await prisma.orderDesign.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order design not found",
      });
    }

    // Handle images
    let imageUrls: string[] = [];

    // Parse existing images from request body
    if (existingImages) {
      try {
        const parsed = typeof existingImages === "string"
          ? JSON.parse(existingImages)
          : existingImages;
        imageUrls = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error parsing existingImages:", e);
        imageUrls = [...existing.images];
      }
    } else {
      imageUrls = [...existing.images];
    }

    // Upload new images
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const processedImage = await processImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 80,
          });

          const processedFile: Express.Multer.File = {
            ...file,
            buffer: processedImage.buffer,
            mimetype: processedImage.mimetype,
            originalname: processedImage.originalname,
            size: processedImage.buffer.length,
          };

          const url = await uploadToR2(processedFile);
          imageUrls.push(url);
        } catch (uploadError) {
          console.error(`Failed to upload image ${file.originalname}:`, uploadError);
        }
      }
    }

    // Validate postType
    let validPostType = existing.postType;
    if (postType && Object.values(PostType).includes(postType as PostType)) {
      validPostType = postType as PostType;
    }

    const updatedOrderDesign = await prisma.orderDesign.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existing.title,
        price: price ? parseFloat(price) : existing.price,
        images: imageUrls,
        size: size !== undefined ? size || null : existing.size,
        postType: validPostType,
        description: description !== undefined ? description || null : existing.description,
      },
    });

    res.json({
      success: true,
      message: "Order design updated successfully",
      result: updatedOrderDesign,
    });
  } catch (error) {
    console.error("Error updating order design:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order design",
      error: error instanceof Error ? error.message : error,
    });
  }
};


// ✅ GET ALL Order Designs with Pagination & Filters
export const getAllOrderDesigns = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      postType,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (postType && Object.values(PostType).includes(postType as PostType)) {
      where.postType = postType;
    }

    // Get total count
    const total = await prisma.orderDesign.count({ where });

    // Get data
    const orderDesigns = await prisma.orderDesign.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        [sortBy as string]: sortOrder,
      },
    });

    res.json({
      success: true,
      result: orderDesigns,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching order designs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order designs",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getOrderDesignByTitle = async (req: Request, res: any) => {
  try {
    const { title } = req.params;

    // Decode the URL-encoded title
    const decodedTitle = decodeURIComponent(title);

    // Try to find by exact title match first
    let orderDesign = await prisma.orderDesign.findFirst({
      where: {
        title: {
          equals: decodedTitle,
          mode: "insensitive", // Case-insensitive search
        },
      },
    });

    // If not found, try with slug-like matching (replace dashes with spaces)
    if (!orderDesign) {
      const titleFromSlug = decodedTitle.replace(/-/g, " ");
      orderDesign = await prisma.orderDesign.findFirst({
        where: {
          title: {
            equals: titleFromSlug,
            mode: "insensitive",
          },
        },
      });
    }

    // If still not found, try partial match
    if (!orderDesign) {
      orderDesign = await prisma.orderDesign.findFirst({
        where: {
          title: {
            contains: decodedTitle.replace(/-/g, " "),
            mode: "insensitive",
          },
        },
      });
    }

    if (!orderDesign) {
      return res.status(404).json({
        success: false,
        message: "Order design not found",
      });
    }

    res.json({
      success: true,
      result: orderDesign,
    });
  } catch (error) {
    console.error("Error fetching order design by title:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order design",
      error: error instanceof Error ? error.message : error,
    });
  }
};


// ✅ GET Single Order Design by ID
export const getOrderDesignById = async (req: Request, res: any) => {
  try {
    const { id } = req.params;

    const orderDesign = await prisma.orderDesign.findUnique({
      where: { id: parseInt(id) },
    });

    if (!orderDesign) {
      return res.status(404).json({
        success: false,
        message: "Order design not found",
      });
    }

    res.json({
      success: true,
      result: orderDesign,
    });
  } catch (error) {
    console.error("Error fetching order design:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order design",
      error: error instanceof Error ? error.message : error,
    });
  }
};



// ✅ DELETE Order Design
export const deleteOrderDesign = async (req: Request, res: any) => {
  try {
    const { id } = req.params;

    const existing = await prisma.orderDesign.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Order design not found",
      });
    }

    await prisma.orderDesign.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Order design deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order design:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete order design",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// ✅ GET Post Types (for dropdown)
export const getPostTypes = async (_req: Request, res: Response) => {
  try {
    const postTypes = Object.values(PostType).map((type) => ({
      value: type,
      label: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    }));

    res.json({
      success: true,
      result: postTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch post types",
    });
  }
};