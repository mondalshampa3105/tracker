import { Router } from "express";
import { JOB_STATUSES } from "../models/Job.js";
import { EXPENSE_CATEGORIES } from "../models/Expense.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ jobStatuses: JOB_STATUSES, expenseCategories: EXPENSE_CATEGORIES });
});

export default router;
