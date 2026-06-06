import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import jobRoutes from "./routes/jobs.js";
import expenseRoutes from "./routes/expenses.js";
import metaRoutes from "./routes/meta.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "trackr-api" });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/meta", metaRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set. Check your .env file.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start:", err.message);
    process.exit(1);
  }
};

start();
