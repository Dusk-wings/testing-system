import { Router } from "express";
import { validateTaskCreate } from "@src/validation/task.create.validation";
import { validateTaskUpdate } from "@src/validation/task.update.validation";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    updatePosition
} from "@src/controllers/task.controller";
import { authMiddleware } from "@src/middlewares/auth.middleware";

const router = Router()

router.post("/", authMiddleware, validateTaskCreate, createTask)
router.get("/", authMiddleware, getTasks)
router.put("/", authMiddleware, validateTaskUpdate, updateTask)
router.delete("/:id", authMiddleware, deleteTask)
router.put('/position', authMiddleware, updatePosition);

export default router
