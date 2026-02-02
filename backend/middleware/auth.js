const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // TEMPORARY DEV BYPASS
    req.user = {
        id: "000000000000000000000000",
        role: "admin"
    };

    console.log("BYPASS AUTH: Admin access granted.");
    next();
};