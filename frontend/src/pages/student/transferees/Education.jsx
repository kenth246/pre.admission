import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import StudentHeader from '../../../components/student/StudentHeader.jsx';
import ProgressBar2 from '../../../components/student/ProgressBar2.jsx';

export default function Education() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [canProceed, setCanProceed] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (formRef.current && formRef.current.reportValidity()) {
      setCanProceed(true);
      alert("Education Profile Saved Successfully! You can now proceed to Requirements.");
    } else {
      setCanProceed(false);
    }
  };

  const inputStyle = "mt-1 h-10 w-full p-2 bg-white uppercase border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none transition-all";
  
  // Clean select style without chevron (matching Profile.jsx)
  const selectStyle = "mt-1 h-10 w-full px-2 bg-white border border-gray-400 rounded-lg focus:ring-1 focus:ring-green-600 outline-none cursor-pointer transition-all appearance-none";
  
  const labelStyle = "text-[11px] font-bold text-gray-700 uppercase";

  const FormField = ({ label, required = true, type = "text", isSelect = false, options = [] }) => (
    <div className="flex flex-col">
      <label className={labelStyle}>{label}</label>
      {isSelect ? (
        <select required={required} className={selectStyle}>
          <option value="">Select Type</option>
          {options.map(opt => (
            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
          ))}
        </select>
      ) : (
        <input type={type} required={required} className={inputStyle} />
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

              <FormField label="General Weighted Average (GWA)" type="number" />
            </div>

            {/* ELEMENTARY SECTION */}
            <div>
              <span className='italic text-gray-600'><span className='font-bold not-italic text-red-600'>Note:</span> Kindly avoid abbreviations for both the school name and address.</span>
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Elementary*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" />
                <FormField label="School Address" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} />
                <FormField label="Year Graduated" />
              </div>
            </div>

            {/* JUNIOR HIGH SECTION */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Junior High School*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" />
                <FormField label="School Address" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} />
                <FormField label="Year Graduated" />
              </div>
            </div>

            {/* SENIOR HIGH SECTION */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Senior High School*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" />
                <FormField label="School Address" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} />
                <FormField label="Year Graduated" />
              </div>
            </div>

            {/* LAST SCHOOL ATTENDED */}
            <div className="pt-2">
              <h3 className="text-sm md:text-lg font-black text-green-700 mb-2 uppercase tracking-tight">Last School Attended*</h3>
              <hr className="border-gray-300 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField label="School Name" />
                <FormField label="School Address" />
                <FormField label="Type of School" isSelect={true} options={["PUBLIC", "PRIVATE"]} />
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