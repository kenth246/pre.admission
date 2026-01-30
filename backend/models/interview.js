const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true,
        unique: true
    },
    responses: [{
        question: String,
        answer: String
    }],

    score: { type: Number, default: 0 },
    remarks: { type: String, default: "" },
    status: { type: String, default: "Pending" }
}, { timestamps: true });

InterviewSchema.index({ applicant: 1 }, { unique: true });

module.exports = mongoose.model('Interview', InterviewSchema);