const express = require("express");
const router = express.Router();
const attainmentController = require("../controllers/attainmentController");

// CRUD operations for Attainment
router.post("/", attainmentController.createAttainment);
router.get("/", attainmentController.getAllAttainments);
router.put("/:id", attainmentController.updateAttainment);
router.delete("/:id", attainmentController.deleteAttainment);

// Get attainment by subjectId and examType
router.get('/subject/:id/examType/:examType', attainmentController.getAttainmentsBySubjectAndExamType);

module.exports = router;
