import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock data - in a real app, you would get these from your Auth Context or State
  const userProfile = {
    email: "applicant@example.com",
    profilePic: "https://tse1.mm.bing.net/th/id/OIP.MF9gLJdpuGPJdO8D7O8DmwHaHa?w=900&h=900&rs=1&pid=ImgDetMain&o=7&rm=3" 
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
    console.log("Logging out...");
    navigate("/student_login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-green-700 text-white shadow-md w-full relative">
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

        {/* Profile and Dropdown Section */}
        <div className="relative shrink-0 ml-1 sm:ml-4" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
          >
            <div className="hidden md:block text-right">
            </div>
            <img 
              src="https://waikikispecialistcentre.com.au/wp-content/uploads/2024/01/generic-photo.jpg"
              alt="Profile" 
              className="h-7 w-7 md:h-10 md:w-10 rounded-full border-2 border-white object-cover shadow-sm"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[100] transform origin-top-right transition-all">
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="text-[10px] text-gray-500 truncate">{userProfile.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
      
      <div className="w-full border-t border-white/20" aria-hidden="true"></div>
    </header>
  );
}