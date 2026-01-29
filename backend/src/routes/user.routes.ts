import { Router } from "express";
import {
    createUser,
    getUser,
    refereshToken,
    updateUser,
    deleteUser,
    loginUser
} from "../controllers/user.controller";
import { userValidation } from "../validation/user.validation";
import { refereshTokenValidation } from "../validation/referesh.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { updateUserValidationMiddleware } from "../validation/user.update.validation";
import { deleteUserValidationMiddleware } from "../validation/user.delete.validation";
import { validateLoginSchema } from "../validation/user.login.validation";

const router = Router();

router.get('/', authMiddleware, getUser);
router.post('/', userValidation, createUser);
router.post('/login', validateLoginSchema, loginUser);
router.post('/refresh-token', refereshTokenValidation, refereshToken);
router.put('/', authMiddleware, updateUserValidationMiddleware, updateUser);
router.delete('/', authMiddleware, deleteUserValidationMiddleware, deleteUser);

export default router