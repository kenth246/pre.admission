const Applicant = require('../models/applicant');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../utils/auditLogger');
// const { validateStatusTransition } = require('../utils/statusTransitions');
const {
    sendEnrollmentInstructions,
    sendAdmissionConfirmation
} = require('../utils/emailService');

// LOGIN 
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
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

// GET ALL APPLICANTS
exports.getAllApplicants = async(req, res) => {
    try {
        console.log("Fetching applicants...");
        const applicants = await Applicant.find().sort({ createdAt: -1 });
        console.log(`Found ${applicants.length} applicants.`);

        const formatted = applicants.map(app => {
            // 1. BASIC DATA EXTRACTION
            const edu = app.education || {};
            const addr = app.address || {};
            const fam = app.family || {};
            const other = app.otherInfo || app.otherInformation || {};

            // 2. STATUS & TYPE
            const isTransferee = !!edu.collegeSchool;
            const dateStr = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A";

            // 3. ADDRESS
            const city = addr.townCity || addr.cityName || "N/A";
            const brgy = addr.barangay || addr.barangayName || "";
            const prov = addr.province || addr.provinceName || "";

            // 4. SPECIAL CATEGORIES
            let is4Ps = false,
                isPWD = false,
                isIndigenous = false;

            if (Array.isArray(other)) {
                // Handle Old Array Format
                is4Ps = other.includes("4Ps");
                isPWD = other.includes("PWD") || other.includes("Disability");
                isIndigenous = other.includes("Indigenous");
            } else if (typeof other === 'object') {
                // Handle New Object Format
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

                // Full Profile Data
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
        console.error("ADMIN DASHBOARD ERROR:", err);
        res.status(500).send('Server Error');
    }
};

// UPDATE STATUS
const { sendEnrollmentInstructions } = require('../utils/emailService');

exports.updateStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const applicantId = req.params.id;

        const applicant = await Applicant.findById(applicantId);
        if (!applicant) return res.status(404).json({ msg: "Applicant not found" });
        applicant.status = status;
        await applicant.save();

        //  SEND EMAIL IF PASSED

        if (status === 'Passed BCET' || status === 'Admitted') {
            console.log(`Sending admission email to ${applicant.email}...`);
            await sendEnrollmentInstructions(applicant.email, applicant._id);
        }

        try {} catch (e) { console.warn("Audit Log Error:", e.message); }

        res.json({ msg: "Status updated and email sent" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};