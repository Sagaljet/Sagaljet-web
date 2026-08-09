import { Router } from "express";
import {
  getPrintings,
  getPrinting,
  addPrinting,
  editPrinting,
  deletePrinting,
} from "../../controllers/printing/printing.controller";

const router = Router();

router.get("/printings", getPrintings);
router.get("/printing/:id", getPrinting);
router.post("/printing", addPrinting);
router.put("/printing/:id", editPrinting);
router.delete("/printing/:id", deletePrinting);

export default router;