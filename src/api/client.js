const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

const qs = (params) => {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v)
  );
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : "";
};

export const api = {
  // meta
  getMeta: () => request("/meta"),

  // jobs
  getJobs: (params) => request(`/jobs${qs(params)}`),
  getJobStats: () => request("/jobs/stats"),
  createJob: (data) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id, data) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: "DELETE" }),

  // expenses
  getExpenses: (params) => request(`/expenses${qs(params)}`),
  getExpenseStats: (params) => request(`/expenses/stats${qs(params)}`),
  createExpense: (data) => request("/expenses", { method: "POST", body: JSON.stringify(data) }),
  updateExpense: (id, data) => request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),
};
