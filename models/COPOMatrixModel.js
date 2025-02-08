const mongoose = require('mongoose');

const COPOMatrixSchema = new mongoose.Schema({
    course: { type: String, required: true }, // You can filter by this field
    courseOutcome: { type: String, required: true },
    po1: { type: Number, default: 0 },
    po2: { type: Number, default: 0 },
    po3: { type: Number, default: 0 },
    po4: { type: Number, default: 0 },
    po5: { type: Number, default: 0 },
    po6: { type: Number, default: 0 },
    po7: { type: Number, default: 0 },
    po8: { type: Number, default: 0 },
    po9: { type: Number, default: 0 },
    po10: { type: Number, default: 0 },
    po11: { type: Number, default: 0 },
    po12: { type: Number, default: 0 }
});

module.exports = mongoose.model('COPOMatrix', COPOMatrixSchema);
