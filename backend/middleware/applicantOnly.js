module.exports = function(req, res, next) {
    if (!req.user || req.user.role !== 'applicant') {
        return res.status(403).json({ msg: 'Applicant access only' });
    }
    next();
};