const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mcqs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' }], // Selected MCQs
  subject: { type: String },
  topic: { type: String },
  exam: { type: String },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);
