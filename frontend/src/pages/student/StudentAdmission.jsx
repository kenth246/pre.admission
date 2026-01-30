import React from 'react';
import { useNavigate } from "react-router-dom";
import StudentHeader from '../../components/student/StudentHeader.jsx';

function StudentAdmission() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-200 min-h-screen">
      <StudentHeader />

      <main>
        {/* Banner */}
        <div className="relative w-full overflow-hidden">
          <img 
            src="/img/cover.png" 
            alt="BTECH Students Banner" 
            className="w-full h-auto min-h-[140px] sm:min-h-[200px] md:min-h-[300px] object-cover block"
          />
          
          <div className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-r from-black/50 via-transparent to-transparent">
            <h2 className="text-white text-sm sm:text-xl md:text-4xl lg:text-5xl font-black tracking-tighter drop-shadow-xl uppercase italic leading-none">
              Pre-Admission
            </h2>
          </div>
        </div>

        {/* Header Text */}
        <div className="max-w-7xl mx-auto px-4 py-6 sm:p-8 lg:p-12">
           <div className="flex flex-col items-center justify-center relative z-10 text-center space-y-2">
            <h3 className="text-slate-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-wide drop-shadow-sm">
              READY TO BE A BTECHENYO?
            </h3>

            <h1 className="text-slate-700 text-sm sm:text-base md:text-lg lg:text-2xl font-medium tracking-tight max-w-2xl">
              Please choose your program classification to proceed with your application process.
            </h1>
           </div>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto p-5 pb-12">
              
          {/* Freshmen Card */}
          <div
            onClick={() => navigate("/profile")}
            className="cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white"
          >
            <div className="overflow-hidden h-48 sm:h-64 md:h-72">
              <img
                src="/img/freshmen.png"
                alt="Freshmen"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="bg-slate-900 text-xl sm:text-2xl text-white text-center py-3 font-semibold">
                Freshmen
            </div>
          </div>

          {/* Transferees Card */}
          <div
            onClick={() => navigate("/transferee_profile")}
            className="cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition bg-white"
          >
            <div className="overflow-hidden h-48 sm:h-64 md:h-72">
              <img
                src="/img/transferee.jpg"
                alt="Transferees"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="bg-slate-900 text-xl sm:text-2xl text-white text-center py-3 font-semibold">
                Transferees
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentAdmission;