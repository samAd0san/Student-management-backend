const express = require("express");
const feedbackAttainmentController = require("../controllers/feedbackAttainmentController");
const { tokenAuth, adminAuth } = require("../middlewares/auth");

const router = express.Router();

// Create a new feedback attainment
router.post("/", feedbackAttainmentController.createFeedbackAttainment);

// Get all feedback attainments
router.get("/", feedbackAttainmentController.getAllFeedbackAttainments);

// Get a single feedback attainment by ID
router.get("/:id", feedbackAttainmentController.getFeedbackAttainmentById);

// Get feedback attainments by subject ID
router.get(
  "/subject/:id",
  feedbackAttainmentController.getFeedbackAttainmentsBySubjectId
);

// Update a feedback attainment by ID
router.put("/:id", feedbackAttainmentController.updateFeedbackAttainment);

// Delete a feedback attainment by ID
router.delete("/:id", feedbackAttainmentController.deleteFeedbackAttainment);

module.exports = router;
