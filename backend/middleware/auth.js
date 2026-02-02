const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // TEMPORARY DEV BYPASS
    req.user = { id: "000000000000000000000000" };
    next();
};