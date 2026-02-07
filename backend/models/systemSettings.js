const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
    systemName: { type: String, default: "BTECH - IITI Pre-Admission System" },
    schoolName: { type: String, default: "Baliwag Polytechnic College (BTECH)" },
    instituteName: { type: String, default: "Institute of Information Technology and Innovation" },
    admissionOpen: { type: Boolean, default: true },
    academicYear: { type: String, default: "2025-2026" },
    applicationDeadline: { type: String }, // Stores date string YYYY-MM-DD
    security: {
        twoFactorAuth: { type: Boolean, default: false }
    },
    notifications: {
        emailNewApp: { type: Boolean, default: true },
        emailAssessment: { type: Boolean, default: false },
        emailInterview: { type: Boolean, default: true },
        sysDeadline: { type: Boolean, default: true },
        sysMaintenance: { type: Boolean, default: true },
        autoReply: { type: Boolean, default: true }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);