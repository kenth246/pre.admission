const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

require('dotenv').config();

beforeAll(async() => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async() => {
    await mongoose.connection.close();
});

describe('Exam Submission', () => {

    it('rejects exam without token', async() => {
        const res = await request(app)
            .post('/api/assessment/exam')
            .send({});

        expect(res.statusCode).toBe(401);
    });

});