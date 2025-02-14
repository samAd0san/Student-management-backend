const mongoose = require('mongoose');

const COPOAverageSchema = new mongoose.Schema({
    course: { type: String, required: true, unique: true },
    po1_avg: { type: Number, default: 0 },
    po2_avg: { type: Number, default: 0 },
    po3_avg: { type: Number, default: 0 },
    po4_avg: { type: Number, default: 0 },
    po5_avg: { type: Number, default: 0 },
    po6_avg: { type: Number, default: 0 },
    po7_avg: { type: Number, default: 0 },
    po8_avg: { type: Number, default: 0 },
    po9_avg: { type: Number, default: 0 },
    po10_avg: { type: Number, default: 0 },
    po11_avg: { type: Number, default: 0 },
    po12_avg: { type: Number, default: 0 }
});

module.exports = mongoose.model('COPOAverage', COPOAverageSchema);