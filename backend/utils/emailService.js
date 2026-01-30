const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Sending Application Confirmation Email
exports.sendAdmissionConfirmation = async(email, name) => {
    const mailOptions = {
        from: 'IITI Pre-Admission',
        to: email,
        subject: 'Application Received',
        text: `Hello ${name}, we have received your application. Please wait for the school to review your application.`
    };
    return transporter.sendMail(mailOptions);
};

// Sending BceT Link Email
exports.sendLink = async(email, type, username) => {
    const websiteLink = `http://localhost:5173/student/freshmen/${type}`;

    const mailOptions = {
        from: 'IITI Admissions',
        to: email,
        subject: `Action Required: Your ${type.toUpperCase()} Link`,
        text: `Congratulations! You are now qualified for the next step. 
        Please login with your username (${username}) and click here to start your ${type}: ${websiteLink}`
    };
    return transporter.sendMail(mailOptions);
};

// Enrollment Confirmation Email
exports.sendEnrollmentInstructions = async(email) => {
    const mailOptions = {
        from: 'IITI Admissions',
        to: email,
        subject: 'CONGRATULATIONS: Enrollment Instructions',
        text: `You have passed the Baliuag Polytechnic College Entrance Exam (BCeT)! Please proceed to the Registrar's Office to finalize your application.`
    };
    return transporter.sendMail(mailOptions);
};