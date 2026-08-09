import express from "express";

import {
  createTeam,
  deleteTeam,
  getTeam,
  updateTeam,
  updateTeamOrder,
  uploadMiddleware,
} from "../../controllers/teams/Team";

const router = express.Router();

router.post("/", uploadMiddleware, createTeam);
router.get("/all", getTeam);
router.post("/order", updateTeamOrder);
router.delete("/delete/:id", deleteTeam);
router.put("/update", uploadMiddleware, updateTeam);

export default router;
