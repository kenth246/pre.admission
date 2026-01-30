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

require('./routes/applicantRoute')(app);
require('./routes/adminRoute')(app);
require('./routes/assessmentRoute')(app);
require('./routes/questionRoute')(app);

app.get('/', (req, res) => res.send('Admission System API is running...'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

module.exports = app;