const mongoose = require('mongoose');

const InterviewQA_Schema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InterviewQA = mongoose.model('InterviewQA', InterviewQA_Schema);

module.exports = InterviewQA;
