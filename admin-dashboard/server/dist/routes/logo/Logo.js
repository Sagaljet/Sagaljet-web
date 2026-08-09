"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../../controllers/secure/JWT");
const logo_1 = require("../../controllers/logo/logo");
const router = express_1.default.Router();
router.get("/get-Logos", logo_1.getLogos);
router.get("/get-Logo/:id", logo_1.getlogo);
router.post("/add-logo", JWT_1.decoded, logo_1.uploadMiddleware, logo_1.addlogo);
router.put("/edit-logo/:id", logo_1.uploadMiddleware, logo_1.editlogo);
router.delete("/delete-Logo/:id", JWT_1.decoded, logo_1.deletelogo);
exports.default = router;
