import { Router } from "express";
import { getProfile, login, register } from "src/controllers/Auth.controller";
import { authenticate } from "src/middlewares/Auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", authenticate, getProfile);

export default router;