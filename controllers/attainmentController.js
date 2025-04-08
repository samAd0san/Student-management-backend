const Attainment = require("../models/attainmentModel");

// Create new attainment
exports.createAttainment = async (req, res) => {
  try {
    const newAttainment = new Attainment(req.body);
    const saved = await newAttainment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all attainments
exports.getAllAttainments = async (req, res) => {
  try {
    const attainments = await Attainment.find().populate("subject", "_id name");
    res.json(attainments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get attainment by subjectId and examType
exports.getAttainmentsBySubjectAndExamType = async (req, res) => {
  const { id, examType } = req.params;

  try {
    const data = await Attainment.find({
      subject: id,
      examType: examType,
    }).populate("subject");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update attainment by ID
exports.updateAttainment = async (req, res) => {
  try {
    const updated = await Attainment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete attainment by ID
exports.deleteAttainment = async (req, res) => {
  try {
    await Attainment.findByIdAndDelete(req.params.id);
    res.json({ message: "Attainment deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
