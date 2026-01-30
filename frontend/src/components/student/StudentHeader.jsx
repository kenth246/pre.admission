import React from 'react';
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    console.log("Logging out...");
    navigate("/student_login");
  };

  return (
    <header className="bg-green-600 text-white shadow-md w-full relative">
      <div className="flex justify-between items-center px-2 sm:px-4 md:px-6 py-1.5 md:py-3">
        
        {/* Logo and Title Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 overflow-hidden">
          <img 
            src="/img/btech.png" 
            alt="BTECH" 
            className="h-6 w-6 xs:h-8 xs:w-8 md:h-12 md:w-12 object-contain shrink-0" 
          />
          <img 
            src="/img/iiti.png" 
            alt="IITI" 
            className="h-6 w-6 xs:h-8 xs:w-8 md:h-12 md:w-12 object-contain shrink-0" 
          />
          
          <h1 className="font-bold font-sans uppercase tracking-tighter leading-tight
                          text-[8px] xs:text-[10px] sm:text-sm md:text-xl lg:text-2xl">
            BTECH – INSTITUTE OF INFORMATION TECHNOLOGY AND INNOVATION
          </h1>
        </div>

        {/* Logout Icon Section */}
        <div className="shrink-0 ml-1 sm:ml-4">
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-full hover:bg-white/20 text-white transition-all hover:text-red-100 flex items-center justify-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

      </div>
      
      <div className="w-full border-t border-white/20" aria-hidden="true"></div>
    </header>
  );
}