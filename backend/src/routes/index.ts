import { Router } from "express";
import userRouter from './user.routes';
import taskRouter from './task.routes';
import boardRouter from './board.routes';
import listRouter from './list.routes';

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World! From Router");
})

router.use('/users', userRouter);
router.use('/tasks', taskRouter);
router.use('/boards', boardRouter);
router.use('/lists', listRouter);

export default router;