const Question = require('../models/question');
const {
    questionSchema,
    bulkQuestionSchema
} = require('../validators/question.schema');

exports.addQuestion = async(req, res) => {
    try {
        questionSchema.parse(req.body);

        const question = await Question.create(req.body);

        res.status(201).json({ success: true, data: question });
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors.map(e => e.message) });
        }
        res.status(400).json({ error: err.message });
    }
};

exports.getByCategory = async(req, res) => {
    try {
        const questions = await Question.find({ category: req.params.category });

        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.bulkUpload = async(req, res) => {
    try {
        bulkQuestionSchema.parse(req.body);

        const inserted = await Question.insertMany(req.body.questions);

        res.status(201).json({ success: true, count: inserted.length });
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors.map(e => e.message) });
        }
        res.status(400).json({ error: err.message });
    }
};

exports.updateQuestion = async(req, res) => {
    try {
        questionSchema.partial().parse(req.body);

        const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ success: true, data: updated });
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors.map(e => e.message) });
        }
        res.status(400).json({ error: err.message });
    }
};

exports.deleteQuestion = async(req, res) => {
    try {
        const deleted = await Question.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ success: true, message: 'Question removed' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};