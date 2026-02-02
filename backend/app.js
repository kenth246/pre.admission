const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const Applicant = require('./models/applicant');

app.get('/api/debug/create', async(req, res) => {
    try {
        const user = await Applicant.create({
            username: 'debug_user_' + Date.now(),
            email: `debug_${Date.now()}@test.com`,
            password: 'password123'
        });
        res.send(`<h1>SUCCESS!</h1><p>Copy this ID into applicantRoute.js:</p><h2>${user._id}</h2>`);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});
require('./routes/applicantRoute')(app);
require('./routes/adminRoute')(app);
require('./routes/assessmentRoute')(app);
require('./routes/questionRoute')(app);

app.get('/', (req, res) => res.send('Admission System API is running...'));

mongoose.connect(process.env.MONGO_URI)
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

module.exports = app;