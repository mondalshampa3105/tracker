import mongoose from "mongoose";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      default: "Other",
    },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
