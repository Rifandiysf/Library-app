import { Router } from "express";
import { createBooks, deleteBooks, getAllBooks, getBookById, updateBooks } from "src/controllers/Books.controller";
import { authenticate } from "src/middlewares/Auth.middleware";
import { requiredAdmin } from "src/middlewares/Role.middleware";


const router = Router();

router.get("/", authenticate, getAllBooks);
router.get("/:id", authenticate, getBookById);
router.post("/", authenticate, requiredAdmin, createBooks);
router.put("/:id", authenticate, requiredAdmin, updateBooks);
router.get("/:id", authenticate, requiredAdmin, deleteBooks);

export default router;