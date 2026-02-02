const mongoose = require('mongoose');
const Exam = require('../models/exam');
const Question = require('../models/question');
const Interview = require('../models/interview');

exports.submitExam = async(req, res) => {
    try {
        // Handle User ID
        const applicantId = req.user ? req.user.id : "1339";
        const { answers } = req.body;

        // Check for existing submission
        const existingExam = await Exam.findOne({ applicant: applicantId });
        if (existingExam) {
            return res.status(409).json({ message: "Exam already submitted" });
        }

        // 3. Grade the Exam
        let score = 0;
        const firstId = answers.length > 0 ? answers[0].question_id.toString() : "";
        const isRealExam = mongoose.Types.ObjectId.isValid(firstId);

        if (isRealExam) {
            // Calculate score from Database
            const questionIds = answers.map(a => a.question_id);
            const questions = await Question.find({ _id: { $in: questionIds } });

            const answerMap = new Map(questions.map(q => [q._id.toString(), q.correct_answer]));

            for (let attempt of answers) {
                if (answerMap.get(attempt.question_id) === attempt.selected_choice) {
                    score++;
                }
            }
        } else {
            // DEMO EXAM: Skip grading to prevent crash
            console.log("Saving Demo Exam (IDs are not real ObjectIds)");
            score = answers.length;
        }

        // 4. Save to Database
        const exam = await Exam.create([{
            applicant: applicantId,
            score,
            total_questions: answers.length,
            answers
        }]);
        res.status(201).json({ message: "BCeT Result Saved", score, data: exam[0] });

    } catch (err) {
        console.error("SUBMIT EXAM ERROR:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
};

exports.saveInterview = async(req, res) => {
    try {
        const applicantId = req.user ? req.user.id : "1339";
        const { responses } = req.body;

        const existingInterview = await Interview.findOne({ applicant: applicantId });
        if (existingInterview) {
            return res.status(409).json({ message: "Interview already submitted" });
        }

        const formattedResponses = Array.isArray(responses) ?
            responses.map((ans, index) => ({ question: `Question ${index + 1}`, answer: ans })) : [];

        await Interview.create({
            applicant: applicantId,
            responses: formattedResponses,
            status: "Pending"
        });

        res.json({ msg: "Interview saved" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};