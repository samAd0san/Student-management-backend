const FeedbackAttainment = require("../models/feedbackAttainmentModel");

// Create a new feedback attainment
exports.createFeedbackAttainment = async (req, res) => {
  try {
    const feedbackAttainment = new FeedbackAttainment(req.body);
    const savedFeedbackAttainment = await feedbackAttainment.save();
    res.status(201).json(savedFeedbackAttainment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all feedback attainments
exports.getAllFeedbackAttainments = async (req, res) => {
  try {
    const feedbackAttainments = await FeedbackAttainment.find()
      .populate("student", "name")
      .populate("subject", "name");
    res.status(200).json(feedbackAttainments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single feedback attainment by ID
exports.getFeedbackAttainmentById = async (req, res) => {
  try {
    const feedbackAttainment = await FeedbackAttainment.findById(req.params.id)
      .populate("student", "name")
      .populate("subject", "name");
    if (!feedbackAttainment) {
      return res.status(404).json({ error: "Feedback attainment not found" });
    }
    res.status(200).json(feedbackAttainment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a feedback attainment by ID
exports.updateFeedbackAttainment = async (req, res) => {
  try {
    const updatedFeedbackAttainment =
      await FeedbackAttainment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    if (!updatedFeedbackAttainment) {
      return res.status(404).json({ error: "Feedback attainment not found" });
    }
    res.status(200).json(updatedFeedbackAttainment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a feedback attainment by ID
exports.deleteFeedbackAttainment = async (req, res) => {
  try {
    const deletedFeedbackAttainment =
      await FeedbackAttainment.findByIdAndDelete(req.params.id);
    if (!deletedFeedbackAttainment) {
      return res.status(404).json({ error: "Feedback attainment not found" });
    }
    res
      .status(200)
      .json({ message: "Feedback attainment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
