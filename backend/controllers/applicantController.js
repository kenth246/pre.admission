const Applicant = require("../models/applicant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// APPLICANT TYPE
exports.setApplicantType = async(req, res) => {
    try {
        const applicantId = req.user.id;
        const { applicantType } = req.body;

        // 1. Validation
        if (!["freshman", "transferee"].includes(applicantType)) {
            return res.status(400).json({ msg: "Invalid applicant type" });
        }

        // 2. Update directly (Removed the 'already set' check so you can fix data freely)
        const updatedApplicant = await Applicant.findByIdAndUpdate(
            applicantId, { applicantType: applicantType }, { new: true } // Return the updated document
        );

        if (!updatedApplicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        res.json({
            msg: "Applicant type saved successfully",
            applicantType: updatedApplicant.applicantType
        });

    } catch (err) {
        console.error("SET TYPE ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};


/* =========================
   REGISTER
========================= */
exports.register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        const existing = await Applicant.findOne({
            $or: [{ username }, { email }]
        });
        if (existing) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const applicant = await Applicant.create({
            username,
            email,
            password: hashed
        });

        res.status(201).json({ msg: "Registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

/* =========================
   LOGIN
========================= */
exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;

        // find applicant by username (frontend sends username)
        const applicant = await Applicant.findOne({ username });
        if (!applicant) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, applicant.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // sign token
        const token = jwt.sign({ id: applicant._id, role: "applicant" },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        // respond
        return res.status(200).json({
            token,
            applicant: {
                id: applicant._id,
                username: applicant.username,
                email: applicant.email,
            },
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ msg: "Server error" });
    }
};


/* =========================
   GET PROFILE
========================= */
exports.getProfile = async(req, res) => {
    try {
        // REMOVED: Token verification (handled by route bypass now)

        // Use the hardcoded ID from req.user
        const applicant = await Applicant.findById(req.user.id).select("-password");

        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        res.status(200).json(applicant);
    } catch (err) {
        console.error("GET PROFILE ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

/* =========================
   UPDATE PROFILE
========================= */
exports.updateProfile = async(req, res) => {
    try {
        const applicant = await Applicant.findById(req.user.id);

        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        if (applicant.isSubmitted) {
            return res.status(403).json({
                msg: "Application already submitted. Editing is disabled."
            });
        }

        if (!req.body.data) {
            return res.status(400).json({ msg: "No profile data received" });
        }

        const parsedData = JSON.parse(req.body.data);
        const updateData = {...parsedData };

        // Merge nested objects safely
        if (parsedData.address) {
            updateData.address = {
                ...(applicant.address ? applicant.address.toObject() : {}),
                ...parsedData.address
            };
        }

        if (parsedData.family) {
            updateData.family = {
                ...(applicant.family ? applicant.family.toObject() : {}),
                ...parsedData.family
            };
        }

        if (parsedData.education) {
            updateData.education = {
                ...(applicant.education ? applicant.education.toObject() : {}),
                ...parsedData.education
            };
        }

        if (parsedData.otherInfo) {
            updateData.otherInfo = parsedData.otherInfo;
        }

        if (req.file) {
            updateData.photo = "/uploads/" + req.file.filename;
        }

        const updated = await Applicant.findByIdAndUpdate(
            req.user.id,
            updateData, { new: true }
        ).select("-password");

        res.status(200).json(updated);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
}


/* =========================
   UPLOAD REQUIREMENTS
========================= */
exports.uploadRequirements = async(req, res) => {
    try {
        // REMOVED: Token verification

        // FIX: Fetch applicant FIRST before checking 'isSubmitted'
        const applicant = await Applicant.findById(req.user.id);

        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        if (applicant.isSubmitted) {
            return res.status(403).json({
                msg: "Application already submitted. Editing is disabled."
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: "No documents uploaded" });
        }

        const docs = req.files.map(f => ({
            filename: f.filename,
            originalName: f.originalname,
            path: "/uploads/" + f.filename,
            uploadedAt: new Date()
        }));

        applicant.documents.push(...docs);
        await applicant.save();

        res.status(200).json({
            msg: "Requirements uploaded",
            documents: applicant.documents
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.finalSubmit = async(req, res) => {
    try {
        const applicantId = req.user.id;

        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        if (!applicant.applicantType) {
            return res.status(400).json({
                msg: "Applicant type not selected"
            });
        }

        if (applicant.isSubmitted) {
            return res.status(403).json({
                msg: "Application already submitted"
            });
        }

        applicant.isSubmitted = true;
        applicant.status = "Submitted";
        await applicant.save();

        res.json({ msg: "Application successfully submitted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};