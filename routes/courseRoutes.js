const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/CourseController');

// Create a new Course Outcome
router.post('/createCourseOutcome', CourseController.createCourseOutcome);
// Get all Course Outcomes for a specific course
router.get('/getCourseOutcomes/:course', CourseController.getCourseOutcomes);
// Update a Course Outcome partially
router.patch('/updateCourseOutcome/:id', CourseController.updateCourseOutcome);
// Delete a Course Outcome by ID
router.delete('/deleteCourseOutcomeById/:id', CourseController.deleteCourseOutcome);
// Delete all Course Outcomes for a specific course
router.delete('/deleteCourseOutcomesBySubject/:subject', CourseController.deleteCourseOutcomesBySubject);
// Delete all Course Outcomes
router.delete('/deleteCourseOutcome', CourseController.deleteAllCourseOutcomes);



// Create a new CO-PO Matrix entry
router.post('/createCOPOMatrix', CourseController.createCOPOMatrix);
// Get all CO-PO Matrix entries for a specific course outcome
router.get('/getCOPOMatrix/:course', CourseController.getCOPOMatrix);
// Update a CO-PO Matrix entry partially
router.patch('/updateCOPOMatrix/:id', CourseController.updateCOPOMatrix);
// Delete a CO-PO Matrix entry by ID
router.delete('/deleteCOPOMatrixById/:id', CourseController.deleteCOPOMatrixById);
// Delete all CO-PO Matrix entries for a specific course outcome
router.delete('/deleteCOPOMatrixBySubject/:subject', CourseController.deleteCOPOMatrixBySubject);



module.exports = router;