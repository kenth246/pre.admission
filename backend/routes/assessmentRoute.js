const assessmentController = require('../controllers/assessmentController');
const auth = require('../middleware/auth');
const applicantOnly = require('../middleware/applicantOnly');

module.exports = function(app) {
    app.post('/api/assessment/exam', auth, applicantOnly, assessmentController.submitExam);
    app.post('/api/assessment/interview', auth, applicantOnly, assessmentController.saveInterview);
};