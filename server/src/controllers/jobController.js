import Job from "../models/Job.js";

// GET /api/jobs?status=
export const getJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/jobs/stats  -> counts per status
export const getJobStats = async (req, res) => {
  try {
    const agg = await Job.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const stats = {};
    agg.forEach((row) => {
      stats[row._id] = row.count;
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const { company, role } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: "Company and role are required." });
    }
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ error: "Not found." });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ error: "Not found." });
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
