import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Modal from "../components/Modal.jsx";
import JobForm from "../components/JobForm.jsx";

export default function Jobs({ meta }) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | 'new' | job object

  const statuses = meta.jobStatuses || [];

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [j, s] = await Promise.all([
        api.getJobs({ status: filter }),
        api.getJobStats(),
      ]);
      setJobs(j);
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
  }, [filter]);

  const handleSubmit = async (data) => {
    if (modal === "new") await api.createJob(data);
    else await api.updateJob(modal._id, data);
    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    await api.deleteJob(id);
    await load();
  };

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="page container">
      <div className="page-head">
        <div>
          <h1>Job Applications</h1>
          <div className="sub">Track every role from wishlist to offer.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("new")}>
          + Add application
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="pills">
        <button
          className={`pill ${!filter ? "active" : ""}`}
          onClick={() => setFilter("")}
        >
          All <span className="count">{total}</span>
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            className={`pill ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s} <span className="count">{stats[s] || 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <div className="big">Nothing here yet</div>
          <div>Add your first application to get started.</div>
        </div>
      ) : (
        <div className="list">
          {jobs.map((job) => (
            <div className="item" key={job._id}>
              <div className="item-main">
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span className="item-title">{job.role}</span>
                  <span className={`badge badge-${job.status}`}>{job.status}</span>
                </div>
                <div className="item-sub">
                  {job.company}
                  {job.salary && ` · ${job.salary}`}
                  {job.appliedDate &&
                    ` · applied ${new Date(job.appliedDate).toLocaleDateString()}`}
                </div>
                {job.link && (
                  <div className="item-sub">
                    <a href={job.link} target="_blank" rel="noreferrer" style={{ color: "var(--coral)" }}>
                      View posting ↗
                    </a>
                  </div>
                )}
                {job.notes && <div className="item-notes">{job.notes}</div>}
              </div>
              <div className="item-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setModal(job)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === "new" ? "Add application" : "Edit application"}
          onClose={() => setModal(null)}
        >
          <JobForm
            initial={modal === "new" ? null : modal}
            statuses={statuses}
            onSubmit={handleSubmit}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
