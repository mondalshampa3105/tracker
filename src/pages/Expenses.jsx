import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Modal from "../components/Modal.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";

const fmt = (n) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function Expenses({ meta }) {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ total: 0, byCategory: [] });
  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);

  const categories = meta.expenseCategories || [];

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [e, s] = await Promise.all([
        api.getExpenses({ month, category }),
        api.getExpenseStats({ month }),
      ]);
      setExpenses(e);
      setStats(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, category]);

  const handleSubmit = async (data) => {
    if (modal === "new") await api.createExpense(data);
    else await api.updateExpense(modal._id, data);
    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    await api.deleteExpense(id);
    await load();
  };

  return (
    <div className="page container">
      <div className="page-head">
        <div>
          <h1>Expenses</h1>
          <div className="sub">Where your money actually goes.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("new")}>
          + Add expense
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats">
        <div className="stat">
          <div className="label">This view total</div>
          <div className="value coral">{fmt(stats.total)}</div>
        </div>
        {stats.byCategory.slice(0, 3).map((c) => (
          <div className="stat" key={c.category}>
            <div className="label">{c.category}</div>
            <div className="value">{fmt(c.total)}</div>
          </div>
        ))}
      </div>

      <div className="filters">
        <div className="field">
          <label>Month</label>
          <input
            type="month"
            className="input"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Category</label>
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : expenses.length === 0 ? (
        <div className="empty">
          <div className="big">No expenses for this period</div>
          <div>Add one, or pick a different month.</div>
        </div>
      ) : (
        <div className="list">
          {expenses.map((exp) => (
            <div className="item" key={exp._id}>
              <div className="item-main">
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span className="item-title">{exp.title}</span>
                  <span className="badge badge-cat">{exp.category}</span>
                </div>
                <div className="item-sub">
                  {new Date(exp.date).toLocaleDateString()}
                </div>
                {exp.notes && <div className="item-notes">{exp.notes}</div>}
              </div>
              <div className="item-right">
                <div className="amount">{fmt(exp.amount)}</div>
                <div className="item-actions" style={{ marginTop: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal(exp)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(exp._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === "new" ? "Add expense" : "Edit expense"}
          onClose={() => setModal(null)}
        >
          <ExpenseForm
            initial={modal === "new" ? null : modal}
            categories={categories}
            onSubmit={handleSubmit}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
