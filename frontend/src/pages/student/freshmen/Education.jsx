import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import StudentHeader from '../../../components/student/StudentHeader.jsx';
import ProgressBar from '../../../components/student/ProgressBar.jsx';
import api from "../../../services/api.js";

export default function Education() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    education: {
      lrn: "",
      gwa: "",
      elementarySchool: "",
      elementaryAddress: "",
      elementaryYear: "",
      elementarySchoolType: "",
      juniorHighSchool: "",
      juniorHighAddress: "",
      juniorHighYear: "",
      juniorHighSchoolType: "",
      seniorHighSchool: "",
      seniorHighAddress: "",
      seniorHighYear: "",
      seniorHighSchoolType: "",
    }
  });

  useEffect(() => {
    const fetchEducationData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/applicant/profile');
        if (response.data && response.data.education) {
          setFormData(prev => ({
            ...prev,
            education: { ...prev.education, ...response.data.education }
          }));
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch education data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEducationData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [parent, key] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!formRef.current.reportValidity()) return;

    try {
      const { education } = formData;
      const submitData = new FormData();
      submitData.append('data', JSON.stringify({ education }));
      await api.put("/applicant/profile", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCanProceed(true);
      alert("Education Profile Saved Successfully! You can now proceed to Requirements.");
      navigate("/requirements");

    } catch (err) {
      console.error("Save Error:", err);
      const msg = err.response?.data?.msg || "Failed to save education profile.";
      alert(msg);
    }
  };

  const inputStyle = "mt-1 h-10 w-full p-2 bg-white uppercase border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none transition-all";
  
  const selectStyle = "mt-1 h-10 w-full px-2 bg-white border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none cursor-pointer transition-all appearance-none";
  
  const labelStyle = "text-[11px] font-bold text-gray-700 uppercase";

  const FormField = ({ label, name, value, onChange, required = true, type = "text", isSelect = false, options = [] }) => (
    <div className="flex flex-col">
      <label className={labelStyle}>{label}</label>
      {isSelect ? (
        <select name={name} value={value} onChange={onChange} required={required} className={selectStyle}>
          <option value="">Select Type</option>
          {options.map(opt => (
            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
          ))}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required} className={inputStyle}/>
      )}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="shrink-0 z-50">
        <StudentHeader />
        <ProgressBar canProceed={canProceed} />
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-2">
        <div className="w-full max-w-[1400px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">
          <form ref={formRef} onSubmit={handleSaveProfile} className="p-4 md:p-8 space-y-8">
            
            {/* LRN AND GWA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-5">
              <FormField label="Learner's Reference Number (LRN)" type="number" name="education.lrn" value={formData.education.lrn} onChange={handleChange} />
              <FormField label="General Weighted Average (GWA)" type="number" name="education.gwa" value={formData.education.gwa} onChange={handleChange} />
            </div>

            {/* ELEMENTARY SECTION */}
            <div>
              <span className='italic text-gray-600'><span className='font-bold not-italic text-red-600'>Note:</span> Kindly avoid abbreviations for both the school name and address.</span>
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Elementary*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.elementarySchool" value={formData.education.elementarySchool} onChange={handleChange} />
                <FormField label="School Address" name="education.elementaryAddress" value={formData.education.elementaryAddress} onChange={handleChange} />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.elementarySchoolType" value={formData.education.elementarySchoolType} onChange={handleChange} />
                <FormField label="Year Graduated" name="education.elementaryYear" value={formData.education.elementaryYear} onChange={handleChange} />
              </div>
            </div>

            {/* JUNIOR HIGH SECTION */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Junior High School*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.juniorHighSchool" value={formData.education.juniorHighSchool} onChange={handleChange} />
                <FormField label="School Address" name="education.juniorHighAddress" value={formData.education.juniorHighAddress} onChange={handleChange} />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.juniorHighSchoolType" value={formData.education.juniorHighSchoolType} onChange={handleChange} />
                <FormField label="Year Graduated" name="education.juniorHighYear" value={formData.education.juniorHighYear} onChange={handleChange} />
              </div>
            </div>

            {/* SENIOR HIGH SECTION */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Senior High School*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" name="education.seniorHighSchool" value={formData.education.seniorHighSchool} onChange={handleChange} />
                <FormField label="School Address" name="education.seniorHighAddress" value={formData.education.seniorHighAddress} onChange={handleChange} />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} name="education.seniorHighSchoolType" value={formData.education.seniorHighSchoolType} onChange={handleChange} />
                <FormField label="Year Graduated" name="education.seniorHighYear" value={formData.education.seniorHighYear} onChange={handleChange} />
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
