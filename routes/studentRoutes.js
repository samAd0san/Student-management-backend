const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Create a new attendance record
router.post('/attendance', studentController.createAttendance);

// Get attendance records for a specific student
router.get('/attendance/:rollNo', studentController.getAttendanceByStudent);

// Get attendance records by month, year, and period
router.get('/attendance/month/:month/year/:year/period/:period', studentController.getAttendanceByPeriodMonthYear);

// Update attendance record
router.put('/attendance/:id', studentController.updateAttendance);

// Delete attendance record
router.delete('/attendance/:id', studentController.deleteAttendance);

// Get attendance of a student for all subjects within a date range
// Example: http://localhost:3000/api/students/160921733078/attendance?startDate=01/09/2024&endDate=30/11/2024
router.get('/:rollNo/data', studentController.getStudentData);

// Get students by branch, year, semester, and section (filtered)
router.get('/filtered', studentController.getFilteredStudentsWithAttendance);

// Get all students
router.get('/', studentController.getAllStudents);

// Create a new student
router.post('/', studentController.createStudent);

// Get a single student by roll number
router.get('/:rollNo', studentController.getStudentByRollNo);

// Get marks of all tests for a student by rollNo
// http://localhost:3000/api/students/160921733078/marks
router.get('/:rollNo/marks', studentController.getStudentMarks);

// Update a student
router.put('/:rollNo', studentController.updateStudent);

// Delete a student
router.delete('/:rollNo', studentController.deleteStudent);

// Get marks of all subjects for verification of a student for SEE
// http://localhost:3000/api/students/getall/160921733078
router.get('/getall/:rollNo', studentController.getStudentAllMarks);

module.exports = router;