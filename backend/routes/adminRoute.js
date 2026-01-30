const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

module.exports = function(app) {
    app.post('/api/admin/login', adminController.login);
    app.get('/api/admin/applicants', auth, adminOnly, adminController.getAllApplicants);
    app.patch('/api/admin/applicant/:id/status', auth, adminOnly, adminController.updateStatus);
};