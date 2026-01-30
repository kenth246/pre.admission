const Applicant = require('../models/applicant');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logAudit } = require('../utils/auditLogger');
const { validateStatusTransition } = require('../utils/statusTransitions');
const {
    sendEnrollmentInstructions,
    sendAdmissionConfirmation
} = require('../utils/emailService');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ username: email });
        if (!admin) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { user: { id: admin._id, role: 'admin' } },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, msg: "Admin logged in" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getAllApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find().sort({ createdAt: -1 });

        const formatted = applicants.map(app => {
            const isTransferee = !!app.education?.collegeSchool;
            const dateStr = new Date(app.createdAt).toLocaleDateString();

            return {
                id: app._id,
                name: `${app.firstName || ''} ${app.lastName || ''}`.toUpperCase(),
                type: isTransferee ? "Transferee" : "Freshmen",
                location: app.address?.cityName
                    ? app.address.cityName.toUpperCase()
                    : "N/A",
                date: dateStr,
                status: app.status || "Pending",

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
                        address: [
                            app.address?.houseNo,
                            app.address?.street,
                            app.address?.barangayName,
                            app.address?.cityName,
                            app.address?.provinceName
                        ].filter(Boolean).join(' ')
                    },

                    family: {
                        fatherName: app.family?.fatherName,
                        fatherOcc: app.family?.fatherOccupation,
                        fatherContact: app.family?.fatherContact,
                        motherName: app.family?.motherName,
                        motherOcc: app.family?.motherOccupation,
                        motherContact: app.family?.motherContact,
                        guardianName: app.family?.guardianName,
                        guardianOcc: app.family?.guardianOccupation,
                        guardianContact: app.family?.guardianContact,
                        siblings: app.family?.siblings,
                        income: app.family?.familyIncome
                    },

                    education: {
                        elementary: app.education?.elementarySchool,
                        elemAddr: app.education?.elementaryAddress,
                        elemYear: app.education?.elementaryYear,

                        jhs: app.education?.juniorHighSchool,
                        jhsAddr: app.education?.juniorHighAddress,
                        jhsYear: app.education?.juniorHighYear,

                        shs: app.education?.seniorHighSchool,
                        shsAddr: app.education?.seniorHighAddress,
                        shsYear: app.education?.seniorHighYear,

                        college: app.education?.collegeSchool,
                        gwa: app.education?.gwa
                    },

                    otherInfo: {
                        is4Ps: app.otherInfo?.includes("4Ps") || false,
                        isPWD: app.otherInfo?.includes("PWD") || false,
                        isIndigenous: app.otherInfo?.includes("Indigenous") || false
                    },

                    documents: app.documents || []
                }
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicantId = req.params.id;

        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        if (!validateStatusTransition(applicant.status, status)) {
            return res.status(400).json({
                message: `Invalid status transition from ${applicant.status} to ${status}`
            });
        }

        const previousStatus = applicant.status;
        applicant.status = status;
        await applicant.save();

        await logAudit({
            actorId: req.user.id,
            actorRole: 'admin',
            action: 'STATUS_CHANGE',
            targetId: applicant._id,
            from: previousStatus,
            to: status
        });

        if (status === "Passed") {
            await sendEnrollmentInstructions(applicant.email);
        }

        if (status === "Rejected") {
            await sendAdmissionConfirmation(
                applicant.email,
                "Admission Result",
                "We regret to inform you that your application was not approved."
            );
        }

        res.json({ msg: "Status updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
