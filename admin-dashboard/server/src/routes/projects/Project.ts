import express, { Router } from "express";
import {
  addProject,
  addProjects,
  deleteProject,
  deleteProjects,
  editProject,
  editProjects,
  getProject,
  getProjectBySlug,
  getProjects,
  updateProjectOrder,
  uploadMiddleware,
} from "../../controllers/projects/Project";

const router: Router = express.Router();

router.get("/get-projects", getProjects);
router.get("/", getProject);
router.get("/get-project-by-slug/:slug", getProjectBySlug);
router.post("/order", updateProjectOrder);

router.post("/add-project", uploadMiddleware, addProject);
router.post("/add-projects", addProjects);

router.put("/edit-project/:id", uploadMiddleware, editProject);

router.post("/edit-projects", editProjects);

router.delete("/delete-project/:id", deleteProject);
router.delete("/delete-projects", deleteProjects);

export default router;
