const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const Admin = require('../models/admin');

require('dotenv').config();

let adminToken;

beforeAll(async() => {
    await mongoose.connect(process.env.MONGO_URI);

    await Admin.deleteMany({ username: 'admin@btech.com' });

    const password = await bcrypt.hash('admin123', 10);
    await Admin.create({
        username: 'admin@btech.com',
        password
    });

    const res = await request(app)
        .post('/api/admin/login')
        .send({
            email: 'admin@btech.com',
            password: 'admin123'
        });

    adminToken = res.body.token;
});

afterAll(async() => {
    await mongoose.connection.close();
});

describe('Admin Routes', () => {

    it('blocks access without token', async() => {
        const res = await request(app).get('/api/admin/applicants');
        expect(res.statusCode).toBe(401);
    });

    it('blocks access with invalid token', async() => {
        const res = await request(app)
            .get('/api/admin/applicants')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(401);
    });

    it('allows admin to fetch applicants', async() => {
        const res = await request(app)
            .get('/api/admin/applicants')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
    });

});