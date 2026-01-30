const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true,
        unique: true
    },
    answers: [{
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selected_choice: { type: String }
    }],
    score: { type: Number, default: 0 },
    total_questions: { type: Number },
    date_taken: { type: Date, default: Date.now }
});

ExamSchema.index({ applicant: 1 }, { unique: true });

module.exports = mongoose.model('Exam', ExamSchema);