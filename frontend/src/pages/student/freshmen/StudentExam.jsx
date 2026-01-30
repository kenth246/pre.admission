import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import StudentHeader from '../../../components/student/StudentHeader.jsx';
import ProgressBar from '../../../components/student/ProgressBar.jsx';

export default function StudentExam() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [canProceed, setCanProceed] = useState(false);

  // This matches your admin examination.jsx setup
  const [examSetup, setExamSetup] = useState({
    title: "BTECH College Entrance Test",
    instructions: "Please read each question carefully and select the best answer. You can only submit your answers once.",
    questions: [
      {
        id: 1,
        text: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"]
      },
      {
        id: 2,
        text: "Which programming language is primarily used for styling web pages?",
        options: ["Python", "C++", "CSS", "Java"]
      },
      {
        id: 3,
        text: "What is the result of 5 + '5' in JavaScript?",
        options: ["10", "55", "Error", "undefined"]
      }
    ]
  });

  const handleSubmitExam = (e) => {
    e.preventDefault();
    if (formRef.current && formRef.current.reportValidity()) {
      setCanProceed(true);
      alert("Examination Submitted Successfully!");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      
      {/*  TOP SECTION */}
      <div className="shrink-0 z-50">
        <StudentHeader />
        <ProgressBar canProceed={canProceed} />
      </div>

      {/*  CONTENT */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex justify-center">
        <div className="w-full max-w-[1200px] space-y-6 mb-10">
          
          {/*  HEADER CARD  */}
          <div className="w-full bg-white border-t-[10px] border-green-700 rounded-xl shadow-md p-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 uppercase tracking-tight">
              {examSetup.title}
            </h1>
            <div className="w-full bg-gray-100 p-4 border border-gray-300 rounded-xl">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold text-lg pr-2">Instructions:</span>
                {examSetup.instructions}
              </p>
            </div>
            <p className="mt-4 text-red-600 text-xs font-bold uppercase tracking-widest">
              * Required
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmitExam} className="space-y-4">
            {examSetup.questions.map((q, index) => (
              /* QUESTION BLOCK  */
              <div key={q.id} className="w-full bg-white p-6 border border-gray-300 rounded-xl shadow-sm space-y-4">
                <p className="text-m md:text-xl font-black text-gray-800 border-b border-gray-300 pb-2">
                  {index + 1}. {q.text} <span className="text-red-500">*</span>
                </p>
                
                <div className="space-y-3 pl-2">
                  {q.options.map((option, oIndex) => (
                    <label key={oIndex} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        required
                        value={option}
                        className="w-5 h-5 border-gray-400 accent-green-700 cursor-pointer"
                      />
                      <span className="text-m md:text-lg font-semibold text-gray-700 group-hover:text-black transition-colors">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* ACTION BUTTONS  */}
            <div className="flex justify-between items-center pt-6 px-2">
             <button 
                type="button"
                onClick={() => formRef.current.reset()}
                className="text-gray-500 text-s text-sm mb-8 font-bold hover:text-red-600 uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>

              <button 
                type="submit"
                className="px-6 lg:px-7 py-2 lg:py-4 mb-8 bg-green-700 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-all shadow-md transform active:scale-95 uppercase tracking-widest"
              >
                Submit 
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}