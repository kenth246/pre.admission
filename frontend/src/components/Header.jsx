import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Header({ username = "admin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 1. Trigger the modal to open
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  //  logout
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/admin");
  };

  // 3. Close modal without logging out
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const getNavClass = (path) => {
    return location.pathname === path
      ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1"
      : "text-white font-medium hover:text-yellow-200 transition-colors pb-1";
  };

  return (
    <>
      <header className="bg-green-600 text-white shadow-md w-full relative z-40">
        <div className="w-full px-6 py-3 flex justify-between items-center">
          
          {/* LEFT SECTION: Logos & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/img/btech.png" alt="BTECH" className="h-10 w-10 object-contain" />
              <img src="/img/iiti.png" alt="IITI" className="h-10 w-10 object-contain" />
            </div>
            
            <div className="leading-tight">
              <h1 className="font-bold font-sans text-2xl tracking-wide">
                BTECH - IITI
              </h1>
              <p className="text-m sm:text-m font-medium opacity-90">
                Pre-Admission Management System
              </p>
            </div>
          </div>

          {/* RIGHT SECTION: Navigation & User Controls */}
          <div className="flex items-center gap-6 lg:gap-8">
            
            <nav>
              <ul className="flex items-center gap-6 text-base lg:text-lg">
                <li>
                  <Link to="/dashboard" className={getNavClass('/dashboard')}>Dashboard</Link>
                </li> 
                <li>
                  <Link to="/admin/applications" className={getNavClass('/admin/applications')}>Applications</Link>
                </li>        
                <li>
                  <Link to="/admin/assessment" className={getNavClass('/admin/assessment')}>Assessments</Link>
                </li>   
                <li>
                  <Link to="/admin_admission" className={getNavClass('/admin_admission')}>Admission</Link>
                </li>     
                <li>
                  <Link to="/settings" className={getNavClass('/settings')}>Settings</Link>
                </li>
              </ul>
            </nav>

            {/* Divider */}
            <div className="h-8 w-px bg-white/40"></div>

            {/* User Controls */}
            <div className="flex items-center gap-5">
              <i className="fa-regular fa-bell text-xl cursor-pointer hover:text-yellow-300 transition" title="Notifications"></i>
              
              <Link 
                to="/admin_profile" 
                className="h-9 w-9 rounded-full border-2 border-white flex items-center justify-center hover:bg-yellow-300 hover:text-green-700 transition"
                title={`View Profile (${username})`}
              >
                  <i className="fa-solid fa-user text-lg"></i>
              </Link>

              {/* Logout Button - Now opens the modal */}
              <button 
                onClick={handleLogoutClick} 
                className="hover:text-yellow-300 transition flex items-center gap-1"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket text-xl"></i>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-90 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 transform transition-all scale-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
