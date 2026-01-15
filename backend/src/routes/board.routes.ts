import { getBoard, createBoard, updateBoard, deleteBoard } from "@src/controllers/board.controller";
import { Router } from "express";
import { authMiddleware } from "@src/middlewares/auth.middleware";
import { boardValidator } from "@src/validation/board.create.validation";
import { boardUpdateValidator } from "@src/validation/board.update.validation";

const router = Router()

router.get("/", authMiddleware, getBoard)
router.post("/", authMiddleware, boardValidator, createBoard)
router.put("/", authMiddleware, boardUpdateValidator, updateBoard)
router.delete("/", authMiddleware, deleteBoard)

export default router
