import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";
import { uploadToR2 } from "../../lib/uploadToR2";
import multer from "multer";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware exports
export const uploadBannerMiddleware = upload.single("image");

// Banner type mapping
type BannerType =
  | "projects"
  | "design"
  | "events"
  | "blogs"
  | "about"
  | "contact";

const bannerModels = {
  projects: prisma.bannerProjects,
  design: prisma.bannerDesign,
  events: prisma.bannerEvents,
  blogs: prisma.bannerBlogs,
  about: prisma.bannerAbout,
  contact: prisma.bannerContact,
  banner: prisma.banner,
} as const;

// Validate banner type
const validateBannerType = (type: string): type is BannerType => {
  return ["projects", "design", "events", "blogs", "about", "contact","banner"].includes(
    type,
  );
};

// Get banner model by type
const getBannerModel = (type: BannerType) => {
  return bannerModels[type];
};

// Get all active banners by type
export const getBanners = async (req: projectRequest, res: any) => {
  try {
    const { type } = req.params;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}. Valid types are: projects, design, events, blogs, about, contact`,
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const banners = await bannerModel.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Calculate discounted prices if applicable
    const formattedBanners = banners.map((banner: any) => {
      let finalPrice = 0;
      let originalPrice = 0;

      if (banner.discount) {
        if (banner.discountType === "percentage") {
          finalPrice = originalPrice - (originalPrice * banner.discount) / 100;
        } else {
          finalPrice = originalPrice - banner.discount;
        }
      }

      return {
        ...banner,
        originalPrice,
        finalPrice,
      };
    });

    res.json({ result: formattedBanners, success: true, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/get-banners/${req.params.type})`,
      error,
      success: false,
    });
  }
};

// Get all banners by type (including inactive)
export const getAllBanners = async (req: projectRequest, res: any) => {
  try {
    const { type } = req.params;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const banners = await bannerModel.findMany({
      orderBy: { order: "asc" },
    });

    res.json({ result: banners, success: true, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/get-all-banners/${req.params.type})`,
      error,
      success: false,
    });
  }
};

// Get banner by ID and type
export const getBanner = async (req: projectRequest, res: any) => {
  try {
    const { type, id } = req.params;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const banner = await bannerModel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!banner) {
      return res.status(404).json({
        message: `Banner with id ${id} not found in ${type}.`,
        success: false,
      });
    }

    res.json({ result: banner, success: true, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/get-banner/${req.params.type}/${req.params.id})`,
      error,
      success: false,
    });
  }
};

// Add new banner
export const addBanner = async (req: projectRequest, res: any) => {
  try {
    const { type } = req.params;
    const {
      title,
      subtitle,
      label,
      discount,
      discountType,
      order,
      isActive,
      url,
    } = req.body;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    const file = req.file as Express.Multer.File;
    let imageUrl: string = "";

    // Upload custom image if provided
    if (file) {
      imageUrl = await uploadToR2(file);
    }

    if (!imageUrl && !file) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const banner = await bannerModel.create({
      data: {
        title,
        subtitle,
        url,
        label,
        image: imageUrl,
        discount: discount ? parseFloat(discount) : null,
        discountType: discountType || "percentage",
        order: order ? parseInt(order) : 0,
        isActive:
          typeof isActive === "string"
            ? isActive.toLowerCase() === "true"
            : Boolean(isActive ?? true),
      },
    });

    res.json({
      result: banner,
      success: true,
      message: `${type} banner created successfully`,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/add-banner/${req.params.type})`,
      error,
      success: false,
    });
  }
};

// Edit banner
export const editBanner = async (req: projectRequest, res: any) => {
  try {
    const { type, id } = req.params;
    const file = req.file as Express.Multer.File;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const existingBanner = await bannerModel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBanner) {
      return res.status(404).json({
        message: `Banner not found in ${type}`,
        success: false,
      });
    }

    let imageUrl = existingBanner.image;

    // Upload new image if provided
    if (file) {
      imageUrl = await uploadToR2(file);
    }

    const updatedData: any = {
      title: req.body.title ?? existingBanner.title,
      subtitle: req.body.subtitle ?? existingBanner.subtitle,
      label: req.body.label ?? existingBanner.label,
      url: req.body.url ?? existingBanner.url,
      image: imageUrl,
      order: req.body.order ? parseInt(req.body.order) : existingBanner.order,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === "true" || req.body.isActive === true
          : existingBanner.isActive,
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

    const banner = await bannerModel.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    res.json({
      result: banner,
      success: true,
      message: `${type} banner updated successfully`,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/edit-banner/${req.params.type}/${req.params.id})`,
      error,
      success: false,
    });
  }
};

