const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({


    applicantType: { type: String, enum: ["freshman", "transferee"], default: null },
    isSubmitted: { type: Boolean, default: false },
    // Log-in
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    photo: {
        type: String,
        default: ""
    },

    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    suffix: { type: String, default: "" },
    gender: { type: String, default: "" },
    birthDate: { type: String, default: "" },
    birthPlace: { type: String, default: "" },
    religion: { type: String, default: "" },
    civilStatus: { type: String, default: "single" },
    nationality: { type: String, default: "" },
    contactNumber: { type: String, default: "" },

    address: {
        regionCode: { type: String, default: "" },
        regionName: { type: String, default: "" },
        provinceCode: { type: String, default: "" },
        provinceName: { type: String, default: "" },
        cityCode: { type: String, default: "" },
        cityName: { type: String, default: "" },
        barangayCode: { type: String, default: "" },
        barangayName: { type: String, default: "" },
        houseNo: { type: String, default: "" },
        street: { type: String, default: "" },
        zipCode: { type: String, default: "" }
    },

    family: {
        fatherName: { type: String, default: "" },
        fatherOccupation: { type: String, default: "" },
        fatherContact: { type: String, default: "" },
        motherName: { type: String, default: "" },
        motherOccupation: { type: String, default: "" },
        motherContact: { type: String, default: "" },
        guardianName: { type: String, default: "" },
        guardianOccupation: { type: String, default: "" },
        guardianContact: { type: String, default: "" },
        siblings: { type: Number, default: 0 },
        familyIncome: { type: String, default: "" }
    },

    otherInfo: {
        type: [String],
        default: []
    },

    education: {
        lrn: { type: String, default: "" },
        gwa: { type: String, default: "" },
        elementarySchool: { type: String, default: "" },
        elementaryAddress: { type: String, default: "" },
        elementaryYear: { type: String, default: "" },
        juniorHighSchool: { type: String, default: "" },
        juniorHighAddress: { type: String, default: "" },
        juniorHighYear: { type: String, default: "" },
        seniorHighSchool: { type: String, default: "" },
        seniorHighAddress: { type: String, default: "" },
        seniorHighYear: { type: String, default: "" },
        collegeSchool: { type: String, default: "" },
        collegeAddress: { type: String, default: "" },
        collegeYear: { type: String, default: "" }
    },

    documents: [{
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: Date
    }],

    status: {
        type: String,
        ennum: [
            'Pending',
            'Pending Interview',
            'Failed Interview',
            'Pending BCET',
            'Passed BCET',
            'Failed BCET',
            'Admitted'
        ],
        default: 'Pending'
    }
}, { timestamps: true });

ApplicantSchema.index({ status: 1 });
ApplicantSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Applicant || mongoose.model("Applicant", ApplicantSchema);