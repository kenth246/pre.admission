import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ClipboardList,
  BookOpen,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FileText
} from "lucide-react";

// Steps matched to your progression
const steps = [
  { label: "Student Profile", icon: GraduationCap, path: "/profile" },
  { label: "Educational Profile", icon: BookOpen, path: "/education" },  
  { label: "Requirements", icon: ClipboardList, path: "/requirements" }, 
  { label: "Interview", icon: MessageSquare, path: "/interview" },  
  { label: "BCET", icon: FileText, path: "/exam" },      
                  
];

const ProgressBar = ({ canProceed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = steps.findIndex((step) => step.path === location.pathname);
  const activeIndex = currentStep === -1 ? 0 : currentStep;

  // Center-aligned width calculation
  const progressWidth = ((activeIndex + 0.5) / steps.length) * 100;

  const handleNext = () => {
    if (activeIndex < steps.length - 1 && canProceed) {
      navigate(steps[activeIndex + 1].path);
    }
  };

  // UPDATED handleBack Logic
  const handleBack = () => {
    if (activeIndex === 0) {
      // Navigates to admission page if on the first step
      navigate("/student_admission");
    } else {
      // Standard back navigation for other steps
      navigate(steps[activeIndex - 1].path);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6">
      <div className="relative mb-6">
        <div className="absolute top-5 md:top-7 left-0 w-full h-1.5 bg-gray-100 border border-gray-200 rounded-full" />
        
        <div
          className="absolute top-5 md:top-7 left-0 h-1.5 bg-green-600 transition-all duration-500 ease-in-out rounded-full shadow-sm z-0"
          style={{ width: `${progressWidth}%` }}
        />

        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const isLocked = index > activeIndex && !canProceed;

            return (
              <div 
                key={index} 
                className={`flex flex-col items-center flex-1 transition-all ${isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                onClick={() => {
                  if (!isLocked) navigate(step.path);
                }} 
              >
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm z-20
                    ${isActive ? "bg-white border-green-600 text-green-600" : "bg-white border-gray-200 text-gray-400"} 
                    ${isCurrent ? "ring-4 ring-green-50 scale-110" : ""}`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className={`mt-3 text-[10px] md:text-xs lg:text-sm font-bold text-center tracking-tight px-1
                    ${isActive ? "text-slate-800" : "text-gray-400 font-medium"} 
                    ${!isCurrent ? "hidden md:block" : "block"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between bg-white p-2 md:p-4 rounded-2xl shadow-md border border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-3">
            {React.createElement(steps[activeIndex].icon, {
              className: "w-5 h-5 md:w-6 md:h-6 text-green-700",
            })}
            <span className="font-black text-green-700 text-sm md:text-lg lg:text-2xl uppercase italic">
              {steps[activeIndex].label}
            </span>
        </div>

        <button
          onClick={handleNext}
          disabled={activeIndex === steps.length - 1 || !canProceed}
          className="p-2 rounded-xl bg-green-700 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-green-800 transition-all shadow-lg active:scale-90"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ProgressBar;