/**
 * Controls allowed applicant status transitions
 * Prevents skipping steps in the admission pipeline
 */

const allowedTransitions = {
    Pending: ["Evaluated"],
    Evaluated: ["Exam Passed", "Rejected"],
    "Exam Passed": ["Interview Passed", "Rejected"],
    "Interview Passed": ["Admitted", "Rejected"],
    Admitted: [],
    Rejected: []
};

const validateStatusTransition = (currentStatus, nextStatus) => {
    if (!currentStatus || !nextStatus) return false;
    return allowedTransitions[currentStatus] ?.includes(nextStatus) || false;
};

module.exports = { validateStatusTransition };