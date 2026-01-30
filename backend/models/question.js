const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: { type: String, required: true },
    question: { type: String, required: true },
    choices: { type: [String], required: true },
    correct_answer: { type: String, required: true }
});

QuestionSchema.index({ category: 1 });

module.exports = mongoose.model('Question', QuestionSchema);