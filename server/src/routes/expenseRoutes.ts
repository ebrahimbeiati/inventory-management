import { Router } from "express";
import { getExpensesByCategory } from "../controllers/expenseController";

const router = Router();

// Redirect root to the category endpoint for now
router.get("/", (req, res) => {
  res.redirect("/expenses/category");
});

router.get("/category", getExpensesByCategory);

export default router;