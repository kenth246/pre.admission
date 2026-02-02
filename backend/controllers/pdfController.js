const PDFDocument = require('pdfkit');
const Applicant = require('../models/applicant');

exports.generateAdmissionSlip = async(req, res) => {
    try {
        const { id } = req.params;

        // Extract real ID
        const cleanId = id.replace('_slip.pdf', '');

        const applicant = await Applicant.findById(cleanId);
        if (!applicant) return res.status(404).send('Applicant not found');

        // Create PDF Stream
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Pipe to response 
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${applicant.lastName}_Admission_Slip.pdf`);
        doc.pipe(res);

        // --- PDF DESIGN ---

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('BTECH COLLEGE', { align: 'center' });
        doc.fontSize(12).font('Helvetica').text('Bulacan, Philippines', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).fillColor('#15803d').text('OFFICIAL ADMISSION SLIP', { align: 'center', underline: true });
        doc.moveDown(2);

        // Applicant Details Box
        doc.rect(50, 150, 500, 140).stroke();

        doc.fillColor('black').fontSize(12).font('Helvetica-Bold');
        doc.text(`Applicant ID:`, 70, 170);
        doc.font('Helvetica').text(applicant._id.toString(), 200, 170);

        doc.font('Helvetica-Bold').text(`Name:`, 70, 195);
        doc.font('Helvetica').text(`${applicant.lastName}, ${applicant.firstName}`, 200, 195);

        doc.font('Helvetica-Bold').text(`Course Choice:`, 70, 220);
        // Handle case where education or collegeSchool might be undefined
        const course = applicant.education ?.collegeSchool || "N/A";
        doc.font('Helvetica').text(course, 200, 220);

        doc.font('Helvetica-Bold').text(`Status:`, 70, 245);
        doc.fillColor('#15803d').text(applicant.status.toUpperCase(), 200, 245);

        // Footer / Instructions
        doc.moveDown(8);
        doc.fillColor('black').font('Helvetica-Oblique').fontSize(10);
        doc.text('Note: Please present this slip to the Registrar Office for enrollment.', { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

        // Finalize PDF
        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating PDF');
    }
};