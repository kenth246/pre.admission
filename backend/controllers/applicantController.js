const Applicant = require('../models/applicant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    registerSchema,
    loginSchema
} = require('../validators/applicant.schema');

/* Applicant register */
exports.register = async(req, res) => {
    try {
        registerSchema.parse(req.body);

        const { username, email, password, address } = req.body;

        const existing = await Applicant.findOne({
            $or: [{ username }, { email }]
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Username or Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newApplicant = new Applicant({
            ...req.body,
            username,
            email,
            password: hashedPassword,
            status: "Pending"
        });

        if (
            address ?.townCity ?.toLowerCase() === 'baliwag' &&
            address ?.province ?.toLowerCase() === 'bulacan'
        ) {
            newApplicant.priorityArea = "Baliwag";
        }

        await newApplicant.save();
        res.status(201).json({ success: true });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

/* Applicant Login */
exports.login = async(req, res) => {
    try {
        loginSchema.parse(req.body);
        const { username, password } = req.body;

        const user = await Applicant.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user._id, role: 'applicant' } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token });

    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({
                errors: err.errors.map(e => e.message)
            });
        }
        res.status(500).send('Server error');
    }
};

/* Profile Update */
exports.updateApplicantProfile = async(req, res) => {
    try {
        const applicantId = req.user.id;

        let parsedData = req.body;
        if (req.body.data) {
            try {
                parsedData = JSON.parse(req.body.data);
            } catch {
                return res.status(400).json({ msg: "Invalid profile data format" });
            }
        }

        const updateData = {
            ...parsedData,

            address: {
                regionCode: parsedData.address ?.regionCode,
                regionName: parsedData.address ?.regionName,
                provinceCode: parsedData.address ?.provinceCode,
                provinceName: parsedData.address ?.provinceName,
                cityCode: parsedData.address ?.cityCode,
                cityName: parsedData.address ?.cityName,
                barangayCode: parsedData.address ?.barangayCode,
                barangayName: parsedData.address ?.barangayName,
                houseNo: parsedData.address ?.houseNo,
                street: parsedData.address ?.street,
                zipCode: parsedData.address ?.zipCode
            },

            family: parsedData.family || {},
            otherInfo: parsedData.otherInfo || []
        };

        if (req.file) {
            updateData.photo = `/uploads/${req.file.filename}`;
        }

        // for the priority area (Baliuag)
        if (
            updateData.address ?.cityName ?.toLowerCase() === 'baliuag' &&
            updateData.address ?.provinceName ?.toLowerCase() === 'bulacan'
        ) {
            updateData.priorityArea = "Baliuag";
        }

        const updated = await Applicant.findByIdAndUpdate(
            applicantId, { $set: updateData }, { new: true }
        ).select('-password');

        if (!updated) {
            return res.status(404).json({ message: 'Applicant not found' });
        }

        res.json({ success: true, data: updated });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getApplicantProfile = async(req, res) => {
    try {
        const applicant = await Applicant.findById(req.user.id).select('-password');
        if (!applicant) {
            return res.status(404).json({ success: false, message: 'Applicant not found' });
        }
        res.status(200).json(applicant);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/* Documents Uploads */
exports.uploadDocuments = async(req, res) => {
    try {
        const applicantId = req.user.id;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const fileData = req.files.map(file => ({
            name: file.filename,
            type: file.mimetype === 'application/pdf' ? 'PDF' : 'IMG'
        }));

        const applicant = await Applicant.findByIdAndUpdate(
            applicantId, { $push: { documents: { $each: fileData } } }, { new: true }
        );

        if (!applicant) {
            return res.status(404).json({ msg: "Applicant not found" });
        }

        res.json({ success: true, documents: applicant.documents });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};