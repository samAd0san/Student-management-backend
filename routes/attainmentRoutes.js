const express = require("express");
const router = express.Router();
const attainmentController = require("../controllers/attainmentController");

// CRUD operations for Attainment
router.post("/", attainmentController.createAttainment);
router.get("/", attainmentController.getAllAttainments);
router.put("/:id", attainmentController.updateAttainment);
router.delete("/:id", attainmentController.deleteAttainment);

// Get attainment by subjectId and examType
router.get(
  "/subject/:subjectId/examType/:examType",
  attainmentController.getAttainmentsBySubjectAndExamType
);

// Get attainment by subjectId and attainmentType
router.get(
  "/subject/:subjectId/attainmentType/:attainmentType",
  attainmentController.getAttainmentsBySubjectAndAttainmentType
);

// Update attainment by subjectId and examType
router.put(
  "/subject/:subjectId/examType/:examType",
  attainmentController.updateAttainmentsBySubjectAndExamType
);

module.exports = router;
