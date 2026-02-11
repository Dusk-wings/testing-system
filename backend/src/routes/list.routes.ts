import { Router } from "express";
import { listValidator } from "@src/validation/list.create.validation";
import { listUpdateValidator } from "@src/validation/list.update.validation";
import {
    createList,
    updateList,
    deleteList
} from "@src/controllers/list.controller";
import { authMiddleware } from "@src/middlewares/auth.middleware";

const router = Router();

router.post("/create",
    authMiddleware,
    listValidator,
    createList
);
router.put("/update",
    authMiddleware,
    listUpdateValidator,
    updateList
);
router.delete("/delete/:list_id",
    authMiddleware,
    deleteList
);

export default router;