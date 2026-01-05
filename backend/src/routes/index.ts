import { Router } from "express";
import userRouter from './user.routes'

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World! From Router");
})

router.use('/users', userRouter)

export default router