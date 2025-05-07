const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { tokenAuth, adminAuth } = require("../middlewares/auth");

// Create a new subject
router.post('/', subjectController.createSubject);

// Get all subjects
router.get('/', subjectController.getAllSubjects);

// Get subjects by branch, year, and semester
router.get('/branch/:branch/year/:year/semester/:semester', subjectController.getSubjectsByBranchYearSemester);

// Get subjects by branch, year, and semester, and regulation
router.get('/branch/:branch/year/:year/semester/:semester/regulation/:regulation', subjectController.getSubjectsByBranchYearSemesterRegulation);

// Get a single subject by ID
router.get('/:id', subjectController.getSubjectById);

// Update a subject
router.put('/:id', tokenAuth, adminAuth, subjectController.updateSubject);

// Delete a subject
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;