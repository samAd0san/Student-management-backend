const mongoose = require("mongoose");

const InternalMarksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  examType: {
    type: String,
    enum: ["CIE-1", "CIE-2"],
    required: true,
  },
  marks: {
    Q1: {
      a: { type: Number, default: 0 },
      b: { type: Number, default: 0 },
      c: { type: Number, default: 0 },
    },
    Q2: {
      a: { type: Number, default: 0 },
      b: { type: Number, default: 0 },
    },
    Q3: {
      a: { type: Number, default: 0 },
      b: { type: Number, default: 0 },
    },
    Q4: {
      a: { type: Number, default: 0 },
      b: { type: Number, default: 0 },
    },
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("InternalMarksSchema", InternalMarksSchema);
