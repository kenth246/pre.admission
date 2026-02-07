const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

module.exports = function(app) {
    app.get('/api/notifications', auth, adminOnly, notificationController.getNotifications);
    app.put('/api/notifications/:id/read', auth, adminOnly, notificationController.markAsRead);
    app.put('/api/notifications/read-all', auth, adminOnly, notificationController.markAllAsRead);
};