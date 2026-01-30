const { z } = require('zod');

exports.questionSchema = z.object({
    question: z.string().min(5),
    choices: z.array(z.string().min(1)).min(2),
    correct_answer: z.string().min(1),
    category: z.string().min(2)
});

exports.bulkQuestionSchema = z.object({
    questions: z.array(exports.questionSchema).min(1)
});