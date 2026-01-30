module.exports.setAdmissionStatus = async function(Applicant, username, status) {
    return module.exports.setAdmissionStatus = async function(Applicant, applicantId, status) {
        return Applicant.findByIdAndUpdate(
            applicantId, { status }, { new: true }
        );
    };

}