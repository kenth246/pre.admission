const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true,
        unique: true
    },
    answers: [{
        question_id: { type: String },
        selected_choice: { type: String }
    }],
    score: { type: Number, default: 0 },
    total_questions: { type: Number },
    date_taken: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);