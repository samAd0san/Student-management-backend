const mongoose = require('mongoose');

const CourseOutcomeSchema = new mongoose.Schema({
    course: { type: String, required: true },
    coNo: { type: String, required: true },
    courseOutcome: { type: String, required: true },
    knowledgeLevel: { type: String, required: true }
});

module.exports = mongoose.model('CourseOutcome', CourseOutcomeSchema);