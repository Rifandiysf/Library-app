import { Router } from "express";
import { deleteMembers, getAllMembers, getMembersById, updateMembers } from "src/controllers/Members.controller";
import { authenticate } from "src/middlewares/Auth.middleware";
import { requiredAdmin } from "src/middlewares/Role.middleware";


const router = Router();

router.get("/", authenticate, requiredAdmin, getAllMembers);
router.get("/:id", authenticate, requiredAdmin, getMembersById);
router.put("/:id", authenticate, requiredAdmin, updateMembers);
router.get("/:id", authenticate, requiredAdmin, deleteMembers);

export default router;