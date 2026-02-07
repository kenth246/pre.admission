const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const pdfController = require('./controllers/pdfController'); // <--- 1. ADD THIS IMPORT

dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const Applicant = require('./models/applicant');

// --- NEW PDF ROUTE ---
// This handles the link sent in the email (e.g., /api/admission-slip/65b...)
app.get('/api/admission-slip/:id', pdfController.generateAdmissionSlip); // <--- 2. ADD THIS ROUTE

// Debug Route
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

// Route Imports
require('./routes/applicantRoute')(app);
require('./routes/adminRoute')(app);
require('./routes/assessmentRoute')(app);
require('./routes/questionRoute')(app);
require('./routes/notificationRoute')(app);

app.get('/', (req, res) => res.send('Admission System API is running...'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

module.exports = app;