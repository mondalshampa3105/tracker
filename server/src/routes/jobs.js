import { Router } from "express";
import {
  getJobs,
  getJobStats,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = Router();

router.get("/stats", getJobStats);
router.get("/", getJobs);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
