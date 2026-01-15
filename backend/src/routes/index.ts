import { Router } from "express";
import userRouter from './user.routes'
import taskRouter from './task.routes'
import boardRouter from './board.routes'

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World! From Router");
})

router.use('/users', userRouter)
router.use('/tasks', taskRouter)
router.use('/boards', boardRouter)

export default router