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

// Sending BCET Link Email
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

// Enrollment Email with PDF Link
exports.sendEnrollmentInstructions = async(email, applicantId) => {

    const pdfLink = `http://localhost:5000/api/admission-slip/${applicantId}`;

    const mailOptions = {
        from: 'IITI Admissions',
        to: email,
        subject: 'CONGRATULATIONS: You are Admitted!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #15803d;">Congratulations!</h2>
                <p>You have passed the Baliuag Polytechnic College Entrance Exam (BCET)!</p>
                <p>We are pleased to inform you that you have been <strong>ADMITTED</strong>.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                
                <p>Please download your official <strong>Admission Slip</strong> below and present it to the Registrar's Office to finalize your enrollment.</p>
                
                <br>
                <a href="${pdfLink}" style="background-color: #15803d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    DOWNLOAD ADMISSION SLIP
                </a>
                <br><br>
                <p style="font-size: 12px; color: #777;">Or copy this link: ${pdfLink}</p>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
};