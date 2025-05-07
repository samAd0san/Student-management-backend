const express = require("express");
const router = express.Router();
const internalMarksController = require("../controllers/internalMarksController");
const { tokenAuth, adminAuth } = require("../middlewares/auth");

// Create a new internal marks entry (POST) or get all internal marks entries (GET)
router.route("/")
  .get(internalMarksController.getAllInternalMarks)  // Handle GET request
  .post(internalMarksController.createInternalMarks);  // Handle POST request

// Get internal marks by subject and exam type
router.get("/:subject_id/:examType", internalMarksController.getInternalMarksBySubjectExamType);

// Get total internal marks by subject and exam type
router.get("/totals/:subject_id/:examType", internalMarksController.getQuestionTotals)

// Get internal marks by year, semester, section, and exam type
router.get("/:year/:semester/:section/:examType", internalMarksController.getInternalMarksByYearSemesterSectionExam);

// Update internal marks by subject, exam type, and id
router.put("/:subject_id/:examType/:id", tokenAuth, adminAuth, internalMarksController.updateInternalMarksBySubjectExamType);

// Delete internal marks by subject, exam type, and id
router.delete("/:subject_id/:examType/:id", internalMarksController.deleteInternalMarksBySubjectExamType);

module.exports = router;
