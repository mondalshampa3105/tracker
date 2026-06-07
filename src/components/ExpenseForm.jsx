import { useState } from "react";

export default function ExpenseForm({ initial, categories, onSubmit, onClose }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    amount: initial?.amount ?? "",
    category: initial?.category || "Other",
    date: initial?.date
      ? initial.date.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    notes: initial?.notes || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.title.trim() || form.amount === "") {
      setError("Title and amount are required.");
      return;
    }
    const amount = Number(form.amount);
    if (isNaN(amount) || amount < 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ ...form, amount });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="form-grid">
      {error && <div className="error-banner">{error}</div>}
      <div className="field">
        <label>Title *</label>
        <input className="input" value={form.title} onChange={set("title")} placeholder="Groceries" />
      </div>
      <div className="form-row">
        <div className="field">
          <label>Amount *</label>
          <input type="number" step="0.01" className="input" value={form.amount} onChange={set("amount")} placeholder="42.50" />
        </div>
        <div className="field">
          <label>Category</label>
          <select className="select" value={form.category} onChange={set("category")}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Date</label>
        <input type="date" className="input" value={form.date} onChange={set("date")} />
      </div>
      <div className="field">
        <label>Notes</label>
        <textarea className="input" value={form.notes} onChange={set("notes")} placeholder="Weekly shop at the market" />
      </div>
      <div className="modal-actions">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
