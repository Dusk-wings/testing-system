import { Router } from "express";
import { createUser, getUser, refereshToken, updateUser } from "../controllers/user.controller";
import { userValidation } from "../validation/user.validation";
import { refereshTokenValidation } from "../validation/referesh.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { updateUserValidationMiddleware } from "../validation/user.update.validation";

const router = Router();

router.get('/', authMiddleware, getUser);
router.post('/', userValidation, createUser);
router.post('/refresh-token', refereshTokenValidation, refereshToken);
router.put('/', authMiddleware, updateUserValidationMiddleware, updateUser);

export default router