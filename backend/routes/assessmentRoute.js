const assessmentController = require('../controllers/assessmentController');
// const auth = require('../middleware/auth'); // DISABLED
// const applicantOnly = require('../middleware/applicantOnly'); // DISABLED

const bypassAuth = (req, res, next) => {
    req.user = {
        id: '697dac1d647039ab0a73b02b'
    };
    next();
};

module.exports = function(app) {
    // Removed 'applicantOnly' as well since we are faking the user
    app.post('/api/assessment/exam', bypassAuth, assessmentController.submitExam);
    app.post('/api/assessment/interview', bypassAuth, assessmentController.saveInterview);
};