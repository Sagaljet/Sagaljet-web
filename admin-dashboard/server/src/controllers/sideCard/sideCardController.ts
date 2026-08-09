// controllers/sideCardController.ts
import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";
import { uploadToR2 } from "../../lib/uploadToR2";
import multer from "multer";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware exports
export const uploadSideCardMiddleware = upload.single("image");

// Get all active side cards
export const getSideCards = async (req: projectRequest, res: Response) => {
  try {
    const sideCards = await prisma.sideCard.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        Design: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            slug: true,
          },
        },
      },
    });

    // Calculate discounted prices and format data
    const formattedSideCards = sideCards.map((card) => {
      let finalPrice = card.Design?.price || 0;
      let originalPrice = card.Design?.price || 0;

      if (card.discount) {
        if (card.discountType === "percentage") {
          finalPrice = originalPrice - (originalPrice * card.discount) / 100;
        } else {
          finalPrice = originalPrice - card.discount;
        }
      }

      // Format price display
      let priceDisplay = `$${finalPrice.toFixed(2)}`;
      if (card.discount) {
        if (card.discountType === "percentage") {
          priceDisplay = `Get ${card.discount}% OFF`;
        } else {
          priceDisplay = `Save $${card.discount}`;
        }
      }

      return {
        ...card,
        image: card.image || card.Design?.images[0] || "",
        price: priceDisplay,
        originalPrice,
        finalPrice,
      };
    });

    res.json({ result: formattedSideCards, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-side-cards)",
      error,
      success: false,
    });
  }
};

// Get all side cards (including inactive)
export const getAllSideCards = async (req: projectRequest, res: Response) => {
  try {
    const sideCards = await prisma.sideCard.findMany({
      orderBy: { order: "asc" },
      include: {
        Design: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            slug: true,
          },
        },
      },
    });

    res.json({ result: sideCards, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-all-side-cards)",
      error,
      success: false,
    });
  }
};

// Get side card by ID
export const getSideCard = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const sideCard = await prisma.sideCard.findUnique({
      where: { id: parseInt(id) },
      include: {
        Design: true,
      },
    });

    if (!sideCard) {
      return res.status(404).json({
        message: `Side card with id ${id} not found.`,
        success: false,
      });
    }

    res.json({ result: sideCard, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-side-card)",
      error,
      success: false,
    });
  }
};

// Add new side card
export const addSideCard = async (req: projectRequest, res: any) => {
  try {
    const {
      label,
      title,
      buttonText,
      badge,
      discount,
      discountType,
      order,
      isActive,
      designId,
    } = req.body;

    const file = req.file as Express.Multer.File;
    let imageUrl: string | null = null;

    // Upload custom image if provided
    if (file) {
      imageUrl = await uploadToR2(file);
    }

    // If designId is provided, verify it exists
    if (designId) {
      const design = await prisma.design.findUnique({
        where: { id: parseInt(designId) },
      });

      if (!design) {
        return res.status(404).json({
          message: `Design with id ${designId} not found.`,
          success: false,
        });
      }
    }

    const sideCard = await prisma.sideCard.create({
      data: {
        label,
        title,
        buttonText: buttonText || "Order Now",
        badge: badge || null,
        image: imageUrl,
        discount: discount ? parseFloat(discount) : null,
        discountType: discountType || "percentage",
        order: order ? parseInt(order) : 0,
        isActive:
          typeof isActive === "string"
            ? isActive.toLowerCase() === "true"
            : Boolean(isActive ?? true),
        designId: designId ? parseInt(designId) : null,
      },
      include: {
        Design: true,
      },
    });

    res.json({
      result: sideCard,
      success: true,
      message: "Side card created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-side-card)",
      error,
      success: false,
    });
  }
};

// Edit side card
export const editSideCard = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;
    const file = req.file as Express.Multer.File;

    const existingSideCard = await prisma.sideCard.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSideCard) {
      return res.status(404).json({
        message: "Side card not found",
        success: false,
      });
    }

    let imageUrl = existingSideCard.image;

    // Upload new image if provided
    if (file) {
      imageUrl = await uploadToR2(file);
    }

    const updatedData: any = {
      label: req.body.label || existingSideCard.label,
      title: req.body.title || existingSideCard.title,
      buttonText: req.body.buttonText || existingSideCard.buttonText,
      badge: req.body.badge !== undefined ? req.body.badge : existingSideCard.badge,
      image: imageUrl,
      order: req.body.order ? parseInt(req.body.order) : existingSideCard.order,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === "true" || req.body.isActive === true
          : existingSideCard.isActive,
    };

    // Update discount if provided
    if (req.body.discount !== undefined) {
      updatedData.discount = req.body.discount
        ? parseFloat(req.body.discount)
        : null;
    }

    if (req.body.discountType !== undefined) {
      updatedData.discountType = req.body.discountType;
    }

    // Update designId if provided
    if (req.body.designId !== undefined) {
      updatedData.designId = req.body.designId
        ? parseInt(req.body.designId)
        : null;
    }

    const sideCard = await prisma.sideCard.update({
      where: { id: parseInt(id) },
      data: updatedData,
      include: {
        Design: true,
      },
    });

    res.json({
      result: sideCard,
      success: true,
      message: "Side card updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-side-card)",
      error,
      success: false,
    });
  }
};

// Delete side card
export const deleteSideCard = async (req: projectRequest, res: Response) => {
  try {
    const { id } = req.params;

    const sideCard = await prisma.sideCard.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: sideCard,
      success: true,
      message: "Side card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-side-card)",
      error,
      success: false,
    });
  }
};

// Toggle side card active status
export const toggleSideCardActive = async (req: projectRequest, res: any) => {
  try {
    const { id } = req.params;

    const existingSideCard = await prisma.sideCard.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSideCard) {
      return res.status(404).json({
        message: "Side card not found",
        success: false,
      });
    }

    const sideCard = await prisma.sideCard.update({
      where: { id: parseInt(id) },
      data: { isActive: !existingSideCard.isActive },
    });

    res.json({
      result: sideCard,
      message: `Side card ${
        sideCard.isActive ? "activated" : "deactivated"
      } successfully`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/toggle-side-card-active)",
      error,
      success: false,
    });
  }
};