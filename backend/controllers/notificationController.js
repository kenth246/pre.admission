const Notification = require('../models/notification');

// --- API FUNCTIONS FOR FRONTEND ---

// 1. Get All Notifications (Sorted by newest)
exports.getNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);

        // Format relative time (e.g., "2m ago")
        const formatted = notifications.map(n => ({
            id: n._id,
            title: n.title,
            message: n.message,
            type: n.type,
            isUnread: n.isUnread,
            time: timeAgo(n.createdAt)
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// 2. Mark Single as Read
exports.markAsRead = async(req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isUnread: false });
        res.json({ msg: "Marked as read" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 3. Mark All as Read
exports.markAllAsRead = async(req, res) => {
    try {
        await Notification.updateMany({ isUnread: true }, { isUnread: false });
        res.json({ msg: "All marked as read" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- HELPER FUNCTION (Use this in other controllers) ---
exports.createNotification = async(title, message, type = 'info') => {
    try {
        await Notification.create({ title, message, type });
        console.log(`🔔 Notification Created: ${title}`);
    } catch (err) {
        console.error("Failed to create notification:", err);
    }
};

// Helper for "Time Ago" string
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
}