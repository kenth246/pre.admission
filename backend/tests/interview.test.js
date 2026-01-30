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

describe('Interview Submission', () => {

    it('rejects interview without token', async() => {
        const res = await request(app)
            .post('/api/assessment/interview')
            .send({});

        expect(res.statusCode).toBe(401);
    });

});