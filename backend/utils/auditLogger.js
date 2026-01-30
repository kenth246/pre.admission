const AuditLog = require('../models/auditLog');

exports.logAudit = async({
    actorId,
    actorRole,
    action,
    targetId,
    from,
    to
}) => {
    try {
        await AuditLog.create({
            actorId,
            actorRole,
            action,
            targetId,
            from,
            to
        });
    } catch (err) {
        // logging must NEVER break core logic
        console.error('Audit log failed:', err.message);
    }
};