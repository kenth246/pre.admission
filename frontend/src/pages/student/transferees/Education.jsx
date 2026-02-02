import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import StudentHeader from '../../../components/student/StudentHeader.jsx';
import ProgressBar2 from '../../../components/student/ProgressBar2.jsx';
import api from '../../../services/api';

export default function Education() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [canProceed, setCanProceed] = useState(false);

	const handleSaveProfile = async (e) => {
	e.preventDefault();

	if (!formRef.current.reportValidity()) {
		setCanProceed(false);
		return;
	}

	try {
		const raw = new FormData(formRef.current);

		const education = {
			gwa: raw.get("education.gwa"),

  // Elementary
  elementarySchool: raw.get("education.elementarySchool"),
  elementaryAddress: raw.get("education.elementaryAddress"),
  elementaryType: raw.get("education.elementarySchoolType"),
  elementaryYear: raw.get("education.elementaryYear"),

  // Junior High
  juniorHighSchool: raw.get("education.juniorHighSchool"),
  juniorHighAddress: raw.get("education.juniorHighAddress"),
  juniorHighType: raw.get("education.juniorHighSchoolType"),
  juniorHighYear: raw.get("education.juniorHighYear"),

  // Senior High
  seniorHighSchool: raw.get("education.seniorHighSchool"),
  seniorHighAddress: raw.get("education.seniorHighAddress"),
  seniorHighType: raw.get("education.seniorHighSchoolType"),
  seniorHighYear: raw.get("education.seniorHighYear"),

  // Last School / College
  collegeSchool: raw.get("education.lastSchoolName"),
  collegeAddress: raw.get("education.lastSchoolAddress"),
  collegeType: raw.get("education.lastSchoolType"),
  collegeYear: raw.get("collegeYear"),

  // GWA
  gwa: raw.get("education.gwa")
};

		const formData = new FormData();
		formData.append("data", JSON.stringify({ education }));

		await api.put("/applicant/profile", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		setCanProceed(true);
		alert("Education Profile Saved Successfully! You can now proceed to Requirements.");
		navigate("/requirements");
	} catch (err) {
		console.error(err);
		alert("Failed to save education profile.");
	}
};

  const inputStyle = "mt-1 h-10 w-full p-2 bg-white uppercase border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none transition-all";
  
  // Clean select style without chevron (matching Profile.jsx)
  const selectStyle = "mt-1 h-10 w-full px-2 bg-white border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none cursor-pointer transition-all appearance-none";
  
  const labelStyle = "text-[11px] font-bold text-gray-700 uppercase";

  const FormField = ({ label, name, required = true, type = "text", isSelect = false, options = [] }) => (
    <div className="flex flex-col">
      <label className={labelStyle}>{label}</label>
      {isSelect ? (
        <select name={name} required={required} className={selectStyle}>
          <option value="">Select Type</option>
          {options.map(opt => (
            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} required={required} className={inputStyle} />
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="shrink-0 z-50">
        <StudentHeader />
        <ProgressBar2 canProceed={canProceed} />
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-2">
        <div className="w-full max-w-[1400px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          <form ref={formRef} onSubmit={handleSaveProfile} className="p-4 md:p-8 space-y-8">
            
            {/* LRN AND GWA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-5">
              <FormField label="General Weighted Average (GWA)" type="number" name="education.gwa" />
            </div>

            {/* ELEMENTARY SECTION */}
            <div>
              <span className='italic text-gray-600'><span className='font-bold not-italic text-red-600'>Note:</span> Kindly avoid abbreviations for both the school name and address.</span>
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Elementary*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.elementarySchool" />
                <FormField label="School Address" name="education.elementaryAddress" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.elementarySchoolType" />
                <FormField label="Year Graduated" name="education.elementaryYear" />
              </div>
            </div>

            {/* JUNIOR HIGH SECTION */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Junior High School*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.juniorHighSchool" />
                <FormField label="School Address" name="education.juniorHighAddress" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.juniorHighSchoolType" />
                <FormField label="Year Graduated" name="education.juniorHighYear" />
              </div>
            </div>

            {/* SENIOR HIGH SECTION */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Senior High School*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.seniorHighSchool" />
                <FormField label="School Address" name="education.seniorHighAddress" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.seniorHighSchoolType" />
                <FormField label="Year Graduated" name="education.seniorHighYear" />
              </div>
            </div>

            {/* LAST SCHOOL ATTENDED */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Last School Attended*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.lastSchoolName" />
                <FormField label="School Address" name="education.lastSchoolAddress" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.lastSchoolType" />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="flex justify-end pt-4 pb-6">
              <button 
                type="submit"
                className="p-3 lg:p-4 bg-green-700 hover:bg-green-600 text-white font-black rounded-xl transition-all shadow-lg uppercase text-sm tracking-widest active:scale-95"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}