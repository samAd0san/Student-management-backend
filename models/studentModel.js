// studentModel.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  branch: { type: String, required: true },
  currentYear: { type: Number, required: true },
  currentSemester: { type: Number, required: true },
  section: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);