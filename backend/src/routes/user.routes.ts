import { Router } from "express";
import {
    createUser,
    getUser,
    refereshToken,
    updateUser,
    deleteUser,
    loginUser,
    logout
} from "../controllers/user.controller";
import { userValidation } from "../validation/user.validation";
import { refereshTokenValidation } from "../validation/referesh.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { updateUserValidationMiddleware } from "../validation/user.update.validation";
import { deleteUserValidationMiddleware } from "../validation/user.delete.validation";
import { validateLoginSchema } from "../validation/user.login.validation";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get('/', authMiddleware, getUser);
router.post('/', userValidation, createUser);
router.post('/login', validateLoginSchema, loginUser);
router.post('/refresh-token', refereshToken);
router.put('/', authMiddleware, upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), updateUserValidationMiddleware, updateUser);
router.delete('/', authMiddleware, deleteUserValidationMiddleware, deleteUser);
router.post('/logout', authMiddleware, logout);
export default router