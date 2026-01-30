const { z } = require('zod');

exports.registerSchema = z.object({
    username: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6),
    address: z.any().optional()
});

exports.loginSchema = z.object({
    username: z.string(),
    password: z.string()
});