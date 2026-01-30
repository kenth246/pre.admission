const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const Applicant = require('../models/applicant');

require('dotenv').config();

beforeAll(async() => {
    await mongoose.connect(process.env.MONGO_URI);

    await Applicant.deleteMany({ username: 'testuser' });

    const password = await bcrypt.hash('testpass', 10);
    await Applicant.create({
        username: 'testuser',
        email: 'testuser@test.com',
        password
    });
});

afterAll(async() => {
    await mongoose.connection.close();
});

describe('Applicant Authentication', () => {

    it('rejects invalid login', async() => {
        const res = await request(app)
            .post('/api/applicant/login')
            .send({ username: 'wrong', password: 'wrong' });

        expect(res.statusCode).toBe(400);
    });

    it('allows valid login', async() => {
        const res = await request(app)
            .post('/api/applicant/login')
            .send({ username: 'testuser', password: 'testpass' });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

});