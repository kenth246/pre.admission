const assessmentController = require('../controllers/assessmentController');
// const auth = require('../middleware/auth');
// const applicantOnly = require('../middleware/applicantOnly');
const bypassAuth = (req, res, next) => {
    req.user = { id: '697dac1d647039ab0a73b02b' };
    next();
};
module.exports = function(app) {
    app.post('/api/assessment/exam', bypassAuth, assessmentController.submitExam);
    app.post('/api/assessment/interview', bypassAuth, assessmentController.saveInterview);
};