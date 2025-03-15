const CourseOutcome = require('../models/courseOutcomeModel');
const Subject = require('../models/subjectModel');

/** CO APIs */
exports.createCO= async (req, res) => {
  try {
    const { subjectId, coNo, courseOutcome, knowledgeLevel } = req.body;

    // Check if the subject exists
    const subjectExists = await Subject.findById(subjectId);
    if (!subjectExists) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Create and save new Course Outcome
    const newCourseOutcome = new CourseOutcome({
      subject: subjectId,
      coNo,
      courseOutcome,
      knowledgeLevel,
    });

    await newCourseOutcome.save();
    res.status(201).json(newCourseOutcome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCOsBySubjectId = async (req, res) => {
    try {
      const { subjectId } = req.params;
  
      // Check if the subject exists
      const subjectExists = await Subject.findById(subjectId);
      if (!subjectExists) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Find all Course Outcomes for the given subjectId
      const courseOutcomes = await CourseOutcome.find({ subject: subjectId });
  
      if (courseOutcomes.length === 0) {
        return res.status(404).json({ message: 'No Course Outcomes found for this subject' });
      }
  
      res.status(200).json(courseOutcomes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
exports.updateCOById = async (req, res) => {
    try {
      const { coId } = req.params;
  
      // Find and update Course Outcome
      const updatedCO = await CourseOutcome.findByIdAndUpdate(coId, req.body, { new: true });
  
      if (!updatedCO) {
        return res.status(404).json({ message: 'Course Outcome not found' });
      }
  
      res.status(200).json(updatedCO);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.deleteCOById = async (req, res) => {
    try {
      const { coId } = req.params;
  
      // Find and delete the Course Outcome
      const deletedCO = await CourseOutcome.findByIdAndDelete(coId);
  
      if (!deletedCO) {
        return res.status(404).json({ message: 'Course Outcome not found' });
      }
  
      res.status(200).json({ message: 'Course Outcome deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
exports.deleteAllCOsBySubjectId = async (req, res) => {
    try {
      const { subjectId } = req.params;
  
      // Check if the subject exists
      const subjectExists = await Subject.findById(subjectId);
      if (!subjectExists) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Delete all Course Outcomes for the given subjectId
      const deletedResult = await CourseOutcome.deleteMany({ subject: subjectId });
  
      if (deletedResult.deletedCount === 0) {
        return res.status(404).json({ message: 'No Course Outcomes found for this subject' });
      }
  
      res.status(200).json({ message: `Deleted ${deletedResult.deletedCount} Course Outcomes successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
/** COPO APIs */
const COPOMatrix = require('../models/COPOMatrixModel');

exports.createCOPO = async (req, res) => {
    try {
        const { subjectId, coId, po1, po2, po3, po4, po5, po6, po7, po8, po9, po10, po11, po12, pso1, pso2 } = req.body;

        // Validate Subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Validate Course Outcome
        const courseOutcome = await CourseOutcome.findById(coId);
        if (!courseOutcome) {
            return res.status(404).json({ message: "Course Outcome not found" });
        }

        // Create a new COPO Matrix entry
        const copoMatrix = new COPOMatrix({
            subject: subjectId,
            courseOutcome: coId,
            po1, po2, po3, po4, po5, po6, po7, po8, po9, po10, po11, po12, pso1, pso2
        });

        await copoMatrix.save();

        // Populate Subject and CourseOutcome in response
        const populatedCOPOMatrix = await COPOMatrix.findById(copoMatrix._id)
            .populate("subject", "name")
            .populate("courseOutcome", "courseOutcome");

        res.status(201).json(populatedCOPOMatrix);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCOPOsbySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Validate Subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Fetch all COPO entries for the given subject
        /**
         * populate replaces referenced ObjectIds with actual document data from the related
         *  collection, allowing you to retrieve specific fields instead of just the ID.
         */
        const copoEntries = await COPOMatrix.find({ subject: subjectId })
            .populate("subject", "name")
            .populate("courseOutcome", "courseOutcome");

        res.status(200).json(copoEntries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCOPOById = async (req, res) => {
    try {
        const { copoId } = req.params;
        const updateData = req.body;

        const updatedCOPOMatrix = await COPOMatrix.findByIdAndUpdate(copoId, updateData, { new: true })
            .populate("subject", "name")
            .populate("courseOutcome", "courseOutcome");

        if (!updatedCOPOMatrix) {
            return res.status(404).json({ message: "COPO entry not found" });
        }

        res.status(200).json(updatedCOPOMatrix);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCOPOById = async (req, res) => {
    try {
        const { copoId } = req.params;

        const deletedCOPOMatrix = await COPOMatrix.findByIdAndDelete(copoId);

        if (!deletedCOPOMatrix) {
            return res.status(404).json({ message: "COPO entry not found" });
        }

        res.status(200).json({ message: "COPO entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAllCOPOBySubjectId = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Validate if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Delete all COPO entries related to the given subject ID
        const result = await COPOMatrix.deleteMany({ subject: subjectId });

        res.status(200).json({ message: `Deleted ${result.deletedCount} COPO entries for the subject.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**COPO Average APIs */
const COPOAverage = require('../models/COPOAverageModel');

exports.saveCOPOAverage = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Validate if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Fetch all COPO entries for the given subject
        const copoEntries = await COPOMatrix.find({ subject: subjectId });

        if (copoEntries.length === 0) {
            return res.status(404).json({ message: "No COPO entries found for this subject" });
        }

        // Initialize sum object
        const sumValues = {
            po1_avg: 0, po2_avg: 0, po3_avg: 0, po4_avg: 0, po5_avg: 0,
            po6_avg: 0, po7_avg: 0, po8_avg: 0, po9_avg: 0, po10_avg: 0,
            po11_avg: 0, po12_avg: 0, pso1_avg: 0, pso2_avg: 0
        };

        // Sum up all PO/PSO values
        copoEntries.forEach(entry => {
            for (let key in sumValues) {
                const field = key.replace('_avg', ''); // Remove "_avg" to match COPOMatrix keys
                if (entry[field] !== undefined && entry[field] !== null) {
                    sumValues[key] += Number(entry[field]) || 0; // Ensure it's a number
                }
            }
        });

        // Compute averages
        const avgValues = {};
        for (let key in sumValues) {
            avgValues[key] = parseFloat((sumValues[key] / copoEntries.length).toFixed(2)); // Compute correct average
        }

        // Save or Update COPOAverage entry with subject reference
        const updatedAverage = await COPOAverage.findOneAndUpdate(
            { subject: subjectId },
            { subject: subjectId, ...avgValues },
            { upsert: true, new: true }
        ).populate("subject", "name"); // Populate subject details

        res.status(200).json(updatedAverage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCOPOAverage = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const copoAverage = await COPOAverage.findOne({ subject: subjectId }).populate("subject", "name");

        if (!copoAverage) {
            return res.status(404).json({ message: "No COPO average found for this subject" });
        }

        res.status(200).json(copoAverage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCOPOAverageBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        // Validate Subject
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Delete COPO Average entry
        const deleted = await COPOAverage.findOneAndDelete({ subject: subjectId });

        if (!deleted) {
            return res.status(404).json({ message: "No COPO Average found for this subject" });
        }

        res.status(200).json({ message: "COPO Average deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
