const Applicant = require('../models/applicant');
const Admin = require('../models/admin');
const SystemSettings = require('../models/systemSettings');
const AuditLog = require('../models/auditLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEnrollmentInstructions } = require('../utils/emailService');
const { createNotification } = require('./notificationController');

// --- 1. ADMIN AUTHENTICATION ---
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        // Check username or email
        const admin = await Admin.findOne({ username: email });
        if (!admin) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const token = jwt.sign({ user: { id: admin._id, role: 'admin' } },
            process.env.JWT_SECRET, { expiresIn: '8h' }
        );

        res.json({ token, msg: "Admin logged in" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// --- 2. APPLICANT MANAGEMENT ---
exports.getAllApplicants = async(req, res) => {
    try {
        console.log("Fetching applicants...");
        const applicants = await Applicant.find().sort({ createdAt: -1 });
        console.log(`Found ${applicants.length} applicants.`);

        const formatted = applicants.map(app => {
            const edu = app.education || {};
            const addr = app.address || {};
            const fam = app.family || {};
            const other = app.otherInfo || app.otherInformation || {};

            const isTransferee = !!edu.collegeSchool;
            const dateStr = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A";

            const city = addr.townCity || addr.cityName || "N/A";
            const brgy = addr.barangay || addr.barangayName || "";
            const prov = addr.province || addr.provinceName || "";

            let is4Ps = false,
                isPWD = false,
                isIndigenous = false;

            if (Array.isArray(other)) {
                is4Ps = other.includes("4Ps");
                isPWD = other.includes("PWD") || other.includes("Disability");
                isIndigenous = other.includes("Indigenous");
            } else if (typeof other === 'object') {
                is4Ps = !!other.is4Ps;
                isPWD = !!other.isPWD || !!other.hasDisability;
                isIndigenous = !!other.isIndigenous;
            }

            return {
                id: app._id,
                name: `${app.firstName || 'Unknown'} ${app.lastName || ''}`.toUpperCase(),
                type: isTransferee ? "Transferee" : "Freshmen",
                location: city.toUpperCase(),
                date: dateStr,
                status: app.status || "Pending Interview",
                email: app.email,
                profile: {
                    personal: {
                        firstName: app.firstName,
                        middleName: app.middleName,
                        surname: app.lastName,
                        suffix: app.suffix,
                        dob: app.birthDate,
                        pob: app.birthPlace,
                        gender: app.gender,
                        civilStatus: app.civilStatus,
                        email: app.email,
                        contact: app.contactNumber,
                        address: [addr.houseNo, addr.street, brgy, city, prov, addr.zipCode].filter(Boolean).join(' ')
                    },
                    family: {
                        fatherName: fam.fatherName || '',
                        fatherOcc: fam.fatherOccupation || '',
                        fatherContact: fam.fatherContact || '',
                        motherName: fam.motherName || '',
                        motherOcc: fam.motherOccupation || '',
                        motherContact: fam.motherContact || '',
                        guardianName: fam.guardianName || '',
                        guardianOcc: fam.guardianOccupation || '',
                        guardianContact: fam.guardianContact || '',
                        siblings: fam.siblings || 0,
                        income: fam.familyIncome || ''
                    },
                    education: {
                        elementary: edu.elementarySchool || '',
                        elemAddr: edu.elementaryAddress || '',
                        elemYear: edu.elementaryYear || '',
                        jhs: edu.juniorHighSchool || '',
                        jhsAddr: edu.juniorHighAddress || '',
                        jhsYear: edu.juniorHighYear || '',
                        shs: edu.seniorHighSchool || '',
                        shsAddr: edu.seniorHighAddress || '',
                        shsYear: edu.seniorHighYear || '',
                        college: edu.collegeSchool || '',
                        gwa: edu.gwa || ''
                    },
                    otherInfo: { is4Ps, isPWD, isIndigenous },
                    documents: app.documents || []
                }
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).send('Server Error');
    }
};

exports.updateStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const applicantId = req.params.id;

        const applicant = await Applicant.findById(applicantId);
        if (!applicant) return res.status(404).json({ msg: "Applicant not found" });

        applicant.status = status;
        await applicant.save();

        // Send Email if passed
        if (status === 'Passed BCET' || status === 'Admitted') {
            console.log(`Sending admission email to ${applicant.email}...`);
            await sendEnrollmentInstructions(applicant.email, applicant._id);
        }

        try {
            await createNotification(
                "Applicant Status Updated",
                `${applicant.firstName} ${applicant.lastName} has been marked as '${status}'.`,
                "success"
            );
        } catch (error) {
            console.error("Notification Error:", error);
        }

        res.json({ msg: "Status updated and email sent" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// --- 3. SYSTEM SETTINGS & LOGS ---
exports.getSystemSettings = async(req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = await SystemSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching settings", error: error.message });
    }
};

exports.updateSystemSettings = async(req, res) => {
    try {
        const updates = req.body;
        const settings = await SystemSettings.findOneAndUpdate({}, updates, { new: true, upsert: true });

        const user = req.user ? (req.user.username || "Admin") : "System";

        await AuditLog.create({
            user: user,
            action: "Updated System Configuration",
            status: "Success",
            details: JSON.stringify(updates)
        });

        const { createNotification } = require('./notificationController'); // Ensure imported at top

        try {
            await createNotification(
                "System Settings Updated",
                `System configuration was updated by ${user}.`,
                "warning" // 'warning' type makes it stand out
            );
        } catch (error) {
            console.error("Notification Error:", error);
        }

        res.json({ message: "Settings updated successfully", settings });
    } catch (error) {
        res.status(500).json({ message: "Error updating settings", error: error.message });
    }
};

exports.getActivityLogs = async(req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching logs" });
    }
};

exports.clearActivityLogs = async(req, res) => {
    try {
        await AuditLog.deleteMany({});
        res.json({ message: "Logs cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing logs" });
    }
};

// --- 4. ADMIN PROFILE MANAGEMENT ---
exports.getProfile = async(req, res) => {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');
        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        res.json({
            name: admin.username,
            email: admin.email,
            image: admin.image,
            position: "Administrator",
            roleDisplay: "Admin"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateProfile = async(req, res) => {
    try {
        const { name, email } = req.body;
        const admin = await Admin.findById(req.user.id);

        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        if (name) admin.username = name;
        if (email) admin.email = email;

        // If an image was uploaded
        if (req.file) {
            admin.image = `/uploads/${req.file.filename}`;
        }

        await admin.save();

        res.json({
            msg: "Profile updated",
            profile: {
                name: admin.username,
                email: admin.email,
                image: admin.image
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.changePassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await Admin.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect current password" });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        await admin.save();
        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};