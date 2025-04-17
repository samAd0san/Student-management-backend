const moment = require('moment');
const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Subject = require('../models/subjectModel'); // Import Subject model
const Marks = require('../models/marksModel');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { rollNo, name, branch, currentYear, currentSemester, section, fatherName } = req.body;

    // Create new student object
    const newStudent = new Student({
      rollNo,
      name,
      branch,
      currentYear,
      currentSemester,
      section,
      fatherName,
    });

    // Save the student
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, { __v: 0 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single student by roll number
exports.getStudentByRollNo = async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNo: req.params.rollNo },
      req.body,
      { new: true } // Return the updated student
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ rollNo: req.params.rollNo });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(204).json(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { student: studentId, subject: subjectId, totalClasses, classesAttended, period, month, year } = req.body;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if the subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const attendance = new Attendance({
      student: studentId,
      subject: subjectId,
      totalClasses,
      classesAttended,
      period,
      month,
      year,
    });

    await attendance.save();
    
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get attendance records by period, month, and year
exports.getAttendanceByPeriodMonthYear = async (req, res) => {
  const { month, year, period } = req.params;

  try {
    const attendanceRecords = await Attendance.find({
      month: month,
      year: year,
      period: period,
    });
    
    res.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance by period, month, and year:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance records for a specific student
// http://localhost:3000/api/students/attendance/2021001
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const student = await Student.findOne({ rollNo });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const attendanceRecords = await Attendance.find({ student: student._id }).populate('subject', 'name _id');
    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    
    res.status(204).json(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get filtered students with attendance
exports.getFilteredStudentsWithAttendance = async (req, res) => {
  try {
    const { branch, year, semester, section, subjectId, period } = req.query;

    // Create a filter object to pass to MongoDB query
    const filter = {};
    if (branch) filter.branch = branch;
    if (year) filter.currentYear = year;
    if (semester) filter.currentSemester = semester;
    if (section) filter.section = section;

    // Fetch students based on the filter criteria
    const students = await Student.find(filter);

    // Fetch attendance records based on subject and period
    const attendanceRecords = await Attendance.find({ subject: subjectId, period: period });

    // Match attendance records with students
    const studentsWithAttendance = students.map(student => {
      const studentAttendance = attendanceRecords.filter(record => record.student.toString() === student._id.toString());
      return {
        ...student.toObject(),
        attendance: studentAttendance
      };
    });

    res.status(200).json(studentsWithAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Get attendance of a student within a date range along with marks 
exports.getStudentData = async (req, res) => {
  const { rollNo } = req.params;  // Extract rollNo from the URL
  const { startDate, endDate } = req.query;  // Extract startDate and endDate from query parameters

  try {
    // Validate if rollNo, startDate, and endDate are provided
    if (!rollNo || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required parameters: rollNo, startDate, or endDate." });
    }

    // Parse start and end dates to calculate the periods and months
    const start = moment(startDate, "DD/MM/YYYY");
    const end = moment(endDate, "DD/MM/YYYY");

    // Validate date format
    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use DD/MM/YYYY." });
    }

    // Validate if the start date is not after the end date
    if (start.isAfter(end)) {
      return res.status(400).json({ message: "Start date cannot be after the end date." });
    }

    // Fetch the student by rollNo
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Calculate the periods based on the provided date range
    let periods = [];
    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      if (current.date() <= 15 || current.isSame(start, 'day')) {
        periods.push({ period: '15th', month: current.month() + 1, year: current.year() });
      }

      if (current.isBefore(end, 'month') || (current.isSame(end, 'month') && end.date() > 15)) {
        const endOfMonth = current.endOf('month').date();
        if (endOfMonth >= 30) {
          periods.push({ period: '30th', month: current.month() + 1, year: current.year() });
        }
      }

      current.add(1, 'month').startOf('month');
    }

    // Build the query for attendance based on periods
    const query = {
      student: student._id,
      $or: periods.map(p => ({
        period: p.period,
        month: p.month,
        year: p.year
      }))
    };

    // Fetch attendance data for the student based on the periods
    const attendanceRecords = await Attendance.find(query).populate('subject', 'name _id');

    // Fetch the marks data for the student
    const marks = await Marks.find({
      student: student._id,
      examType: { $in: ['CIE-1', 'SURPRISE TEST-1', 'ASSIGNMENT-1'] }
    }).populate('subject', 'name _id');

    // Structure the marks data by subject with subjectId
    const structuredMarks = marks.map(mark => ({
      subjectId: mark.subject._id,
      subjectName: mark.subject.name,
      examType: mark.examType,
      marks: mark.marks,
      maxMarks: mark.maxMarks
    }));

    // Structure the attendance data by subject with subjectId
    const structuredAttendance = attendanceRecords.map(record => ({
      subjectId: record.subject._id,
      subjectName: record.subject.name,
      period: record.period,
      totalClasses: record.totalClasses,
      classesAttended: record.classesAttended,
      month: record.month,
      year: record.year
    }));

    // Combine both marks and attendance data in the response
    return res.status(200).json({
      studentId: student._id,
      studentName: student.name,
      rollNo: student.rollNo,
      year: student.currentYear,
      semester: student.currentSemester,
      section: student.section,
      marks: structuredMarks,
      attendance: structuredAttendance
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Get marks of all subjects of a student for PTM
exports.getStudentMarks = async (req, res) => {
  const { rollNo } = req.params;

  try {
    // Find the student by roll number
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch the student's marks for CIE-1, SurpriseTest-1, and Assignment-1
    const marks = await Marks.find({
      student: student._id,
      examType: { $in: ['CIE-1', 'SURPRISE TEST-1', 'ASSIGNMENT-1'] }
    }).populate('subject', 'name'); // Populating subject name

    if (!marks.length) {
      return res.status(404).json({ message: "No marks found for the specified exams." });
    }

    // Structure the result by subject and exam type
    const result = marks.reduce((acc, mark) => {
      const subjectName = mark.subject.name;
      if (!acc[subjectName]) {
        acc[subjectName] = {};
      }
      acc[subjectName][mark.examType] = {
        marks: mark.marks,
        maxMarks: mark.maxMarks
      };
      return acc;
    }, {});

    // Return the structured marks data
    return res.status(200).json({ 
      student: student.name,
      rollNo: student.rollNo,
      year: student.currentYear,
      semester: student.currentSemester,
      section: student.section,
      marks: result });

  } catch (error) {
    console.error("Error fetching student marks:", error);  // Log the error details
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get marks of all subjects for verification of a student for SEE
exports.getStudentAllMarks = async (req, res) => {
  const { rollNo } = req.params;

  try {
    // Find the student by roll number
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch the student's marks for all exams (AT-1, AT-2, AT-3, ST-1, ST-2, ST-3, CIE-1, CIE-2)
    const marks = await Marks.find({
      student: student._id,
      examType: { $in: ['ASSIGNMENT-1', 'ASSIGNMENT-2', 'ASSIGNMENT-3', 'SURPRISE TEST-1', 'SURPRISE TEST-2', 'SURPRISE TEST-3', 'CIE-1', 'CIE-2'] }
    }).populate('subject', 'name'); // Populating subject name

    if (!marks.length) {
      return res.status(404).json({ message: "No marks found for the specified exams." });
    }

    // Structure the result by subject and exam type
    const result = marks.reduce((acc, mark) => {
      const subjectName = mark.subject.name;
      if (!acc[subjectName]) {
        acc[subjectName] = {};
      }
      acc[subjectName][mark.examType] = {
        marks: mark.marks,
      };
      return acc;
    }, {});

    // Return the structured marks data
    return res.status(200).json({
      student: student.name,
      rollNo: student.rollNo,
      year: student.currentYear,
      semester: student.currentSemester,
      section: student.section,
      marks: result
    });

  } catch (error) {
    console.error("Error fetching student marks:", error);  // Log the error details
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};
