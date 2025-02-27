const express = require("express");
const router = express.Router();
const {
  addMarks,
  getMarks,
  getMarksByClassAndExam,
  updateMarks,
  getAvgOfBestTwoSurpriseAndAssignment,
  getAttainmentData
} = require("../controllers/marksController");

// Add/Update Marks
router.post("/", addMarks);

// Update Marks (PUT)
router.put("/:subject_id/:examType/:id", updateMarks); // Use id to identify the marks entry

// Get Marks for a Subject and Exam Type
router.get("/:subject_id/:examType", getMarks);

// Get Surprise test-1,2,3 AND assignment-1,2,3 marks Avg of best of 2 tests for a Subject
// http://localhost:3000/api/marks/getAvgOfBestTwo/subject/670e17ac56900e5e6a8cb396
router.get("/getAvgOfBestTwo/subject/:subject_id", getAvgOfBestTwoSurpriseAndAssignment);

// Get merged ST/AT and total internal marks by subject and exam type
// http://localhost:3000/api/marks/attainment/670e17ac56900e5e6a8cb396/CIE-1
router.get("/attainment/:subject_id/:examType", getAttainmentData);

// Get Marks by Year, Semester, Section, and Exam Type
router.get("/:year/:semester/:section/:examType", getMarksByClassAndExam);

module.exports = router;