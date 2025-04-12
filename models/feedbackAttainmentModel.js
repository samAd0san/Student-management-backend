const mongoose = require("mongoose");

const feedbackAttainmentSchema = new mongoose.Schema(
  {
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
    CO1: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    CO2: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    CO3: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    CO4: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    CO5: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("feedbackAttainment", feedbackAttainmentSchema);
