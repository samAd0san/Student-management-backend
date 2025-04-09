const Attainment = require("../models/attainmentModel");

// Create new attainment
exports.createAttainment = async (req, res) => {
  const { subject, examType } = req.body;

  try {
    // Check if a record already exists for the same subject and examType
    const existing = await Attainment.findOne({ subject, examType });

    if (existing) {
      return res.status(400).json({
        message:
          "An attainment record already exists for this subject and exam type.",
      });
    }

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
  const { subjectId, examType } = req.params;

  try {
    const data = await Attainment.find({
      subject: subjectId,
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

// Update attainment by subjectId and examType
exports.updateAttainmentsBySubjectAndExamType = async (req, res) => {
  const { subjectId, examType } = req.params;
  const { attainmentUpdates } = req.body; // Array of objects like [{ coNo: 'CO1', attainmentLevel: 3 }, ...]

  try {
    const attainment = await Attainment.findOne({
      subject: subjectId,
      examType: examType,
    });

    if (!attainment) {
      return res.status(404).json({ error: "Attainment record not found" });
    }

    let updatedCount = 0;

    // Update the attainmentData with the new attainmentLevel for each coNo
    attainmentUpdates.forEach((update) => {
      const coData = attainment.attainmentData.find(
        (co) => co.coNo === update.coNo
      );
      if (coData) {
        coData.attainmentLevel = update.attainmentLevel;
        updatedCount++;
      } else {
        console.warn(`coNo ${update.coNo} not found in attainmentData`);
      }
    });

    if (updatedCount === 0) {
      return res.status(400).json({
        message:
          "No matching coNo found in attainmentData. Nothing was updated.",
      });
    }

    // Save the updated attainment record
    await attainment.save();
    res.status(200).json({ message: "Attainment levels updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
