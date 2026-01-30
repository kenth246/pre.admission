const cron = require('node-cron');
const Applicant = require('../models/applicant');

cron.schedule('0 0 * * 0', async() => {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    try {
        const result = await Applicant.deleteMany({
            "status.admission_status": "Pending",
            updatedAt: { $lt: sixtyDaysAgo }
        });
        console.log(`Cleaned up ${result.deletedCount} stale records.`);
    } catch (err) {
        console.error('Cleanup Error:', err);
    }
});