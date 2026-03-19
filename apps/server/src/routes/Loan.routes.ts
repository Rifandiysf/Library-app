import { Router } from "express";
import { createLoan, getAllLoan, returnLoan } from "src/controllers/Loan.controller";
import { authenticate } from "src/middlewares/Auth.middleware";

const router = Router();

router.get("/", authenticate, getAllLoan);
router.post("/", authenticate, createLoan);
router.patch("/:id/return", authenticate, returnLoan);

export default router;