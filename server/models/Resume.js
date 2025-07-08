const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true }, // associate with user
  filePath: { type: String, required: true }, // store the path to uploaded file
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', ResumeSchema);
