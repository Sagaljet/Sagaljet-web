"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Team_1 = require("../../controllers/teams/Team");
const router = express_1.default.Router();
router.post("/", Team_1.uploadMiddleware, Team_1.createTeam);
router.get("/all", Team_1.getTeam);
router.post("/order", Team_1.updateTeamOrder);
router.delete("/delete/:id", Team_1.deleteTeam);
router.put("/update", Team_1.uploadMiddleware, Team_1.updateTeam);
exports.default = router;
