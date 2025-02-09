const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/CourseController');

// Create a new Course Outcome
router.post('/createCourseOutcome', CourseController.createCourseOutcome);
// Get all Course Outcomes for a specific course
router.get('/getCourseOutcomes/:course', CourseController.getCourseOutcomes);
// Update a Course Outcome partially
router.patch('/updateCourseOutcome/:id', CourseController.updateCourseOutcome);


// Create a new CO-PO Matrix entry
router.post('/createCOPOMatrix', CourseController.createCOPOMatrix);
// Get all CO-PO Matrix entries for a specific course outcome
router.get('/getCOPOMatrix/:course', CourseController.getCOPOMatrix);

module.exports = router;