import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import multer from "multer";
import { uploadToR2 } from "../../lib/uploadToR2";
import { projectRequest } from "../secure/JWT";

const prisma = new PrismaClient();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.single("image");

export const createNewBlog = async (req: Request, res: Response | any) => {
  try {
    const { title, content, author } = req.body;

    // Validate required fields
    if (!title || !content || !author) {
      return res.status(400).json({
        message: "Please provide all required fields!",
        isSuccess: false,
      });
    }

    // Handle image upload if provided
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToR2(req.file); // Assuming uploadToR2 returns the image URL
    }

    function generateSlug(title: string) {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
    const slug = generateSlug(title);

    // Create a new blog post in the database
    const newBlog = await prisma.blog.create({
      data: {
        author,
        title,
        image: imageUrl,
        content,
        slug,
      },
    });

    return res.json({
      result: newBlog,
      message: "Blog has been successfully added.",
      isSuccess: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error!",
      isSuccess: false,
    });
  }
};

//get-all Blogs
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const allBlogs = await prisma.blog.findMany({
      orderBy: { updateAt: "desc" },
    });
    res.json({
      result: [...allBlogs],
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
};

//get-one Blog
export const getOneBlog = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    const blog = await prisma.blog.findFirst({
      where: {
        title: title?.toString(),
      },
    });

    if (!blog) {
      res.status(404).json({
        message: "Not Found Data!.",
        isSuccess: false,
      });
      return;
    }

    res.json({
      result: { ...blog },
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
};

//delete Blog
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findFirst({
      where: {
        id: +id,
      },
    });
    if (!blog) {
      res.status(404).json({
        message: "Not Found Data!.",
        isSuccess: false,
      });
      return;
    }
    const deleteBlog = await prisma.blog.delete({
      where: {
        id: +id,
      },
    });

    res.json({
      result: { ...deleteBlog },
      isSuccess: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
};

//update
export const updateBlog = async (req: Request, res: Response | any) => {
  try {
    const { title, content, author, id } = req.body;

    // Validate required fields
    if (!title || !content || !author) {
      res.status(400).json({
        message: "Please provide all required fields!",
        isSuccess: false,
      });
      return;
    }

    // Handle image upload if provided
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToR2(req.file); // Assuming uploadToR2 returns the image URL
    }

    // Create a new blog post in the database
    const newBlog = await prisma.blog.update({
      where: {
        id: +id,
      },
      data: {
        author,
        title,
        image: imageUrl,
        content,
      },
    });

    return res.json({
      result: newBlog,
      message: "Blog has been successfully added.",
      isSuccess: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error!",
      isSuccess: false,
    });
  }
};

export const getBlogBySlug = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { slug } = req.params;

    // First try to find by slug field if it exists
    let blog = await prisma.blog.findFirst({
      where: {
        slug: slug,
      },
    });

    // If not found by slug, try to find by ID (if slug is numeric)
    if (!blog && !isNaN(Number(slug))) {
      blog = await prisma.blog.findUnique({
        where: {
          id: parseInt(slug),
        },
      });
    }

    // If still not found, try to generate slug from title and search
    if (!blog) {
      const blogs = await prisma.blog.findMany();

      blog =
        blogs.find(
          (e) =>
            e.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") === slug
        ) || null;
    }

    if (!blog) {
      return res.status(404).json({
        message: `blog with slug ${slug} not found.`,
        success: false,
      });
    }

    res.json({
      result: blog,
      success: true,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-blog-by-slug)",
      error: error,
      success: false,
    });
  }
};
