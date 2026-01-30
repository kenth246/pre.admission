const applicantController = require('../controllers/applicantController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

module.exports = function(app) {
    app.post('/api/applicant/register', applicantController.register);
    app.post('/api/applicant/login', applicantController.login);
    app.get('/api/applicant/profile', auth, applicantController.getApplicantProfile);
    app.put('/api/applicant/profile', auth, applicantController.updateApplicantProfile);
    app.post('/api/applicant/upload', auth, upload.array('requirements', 5), applicantController.uploadDocuments);
};