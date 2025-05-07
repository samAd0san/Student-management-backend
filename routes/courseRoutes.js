const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/CourseController');
const { tokenAuth, adminAuth } = require("../middlewares/auth");

/** CO Routes */
router.post('/course-outcomes', CourseController.createCO);
router.get('/course-outcomes/:subjectId', CourseController.getCOsBySubjectId);
router.patch('/course-outcomes/:coId', tokenAuth, adminAuth, CourseController.updateCOById);
router.delete('/course-outcome/:coId', CourseController.deleteCOById);
router.delete('/course-outcomes/:subjectId', CourseController.deleteAllCOsBySubjectId);

/** COPO Routes */
router.post('/copo-matrix', CourseController.createCOPO);
router.get('/copo-matrix/:subjectId', CourseController.getCOPOsbySubject);
router.patch('/copo-matrix/:copoId', tokenAuth, adminAuth, CourseController.updateCOPOById);
router.delete('/copo-matrix/:copoId', CourseController.deleteCOPOById);
router.delete('/copo-matrices/:subjectId', CourseController.deleteAllCOPOBySubjectId);

/** COPO Average Routes */
router.post('/copo-average/:subjectId', CourseController.saveCOPOAverage);
router.get('/copo-average/:subjectId', CourseController.getCOPOAverage);
router.delete('/copo-average/:subjectId', CourseController.deleteCOPOAverageBySubject);

module.exports = router;