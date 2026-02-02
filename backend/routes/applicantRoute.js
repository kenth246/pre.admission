const applicantController = require("../controllers/applicantController");
const upload = require("../middleware/upload");
const pdfController = require('../controllers/pdfController');
const router = require("express").Router();
// --- AUTH BYPASS ---
const bypassAuth = (req, res, next) => {
    req.user = { id: "697dac1d647039ab0a73b02b" };
    next();
};

module.exports = (app) => {
    app.post("/api/applicant/register", applicantController.register);
    app.post("/api/applicant/login", applicantController.login);
    app.post("/api/applicant/type", bypassAuth, applicantController.setApplicantType);
    app.get("/api/applicant/profile", bypassAuth, applicantController.getProfile);
    app.put("/api/applicant/profile", bypassAuth, upload.single("photo"), applicantController.updateProfile);
    app.post("/api/applicant/requirements", bypassAuth, upload.any(), applicantController.uploadRequirements);
    router.get('/downloads/admission-slips/:id', pdfController.generateAdmissionSlip);
    app.use('/api/applicant', router);
};