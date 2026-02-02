import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import StudentHeader from '../../../components/student/StudentHeader.jsx';
import ProgressBar from '../../../components/student/ProgressBar.jsx';
import api from '../../../services/api.js';

export default function StudentInterview() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [canProceed, setCanProceed] = useState(false);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Courses extracted from the provided images
  const courseOptions = [
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Management Accounting",
    "Bachelor of Science in Accounting Information System",
    "Bachelor of Science in Internal Auditing",
    "Bachelor of Science in Entrepreneurship",
    "Bachelor of Science in Business Administration Major in Business Economics",
    "Bachelor of Science in Business Administration Major in Financial Management",
    "Bachelor of Science in Business Administration Major in Marketing Management",
    "Bachelor of Science in Business Administration Major in Human Resource Management",
    "Bachelor of Arts in History",
    "Bachelor of Science in Mathematics",
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education Major in English",
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Tourism Management",
    "Bachelor of Science in Hospitality Management"
  ];

  const [interviewSetup] = useState({
    title: "Interview",
    category: "Communication Skills Assessment",
    instructions: "Please answer all questions honestly and provide as much detail as possible to help us evaluate your application.",
    questions: [
      { id: 1, text: "Why did you choose this course?" },
      { id: 2, text: "What are your career goals after graduation?" },
      { id: 3, text: "Tell me about yourself?" },
      { id: 4, text: "Why should the university/college accept your application?" }
    ]
  });

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (formRef.current && formRef.current.reportValidity()) {
      setShowConfirmModal(true);
    }
  };

  const handleFinalConfirm = async () => {
const formData = new FormData(formRef.current);
	const responses = [
		`First Choice: ${formData.get("firstChoice")}`,
 		`Second Choice: ${formData.get("secondChoice")}`,
		`Q1: ${formData.get("q_1")}`,
  		`Q2: ${formData.get("q_2")}`,
    	`Q3: ${formData.get("q_3")}`,
    	`Q4: ${formData.get("q_4")}`
	];
    try {
      // CONNECT TO BACKEND
      await api.post('/assessment/interview', { responses });
      setShowConfirmModal(false);
      setCanProceed(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Failed to submit interview.");
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden relative font-sans">
      
      <div className="shrink-0 z-50">
        <StudentHeader />
        <ProgressBar canProceed={canProceed} />
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4 flex justify-center">
        <div className="w-full max-w-[1200px] space-y-6 mb-10">
          
          <div className="w-full bg-white border-t-[10px] border-green-700 rounded-xl shadow-md p-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 uppercase tracking-tight">
              {interviewSetup.title}
            </h1>
            <div className="w-full bg-gray-100 p-4 border border-gray-300 rounded-xl">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold text-lg pr-2">Instructions:</span>
                {interviewSetup.instructions}
              </p>
            </div>
            <p className="mt-4 text-red-600 text-xs font-bold uppercase tracking-widest">* Required</p>
          </div>

          <form ref={formRef} onSubmit={handleInitialSubmit} className="space-y-4">
            
            {/* COURSE CHOICE SECTION (MODIFIED TO DROPDOWNS) */}
            <div className="w-full bg-white p-6 border border-gray-300 rounded-xl shadow-sm">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-gray-800 mb-1 uppercase">1st Choice Course <span className="text-red-500">*</span></label>
                  <select required name="firstChoice" defaultValue="" className="w-full p-3 border-2 uppercase bg-gray-100 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm font-semibold appearance-none">
                    <option value="" disabled>Select your first choice</option>
                    {courseOptions.map((course, idx) => (
                      <option key={idx} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[11px] font-bold text-gray-800 mb-1 uppercase">2nd Choice Course <span className="text-red-500">*</span></label>
                  <select required name="secondChoice" defaultValue="" className="w-full p-3 border-2 uppercase bg-gray-100 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm font-semibold appearance-none">
                    <option value="" disabled>Select your second choice</option>
                    {courseOptions.map((course, idx) => (
                      <option key={idx} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full bg-white p-3 border border-gray-300 rounded-xl">
              <p className="text-gray-700 font-bold text-lg lg:text-xl uppercase tracking-tight">{interviewSetup.category}</p>
            </div>

            {interviewSetup.questions.map((q, index) => (
              <div key={q.id} className="w-full bg-white p-6 border border-gray-300 rounded-xl shadow-sm space-y-3">
                <p className="text-m md:text-xl font-black text-gray-800 border-b border-gray-300 pb-2">
                  {index + 1}. {q.text} <span className="text-red-500">*</span>
                </p>
                <textarea name={`q_${q.id}`} required placeholder="Type your answer here..." className="w-full bg-transparent uppercase border-none focus:ring-0 outline-none text-gray-900 resize-y text-sm lg:text-lg" rows="2"></textarea>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 px-2">
              <button type="button" onClick={() => formRef.current.reset()} className="text-gray-500 text-sm mb-8 font-bold hover:text-red-600 uppercase tracking-wider transition-colors">
                Clear All
              </button>

              <button type="submit" className="px-10 py-4 mb-8 bg-green-700 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-widest">
                Submit 
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase">Confirm Submission</h2>
            <p className="text-gray-600 mb-8 font-medium">
              Please verify all provided information are correct and complete. Once submitted, it cannot be edited. Are you want to submit?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 uppercase text-xs tracking-widest transition-all">
                Cancel
              </button>
              <button onClick={handleFinalConfirm} className="flex-1 py-3 bg-green-700 text-white font-black rounded-xl hover:bg-green-800 uppercase text-xs tracking-widest transition-all shadow-lg shadow-green-200">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase">Submitted Successfully</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your interview is currently under review. The <span className="font-bold text-green-700">BCET link</span> will be sent to your registered email address once the review is complete. Thank you!
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-green-700 text-white font-black rounded-xl hover:bg-green-800 uppercase text-xs tracking-widest transition-all shadow-lg">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}