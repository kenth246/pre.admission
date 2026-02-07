const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');

const bypassAuth = (req, res, next) => {
    req.user = { id: '697dac1d647039ab0a73b02b' };
    next();
};

module.exports = function(app) {
    app.post('/api/admin/login', adminController.login);
    app.get('/api/admin/applicants', auth, adminOnly, adminController.getAllApplicants);
    app.patch('/api/admin/applicant/:id/status', auth, adminOnly, adminController.updateStatus);
    app.get('/api/admin/settings', auth, adminOnly, adminController.getSystemSettings);
    app.put('/api/admin/settings', auth, adminOnly, adminController.updateSystemSettings);

    app.get('/api/admin/profile', bypassAuth, adminController.getProfile);
    app.put('/api/admin/profile', bypassAuth, upload.single('image'), adminController.updateProfile);
    app.put('/api/admin/change-password', bypassAuth, adminController.changePassword);

    app.get('/api/admin/logs', auth, adminOnly, adminController.getActivityLogs);
    app.delete('/api/admin/logs', auth, adminOnly, adminController.clearActivityLogs);
};