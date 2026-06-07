import { useState } from "react";

export default function JobForm({ initial, statuses, onSubmit, onClose }) {
  const [form, setForm] = useState({
    company: initial?.company || "",
    role: initial?.role || "",
    status: initial?.status || "Wishlist",
    link: initial?.link || "",
    salary: initial?.salary || "",
    notes: initial?.notes || "",
    appliedDate: initial?.appliedDate
      ? initial.appliedDate.slice(0, 10)
      : "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and role are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        ...form,
        appliedDate: form.appliedDate || undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="form-grid">
      {error && <div className="error-banner">{error}</div>}
      <div className="form-row">
        <div className="field">
          <label>Company *</label>
          <input className="input" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
        </div>
        <div className="field">
          <label>Role *</label>
          <input className="input" value={form.role} onChange={set("role")} placeholder="Frontend Engineer" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Status</label>
          <select className="select" value={form.status} onChange={set("status")}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Applied date</label>
          <input type="date" className="input" value={form.appliedDate} onChange={set("appliedDate")} />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Salary (optional)</label>
          <input className="input" value={form.salary} onChange={set("salary")} placeholder="$120k" />
        </div>
        <div className="field">
          <label>Link (optional)</label>
          <input className="input" value={form.link} onChange={set("link")} placeholder="https://..." />
        </div>
      </div>
      <div className="field">
        <label>Notes</label>
        <textarea className="input" value={form.notes} onChange={set("notes")} placeholder="Referral from Sam, recruiter call next week..." />
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
