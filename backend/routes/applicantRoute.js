const applicantController = require("../controllers/applicantController");
const upload = require("../middleware/upload");

// --- AUTH BYPASS ---
const bypassAuth = (req, res, next) => {
    // PASTE KENTH'S ID HERE (replace the string below)
    req.user = { id: "PASTE_THE_REAL_ID_OF_KENTH_HERE" };
    next();
};

module.exports = (app) => {
    app.post("/api/applicant/register", applicantController.register);
    app.post("/api/applicant/login", applicantController.login);

    // --- NEW MISSING ROUTE ---
    app.post("/api/applicant/type", bypassAuth, applicantController.setApplicantType);

    app.get("/api/applicant/profile", bypassAuth, applicantController.getProfile);

    app.put(
        "/api/applicant/profile",
        bypassAuth,
        upload.single("photo"),
        applicantController.updateProfile
    );

    app.post(
        "/api/applicant/requirements",
        bypassAuth,
        upload.any(),
        applicantController.uploadRequirements
    );
};