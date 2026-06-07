import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

const fmt = (n) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });
const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function Dashboard() {
  const [jobStats, setJobStats] = useState({});
  const [expStats, setExpStats] = useState({ total: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [js, es] = await Promise.all([
          api.getJobStats(),
          api.getExpenseStats({ month: currentMonth() }),
        ]);
        setJobStats(js);
        setExpStats(es);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalJobs = Object.values(jobStats).reduce((a, b) => a + b, 0);
  const active =
    (jobStats.Applied || 0) + (jobStats.Interview || 0) + (jobStats.Offer || 0);
  const maxCat = Math.max(...expStats.byCategory.map((c) => c.total), 1);

  const monthName = new Date().toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  if (loading) return <div className="page container"><div className="loading">Loading…</div></div>;

  return (
    <div className="page container">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">{monthName}</div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats">
        <div className="stat">
          <div className="label">Total applications</div>
          <div className="value">{totalJobs}</div>
        </div>
        <div className="stat">
          <div className="label">Active in pipeline</div>
          <div className="value">{active}</div>
        </div>
        <div className="stat">
          <div className="label">Offers</div>
          <div className="value">{jobStats.Offer || 0}</div>
        </div>
        <div className="stat">
          <div className="label">Spent this month</div>
          <div className="value coral">{fmt(expStats.total)}</div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="panel">
          <h3>
            Pipeline <Link to="/jobs">Manage →</Link>
          </h3>
          {totalJobs === 0 ? (
            <div style={{ color: "var(--ink-soft)" }}>No applications yet.</div>
          ) : (
            ["Wishlist", "Applied", "Interview", "Offer", "Rejected"].map((s) => {
              const count = jobStats[s] || 0;
              const pct = totalJobs ? (count / totalJobs) * 100 : 0;
              return (
                <div className="bar-row" key={s}>
                  <span className="bar-label">{s}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bar-val">{count}</span>
                </div>
              );
            })
          )}
        </div>

        <div className="panel">
          <h3>
            Spending by category <Link to="/expenses">Manage →</Link>
          </h3>
          {expStats.byCategory.length === 0 ? (
            <div style={{ color: "var(--ink-soft)" }}>No expenses this month.</div>
          ) : (
            expStats.byCategory.map((c) => (
              <div className="bar-row" key={c.category}>
                <span className="bar-label">{c.category}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(c.total / maxCat) * 100}%`,
                      background: "var(--blue)",
                    }}
                  />
                </div>
                <span className="bar-val">{fmt(c.total)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
