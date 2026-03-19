import { Router } from "express";
import authRoutes from "./Auth.routes";
import booksRoutes from "./Books.routes";
import memberRoutes from "./Members.routes";
import loanRoutes from "./Loan.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", booksRoutes);
router.use("/members", memberRoutes);
router.use("/loans", loanRoutes);

export default router;