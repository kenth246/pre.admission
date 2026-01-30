const { z } = require('zod');

exports.examSchema = z.object({
    answers: z.array(
        z.object({
            question_id: z.string(),
            selected_choice: z.string()
        })
    ).min(1)
});

exports.interviewSchema = z.object({
    responses: z.array(z.string()).min(1)
});