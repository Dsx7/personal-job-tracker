import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: String, required: true },
  position: { type: String, default: "Job Position" },
  jobUrl: { type: String, required: true },
  
  deadline: { type: String }, 
  advertisementUrl: { type: String },
  localPdfPath: { type: String },

  portalUsername: { type: String, default: "" },
  portalPassword: { type: String, default: "" },
  
  // --- ADD THIS FIELD ---
  notes: { type: String, default: "" }, 
  // ----------------------

  appliedDate: { type: Date },

  status: { 
    type: String, 
    enum: ['Pending', 'Applied', 'Rejected', 'Interview'], 
    default: 'Pending' 
  },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);