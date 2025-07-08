const mongoose = require("mongoose");

const JobInterviewSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase UID (foreign key)
  jobDescription: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("JobInterview", JobInterviewSchema);
