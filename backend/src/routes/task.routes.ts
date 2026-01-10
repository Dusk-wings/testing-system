import { Router } from "express";
import { validateTaskCreate } from "@src/validation/task.create.validation";
import { validateTaskUpdate } from "@src/validation/task.update.validation";
import { createTask, getTasks, updateTask, deleteTask } from "@src/controllers/task.controller";
import { authMiddleware } from "@src/middlewares/auth.middleware";

const router = Router()

router.post("/", authMiddleware, validateTaskCreate, createTask)
router.get("/", authMiddleware, getTasks)
router.put("/", authMiddleware, validateTaskUpdate, updateTask)
router.delete("/", authMiddleware, deleteTask)

export default router
