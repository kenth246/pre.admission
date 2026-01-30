const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    actorRole: {
        type: String,
        enum: ['admin', 'applicant'],
        required: true
    },
    action: {
        type: String,
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    from: String,
    to: String
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);