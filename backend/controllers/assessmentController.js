const mongoose = require('mongoose');
const Exam = require('../models/exam');
const Question = require('../models/question');
const Interview = require('../models/interview');
const {
    examSchema,
    interviewSchema
} = require('../validators/assessment.schema');

exports.submitExam = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        examSchema.parse(req.body);

        const applicantId = req.user.id;
        const { answers } = req.body;

        const existingExam = await Exam.findOne({ applicant: applicantId });
        if (existingExam) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({ message: "Exam already submitted" });
        }

        const questionIds = answers.map(a => a.question_id);
        const questions = await Question.find({ _id: { $in: questionIds } });

        const answerMap = new Map(questions.map(q => [q._id.toString(), q.correct_answer]));

        let score = 0;
        for (let attempt of answers) {
            if (answerMap.get(attempt.question_id) === attempt.selected_choice) {
                score++;
            }
        }

        const exam = await Exam.create([{ applicant: applicantId, score, total_questions: answers.length, answers }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: "BCeT Result Saved", score, data: exam[0] });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(500).send('Server Error');
    }
};

exports.saveInterview = async(req, res) => {
    try {
        interviewSchema.parse(req.body);

        const applicantId = req.user.id;
        const { responses } = req.body;

        const existingInterview = await Interview.findOne({ applicant: applicantId });
        if (existingInterview) {
            return res.status(409).json({ message: "Interview already submitted" });
        }

        const formattedResponses = responses.map((ans, index) => ({ question: `Question ${index + 1}`, answer: ans }));

        await Interview.create({ applicant: applicantId, responses: formattedResponses, status: "Pending" });

        res.json({ msg: "Interview saved" });
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(500).send('Server Error');
    }
};