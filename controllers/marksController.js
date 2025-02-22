const Marks = require("../models/marksModel");

// Add/Update Marks for a Single Student
exports.addMarks = async (req, res) => {
  const {
    student,
    subject,
    examType,
    marks,
    maxMarks,
    regulation,
    year,
    semester,
    section,
  } = req.body;

  try {
    // Find existing marks entry for the student, subject, and exam type
    let marksEntry = await Marks.findOne({ student, subject, examType });

    if (marksEntry) {
      // Update existing marks
      marksEntry.marks = marks;
      marksEntry.maxMarks = maxMarks; // Optionally update maxMarks if required
      marksEntry.regulation = regulation;
      marksEntry.year = year;
      marksEntry.semester = semester;
      marksEntry.section = section;
    } else {
      // Create new marks entry
      marksEntry = new Marks({
        student,
        subject,
        examType,
        marks,
        maxMarks,
        regulation,
        year,
        semester,
        section,
      });
    }

    // Save the marks entry to the database
    await marksEntry.save();

    res.status(200).json({ message: "Marks saved successfully", marksEntry });
  } catch (error) {
    console.error("Error saving marks:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error saving marks", error: error.message });
  }
};

// Get Marks for a specific subject and exam type
exports.getMarks = async (req, res) => {
  const { subject_id, examType } = req.params;

  try {
    // Fetch all marks for the given subject and exam type
    const marks = await Marks.find({ subject: subject_id, examType }).populate(
      "student",
      "name rollNo"
    );
    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving marks", error });
  }
};

// Get Avg of best 2 surprise tests AND assignments for a specific subject
exports.getAvgOfBestTwoSurpriseAndAssignment = async (req, res) => {
  try {
    const { subject_id } = req.params;
    
    // Get all surprise tests and assignments marks for the subject
    const allMarks = await Marks.find({
      subject: subject_id,
      examType: { 
        $in: [
          'SURPRISE TEST-1', 'SURPRISE TEST-2', 'SURPRISE TEST-3',
          'ASSIGNMENT-1', 'ASSIGNMENT-2', 'ASSIGNMENT-3'
        ] 
      }
    }).populate('student', 'rollNo name');

    // Group marks by student
    const studentMarks = {};
    
    allMarks.forEach(mark => {
      const studentId = mark.student._id.toString();
      
      if (!studentMarks[studentId]) {
        studentMarks[studentId] = {
          student: {
            id: mark.student._id,
            rollNo: mark.student.rollNo,
            name: mark.student.name
          },
          surpriseTests: [],
          assignments: []
        };
      }
      
      // Separate surprise tests and assignments
      if (mark.examType.includes('SURPRISE TEST')) {
        studentMarks[studentId].surpriseTests.push({
          examType: mark.examType,
          marks: mark.marks
        });
      } else {
        studentMarks[studentId].assignments.push({
          examType: mark.examType,
          marks: mark.marks
        });
      }
    });

    // Custom rounding function
    const customRound = (number) => {
      return number >= 9.5 ? 10 : Math.floor(number);
    };

    // Calculate averages for each student
    const results = Object.values(studentMarks).map(student => {
      // Calculate for surprise tests
      const bestTwoSurpriseTests = student.surpriseTests
        .map(test => test.marks)
        .sort((a, b) => b - a)
        .slice(0, 2);
      
      const surpriseTestAvg = bestTwoSurpriseTests.length > 0 
        ? bestTwoSurpriseTests.reduce((a, b) => a + b, 0) / 2
        : 0;

      // Calculate for assignments
      const bestTwoAssignments = student.assignments
        .map(assignment => assignment.marks)
        .sort((a, b) => b - a)
        .slice(0, 2);
      
      const assignmentAvg = bestTwoAssignments.length > 0 
        ? bestTwoAssignments.reduce((a, b) => a + b, 0) / 2
        : 0;

      return {
        student: student.student,
        // surpriseTests: { 
          // allTests: student.surpriseTests,      // Uncomment to include all tests in the response
          // bestTwo: bestTwoSurpriseTests,
          surpriseTestAverage: customRound(surpriseTestAvg),
        // },
        // assignments: {
          // allAssignments: student.assignments,
          // bestTwo: bestTwoAssignments,
          assignmentAverage: customRound(assignmentAvg)
        // }
      };
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ 
      message: "Error calculating assessments average", 
      error: error.message 
    });
  }
};

// Get Marks for Students based on year, semester, section, and exam type
exports.getMarksByClassAndExam = async (req, res) => {
  const { year, semester, section, examType } = req.params;

  try {
    // Fetch marks for students in the given year, semester, section, and exam type
    const marks = await Marks.find({
      year,
      semester,
      section,
      examType,
    })
      .populate("student", "name rollNo")
      .populate("subject", "subjectName");

    if (!marks.length) {
      return res
        .status(404)
        .json({ message: "No marks found for the given filters" });
    }

    res.status(200).json(marks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving marks", error });
  }
};

// Update Marks for a Specific Entry
exports.updateMarks = async (req, res) => {
  const { id } = req.params; // ID of the marks entry to update
  const { marks, maxMarks, regulation, year, semester, section } = req.body;

  try {
    // Find the marks entry by ID
    const marksEntry = await Marks.findById(id);
    if (!marksEntry) {
      return res.status(404).json({ message: "Marks entry not found" });
    }

    // Update the fields in the marks entry
    marksEntry.marks = marks || marksEntry.marks; // Only update if new value is provided
    marksEntry.maxMarks = maxMarks || marksEntry.maxMarks; // Only update if new value is provided
    marksEntry.regulation = regulation || marksEntry.regulation; // Only update if new value is provided
    marksEntry.year = year || marksEntry.year; // Only update if new value is provided
    marksEntry.semester = semester || marksEntry.semester; // Only update if new value is provided
    marksEntry.section = section || marksEntry.section; // Only update if new value is provided

    // Save the updated entry to the database
    await marksEntry.save();

    res.status(200).json({ message: "Marks updated successfully", marksEntry });
  } catch (error) {
    console.error("Error updating marks:", error);
    res
      .status(500)
      .json({ message: "Error updating marks", error: error.message });
  }
};
