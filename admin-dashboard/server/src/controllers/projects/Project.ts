import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";
import { uploadToR2 } from "../../lib/uploadToR2";
import multer from "multer";

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getProjects = async (req: projectRequest, res: Response | any) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Query the database to get a list of all categories with specific fields selected
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    res.json({
      result: projects,
      categories,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-projects)",
      error: error,
      success: false,
    });
  }
};

export const updateProjectOrder = async (
  req: projectRequest,
  res: Response,
) => {
  const newOrder = req.body.newOrder;
  if (!Array.isArray(newOrder)) {
    res.status(400).json({ success: false, message: "Invalid data format" });
    return;
  }
  try {
    // Loop & update each
    const updatePromises = newOrder.map(
      (project: { id: number; order: number }) =>
        prisma.project.update({
          where: { id: +project.id },
          data: { order: project.order },
        }),
    );
    await Promise.all(updatePromises);
    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error during update" });
  }
};

export const getProject = async (req: projectRequest, res: Response | any) => {
  try {
    const { name } = req.query;

    const project = await prisma.project.findFirst({
      where: { name: name?.toString() },
      orderBy: { order: "asc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            project: true,
          },
        },
      },
    });

    // If the project doesn't exist, return a 404 response
    if (!project) {
      return res.status(404).json({
        message: `Project with  ${name} not found.`,
        success: false,
      });
    }

    res.json({
      result: { ...project },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/get-projects)",
      error: error,
      success: false,
    });
  }
};

export const addProject = async (req: projectRequest, res: Response) => {
  try {
    const { name, description, categoryId, client, link, createAt, industry } =
      req.body;
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      const uploads = files.map((file) => uploadToR2(file));
      imageUrls = await Promise.all(uploads);
    }

    // Check if categoryId is provided
    if (!categoryId) {
      res.status(400).json({
        message: "Category ID is required",
        success: false,
      });
      return;
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    if (!categoryExists) {
      res.status(404).json({
        message: `Category with ID ${categoryId} does not exist`,
        success: false,
      });
      return;
    }

    // Check if project name already exists
    const checkName = await prisma.project.findFirst({
      where: {
        name,
      },
    });

    if (checkName) {
      res.status(400).json({
        message: `Name already exists: ${name}`,
        success: false,
      });
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        imageUrl: imageUrls,
        categoryId: parseInt(categoryId),
        client,
        link,
        createAt,
        industry,
      },
    });

    res.json({
      result: project,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-project)",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    });
  }
};

export const addProjects = async (req: projectRequest, res: Response | any) => {
  try {
    const projects = req.body;
    const projectPromises = projects.map(async (project: any) => {
      const file: Express.Multer.File | undefined = project.file;
      const imageUrl: any = file ? await uploadToR2(file) : "";
      return prisma.project.create({
        data: {
          name: project.name,
          description: project.description,
          imageUrl,
          categoryId: project.categoryId,
          client: project.client,
        },
      });
    });
    const createdProjects = await Promise.all(projectPromises);
    res.json({
      result: createdProjects,
      message: `${createdProjects.length} projects have been successfully added.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-projects)",
      error: error,
      success: false,
    });
  }
};

export const editProject = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;
    const file = req.file;

    // Finding the existing project to check if it exists
    const existingProject = await prisma.project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Handle image upload, only if a file is provided
    const imageUrl: any = file
      ? await uploadToR2(file)
      : existingProject.imageUrl;

    // Update only the fields that need to be updated
    const updatedData = {
      name: req.body.name || existingProject.name,
      description: req.body.description || existingProject.description,
      imageUrl: imageUrl,
      link: req.body.link || existingProject.link,
      categoryId: req.body.categoryId
        ? Number(req.body.categoryId)
        : existingProject.categoryId,
      client: req.body.client || existingProject.client,
    };

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: updatedData,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        link: true,
        categoryId: true,
        client: true,
        createAt: true,
        updateAt: true,
      },
    });

    res.json({
      result: project,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-project)",
      error: error,
      success: false,
    });
  }
};

export const editProjects = async (
  req: projectRequest,
  res: Response | any,
) => {
  try {
    // Assuming req.body contains an array of projects with their ids
    const projects = req.body; // Example: [{ id: 1, name: 'New Name', description: 'New Description', imageUrl: '...' }, ...]

    const updatedProjectsPromises = projects.map(async (project: any) => {
      // Find the existing project by id
      const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(project.id) },
      });

      if (!existingProject) {
        throw new Error(`Project with id ${project.id} not found`);
      }

      // Handle image upload logic: if image is provided, upload it, else keep the existing image URL
      const imageUrl = project.file
        ? await uploadToR2(project.file)
        : project.imageUrl || existingProject.imageUrl;

      // Update the project with new data
      return prisma.project.update({
        where: { id: parseInt(project.id) }, // Update project by its ID
        data: {
          ...project,
          imageUrl: imageUrl,
        },
      });
    });

    // Wait for all projects to be updated
    const updatedProjects = await Promise.all(updatedProjectsPromises);

    res.json({
      result: updatedProjects,
      message: `${updatedProjects.length} projects have been successfully updated.`,
      success: true,
    });
  } catch (error) {
    // Return a more detailed error if a specific project is not found
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-projects)",
      error: error,
      success: false,
    });
  }
};

export const deleteProject = async (
  req: projectRequest,
  res: Response | any,
) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: { ...project },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/remove-project)",
      error: error,
      success: false,
    });
  }
};

export const deleteProjects = async (
  req: projectRequest,
  res: Response | any,
) => {
  try {
    // Assuming req.body contains an array of project IDs to delete
    const { ids } = req.body; // Example: { ids: [1, 2, 3] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid input format. Expected an array of project IDs.",
        success: false,
      });
    }

    // Deleting multiple projects by their IDs
    const deletedProjects = await prisma.project.deleteMany({
      where: {
        id: { in: ids.map((id) => parseInt(id)) }, // Deleting projects that match these IDs
      },
    });

    res.json({
      message: `${deletedProjects.count} projects have been successfully deleted.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-projects)",
      error: error,
      success: false,
    });
  }
};

export const getProjectBySlug = async (
  req: projectRequest,
  res: Response | any,
) => {
  try {
    const { slug } = req.params;

    // First try to find by slug field if it exists
    let project = await prisma.project.findFirst({
      where: {
        slug: slug,
      },
    });

    // If not found by slug, try to find by ID (if slug is numeric)
    if (!project && !isNaN(Number(slug))) {
      project = await prisma.project.findUnique({
        where: {
          id: parseInt(slug),
        },
      });
    }

    if (!project) {
      const projects = await prisma.project.findMany();

      project =
        projects.find(
          (e) =>
            e.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") === slug,
        ) || null;
    }

    if (!project) {
      return res.status(404).json({
        message: `project with slug ${slug} not found.`,
        success: false,
      });
    }

    res.json({
      result: project,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-project-by-slug)",
      error: error,
      success: false,
    });
  }
};

// Export the multer middleware for use in your routes
export const uploadMiddleware = upload.array("imageUrl", 10);
