import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { api } from "./api/client.js";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import Expenses from "./pages/Expenses.jsx";

export default function App() {
  const [meta, setMeta] = useState({ jobStatuses: [], expenseCategories: [] });
  const [metaError, setMetaError] = useState("");

  useEffect(() => {
    api
      .getMeta()
      .then(setMeta)
      .catch((err) => setMetaError(err.message));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="dot" /> Trackr
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
            <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>
              Jobs
            </NavLink>
            <NavLink to="/expenses" className={({ isActive }) => (isActive ? "active" : "")}>
              Expenses
            </NavLink>
          </nav>
        </div>
      </header>

      {metaError && (
        <div className="container" style={{ paddingTop: 20 }}>
          <div className="error-banner">
            Can't reach the API ({metaError}). Check that the backend is running
            and VITE_API_URL is set correctly.
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs meta={meta} />} />
        <Route path="/expenses" element={<Expenses meta={meta} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
