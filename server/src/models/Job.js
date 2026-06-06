import mongoose from "mongoose";

export const JOB_STATUSES = [
  "Wishlist",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: JOB_STATUSES,
      default: "Wishlist",
    },
    link: { type: String, trim: true, default: "" },
    salary: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    appliedDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
