const InternalMarks = require("../models/internalMarksModel");

// Create a new internal marks entry
exports.createInternalMarks = async (req, res) => {
  try {
    const { student, subject, examType, marks, year, semester, section } = req.body;

    const newInternalMarks = new InternalMarks({
      student,
      subject,
      examType,
      marks,
      year,
      semester,
      section,
    });

    await newInternalMarks.save();
    res.status(201).json({ message: "Internal Marks entry created successfully", data: newInternalMarks });
  } catch (error) {
    res.status(500).json({ message: "Error creating internal marks entry", error: error.message });
  }
};

// Get all internal marks entries
exports.getAllInternalMarks = async (req, res) => {
  try {
    const internalMarks = await InternalMarks.find()
      .populate("student", "rollNo name") // Populate student details
      .populate("subject", "name code"); // Populate subject details

    res.status(200).json(internalMarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching internal marks", error: error.message });
  }
};

// Get internal marks by year, semester, section, and exam type
exports.getInternalMarksByYearSemesterSectionExam = async (req, res) => {
  try {
    const { year, semester, section, examType } = req.params;
    
    const internalMarks = await InternalMarks.find({ year, semester, section, examType })
      .populate("student", "rollNo name")
      .populate("subject", "name code");
    
    res.status(200).json(internalMarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching internal marks", error: error.message });
  }
};

// Get internal marks by subject and exam type
exports.getInternalMarksBySubjectExamType = async (req, res) => {
  try {
    const { subject_id, examType } = req.params;

    const internalMarks = await InternalMarks.find({ subject: subject_id, examType })
      .populate("student", "rollNo name");

    res.status(200).json(internalMarks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching internal marks", error: error.message });
  }
};

// Get total internal marks by subject and exam type
exports.getQuestionTotals = async (req, res) => {
  try {
    const { subject_id, examType } = req.params;

    const internalMarks = await InternalMarks.find({ 
      subject: subject_id, 
      examType 
    }).populate("student", "rollNo name");

    const questionTotals = internalMarks.map(mark => {
      const q1Total = mark.marks.Q1.a + mark.marks.Q1.b + mark.marks.Q1.c;
      const q2Total = mark.marks.Q2.a + mark.marks.Q2.b;
      const q3Total = mark.marks.Q3.a + mark.marks.Q3.b;
      const q4Total = mark.marks.Q4.a + mark.marks.Q4.b;

      return {
        student: {
          id: mark.student._id,
          rollNo: mark.student.rollNo,
          name: mark.student.name
        },
        internalMarks: {
          Q1: q1Total,
          Q2: q2Total,
          Q3: q3Total,
          Q4: q4Total
        }
      };
    });

    res.status(200).json(questionTotals);
  } catch (error) {
    res.status(500).json({ 
      message: "Error calculating question totals", 
      error: error.message 
    });
  }
};

// Update internal marks by subject, exam type, and id
exports.updateInternalMarksBySubjectExamType = async (req, res) => {
  try {
    const { subject_id, examType, id } = req.params;
    const { marks } = req.body;

    const updatedInternalMarks = await InternalMarks.findOneAndUpdate(
      { _id: id, subject: subject_id, examType },
      { marks },
      { new: true }
    );

    if (!updatedInternalMarks) return res.status(404).json({ message: "Internal Marks entry not found" });

    res.status(200).json({ message: "Internal Marks updated successfully", data: updatedInternalMarks });
  } catch (error) {
    res.status(500).json({ message: "Error updating internal marks", error: error.message });
  }
};

// Delete internal marks by subject, exam type, and id
exports.deleteInternalMarksBySubjectExamType = async (req, res) => {
    try {
      const { subject_id, examType, id } = req.params;
  
      const deletedInternalMarks = await InternalMarks.findOneAndDelete({
        _id: id,
        subject: subject_id,
        examType,
      });
  
      if (!deletedInternalMarks) {
        return res.status(404).json({ message: "Internal Marks entry not found" });
      }
  
      res.status(200).json({ message: "Internal Marks deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting internal marks", error: error.message });
    }
  };
  