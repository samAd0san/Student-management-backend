const CourseOutcome = require('../models/CourseOutcomeModel');

// Create a new Course Outcome
exports.createCourseOutcome = async (req, res) => {
    try {
        const { course, coNo, courseOutcome, knowledgeLevel } = req.body;
        const newCourseOutcome = new CourseOutcome({ course, coNo, courseOutcome, knowledgeLevel });
        await newCourseOutcome.save();
        res.status(201).json(newCourseOutcome);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course outcome', error });
    }
};

// Get all Course Outcomes for a specific course
exports.getCourseOutcomes = async (req, res) => {
    try {
        const courseOutcomes = await CourseOutcome.find({ course: req.params.course });
        res.json(courseOutcomes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course outcomes', error });
    }
};


/** Course Outcome and Project Outcome Mapping  */
const COPOMatrix = require('../models/COPOMatrixModel');

// Create a new CO-PO Matrix entry
exports.createCOPOMatrix = async (req, res) => {
    try {
        const { course, courseOutcome, po1, po2, po3, po4, po5, po6, po7, po8, po9, po10, po11, po12 } = req.body;

        // Creating a new CO-PO matrix entry with the course field
        const newCOPOMatrix = new COPOMatrix({
            course, 
            courseOutcome, 
            po1, po2, po3, po4, po5, po6, po7, po8, po9, po10, po11, po12
        });

        // Saving the new entry to the database
        await newCOPOMatrix.save();
        
        // Sending the response back with the created CO-PO matrix entry
        res.status(201).json(newCOPOMatrix);
    } catch (error) {
        res.status(500).json({ message: 'Error creating CO-PO Matrix', error });
    }
};


// Get CO-PO Matrix entries for a specific course
exports.getCOPOMatrix = async (req, res) => {
    try {
        const { course } = req.params; // Get course from params
        const coPoMatrix = await COPOMatrix.find({ course: course }); // Fetch by course
        res.json(coPoMatrix);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching CO-PO Matrix', error });
    }
};