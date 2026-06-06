import Expense from "../models/Expense.js";

// GET /api/expenses?category=&month=YYYY-MM
export const getExpenses = async (req, res) => {
  try {
    const { category, month } = req.query;
    const query = {};
    if (category) query.category = category;
    if (month) {
      const [year, mon] = month.split("-").map(Number);
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1);
      query.date = { $gte: start, $lt: end };
    }
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/expenses/stats?month=YYYY-MM -> total + per-category
export const getExpenseStats = async (req, res) => {
  try {
    const { month } = req.query;
    const match = {};
    if (month) {
      const [year, mon] = month.split("-").map(Number);
      match.date = {
        $gte: new Date(year, mon - 1, 1),
        $lt: new Date(year, mon, 1),
      };
    }

    const agg = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const total = agg.reduce((sum, row) => sum + row.total, 0);
    const byCategory = agg.map((row) => ({
      category: row._id,
      total: row.total,
      count: row.count,
    }));

    res.json({ total, byCategory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { title, amount } = req.body;
    if (!title || amount == null) {
      return res.status(400).json({ error: "Title and amount are required." });
    }
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) return res.status(404).json({ error: "Not found." });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ error: "Not found." });
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