// Delete banner
export const deleteBanner = async (req: projectRequest, res: any) => {
  try {
    const { type, id } = req.params;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const banner = await bannerModel.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: banner,
      success: true,
      message: `${type} banner deleted successfully`,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/delete-banner/${req.params.type}/${req.params.id})`,
      error,
      success: false,
    });
  }
};

// Toggle banner active status
export const toggleBannerActive = async (req: projectRequest, res: any) => {
  try {
    const { type, id } = req.params;

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    const existingBanner = await bannerModel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBanner) {
      return res.status(404).json({
        message: `Banner not found in ${type}`,
        success: false,
      });
    }

    const banner = await bannerModel.update({
      where: { id: parseInt(id) },
      data: { isActive: !existingBanner.isActive },
    });

    res.json({
      result: banner,
      message: `${type} banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      success: true,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/toggle-banner-active/${req.params.type}/${req.params.id})`,
      error,
      success: false,
    });
  }
};

// Reorder banners
export const reorderBanners = async (req: projectRequest, res: any) => {
  try {
    const { type } = req.params;
    const { bannerOrders } = req.body; // Array of { id: number, order: number }

    if (!validateBannerType(type)) {
      return res.status(400).json({
        message: `Invalid banner type: ${type}`,
        success: false,
      });
    }

    if (!Array.isArray(bannerOrders)) {
      return res.status(400).json({
        message: "bannerOrders must be an array of { id, order }",
        success: false,
      });
    }

    const bannerModel = getBannerModel(type) as any;

    // Update all banner orders in a transaction
    await prisma.$transaction(
      bannerOrders.map(({ id, order }: { id: number; order: number }) =>
        bannerModel.update({
          where: { id },
          data: { order },
        }),
      ),
    );

    const updatedBanners = await bannerModel.findMany({
      orderBy: { order: "asc" },
    });

    res.json({
      result: updatedBanners,
      success: true,
      message: `${type} banners reordered successfully`,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error happened at calling endpoint (/reorder-banners/${req.params.type})`,
      error,
      success: false,
    });
  }
};

// Get all banner types with their counts
export const getBannerStats = async (req: projectRequest, res: Response) => {
  try {
    const stats = await Promise.all([
      prisma.bannerProjects
        .count()
        .then((count) => ({ type: "projects", count })),
      prisma.bannerDesign.count().then((count) => ({ type: "design", count })),
      prisma.bannerEvents.count().then((count) => ({ type: "events", count })),
      prisma.bannerBlogs.count().then((count) => ({ type: "blogs", count })),
      prisma.bannerAbout.count().then((count) => ({ type: "about", count })),
      prisma.bannerContact
        .count()
        .then((count) => ({ type: "contact", count })),
    ]);

    const activeStats = await Promise.all([
      prisma.bannerProjects
        .count({ where: { isActive: true } })
        .then((count) => ({ type: "projects", activeCount: count })),
      prisma.bannerDesign
        .count({ where: { isActive: true } })
        .then((count) => ({ type: "design", activeCount: count })),
      prisma.bannerEvents
        .count({ where: { isActive: true } })
        .then((count) => ({ type: "events", activeCount: count })),
      prisma.bannerBlogs
        .count({ where: { isActive: true } })
        .then((count) => ({ type: "blogs", activeCount: count })),
      prisma.bannerAbout
        .count({ where: { isActive: true } })
        .then((count) => ({ type: "about", activeCount: count })),
      prisma.bannerContact
        .count({ where: { isActive: true } })
        .then((count) => ({ type: "contact", activeCount: count })),
    ]);

    const combined = stats.map((stat, index) => ({
      ...stat,
      activeCount: activeStats[index].activeCount,
    }));

    res.json({
      result: combined,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/banner-stats)",
      error,
      success: false,
    });
  }
};
