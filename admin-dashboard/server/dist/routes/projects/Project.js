"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Project_1 = require("../../controllers/projects/Project");
const router = express_1.default.Router();
router.get("/get-projects", Project_1.getProjects);
router.get("/", Project_1.getProject);
router.get("/get-project-by-slug/:slug", Project_1.getProjectBySlug);
router.post("/order", Project_1.updateProjectOrder);
router.post("/add-project", Project_1.uploadMiddleware, Project_1.addProject);
router.post("/add-projects", Project_1.addProjects);
router.put("/edit-project/:id", Project_1.uploadMiddleware, Project_1.editProject);
router.post("/edit-projects", Project_1.editProjects);
router.delete("/delete-project/:id", Project_1.deleteProject);
router.delete("/delete-projects", Project_1.deleteProjects);
exports.default = router;
