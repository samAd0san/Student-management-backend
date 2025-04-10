const mongoose = require("mongoose");

const attainmentSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    attainmentData: [
      {
        _id: false,
        coNo: {
          type: String,
          required: true,
        },
        attainmentLevel: {
          type: Number,
          required: false,
        },
      },
    ],
    attainmentType: {
      type: String,
      enum: ["direct", "indirect", "computedDirect", "computedIndirect"],
      required: true,
    },
    examType: {
      type: String,
      enum: ["CIE-1", "CIE-2", "SEE", "COMPUTED"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attainment", attainmentSchema);
