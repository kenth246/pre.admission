import api from "./api";

export const getApplicants = () => api.get("/admin/applicants");
export const updateApplicantStatus = (id, status) =>
    api.patch(`/admin/applicant/${id}/status`, { status });