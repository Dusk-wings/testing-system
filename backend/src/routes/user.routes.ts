import { Router } from "express";
import { createUser, getUser, refereshToken } from "../controllers/user.controller";
import { userValidation } from "../validation/user.validation";
import { refereshTokenValidation } from "../validation/referesh.validation";

const router = Router();

router.get('/', userValidation, getUser);
router.post('/', createUser);
router.post('/refresh-token', refereshTokenValidation, refereshToken);

export default router