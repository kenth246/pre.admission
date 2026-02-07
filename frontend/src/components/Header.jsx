import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Header({ username = "admin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // State for Notification Popup
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  // --- STATE FOR TABS (All vs Unread) ---
  const [activeTab, setActiveTab] = useState("all"); 

  const notifRef = useRef(null); 

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/admin");
  };
  const cancelLogout = () => setShowLogoutModal(false);

  // Helper to mark ALL as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // --- NEW FUNCTION: Mark SINGLE item as read when clicked ---
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isUnread: false } : n
    ));
  };

  // Close notification popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifRef]);

  // Helper for Navigation Links
  const getNavClass = (path) => {
    return location.pathname === path
      ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1"
      : "text-white font-medium hover:text-yellow-200 transition-colors pb-1";
  };

  const getIconClass = (path, isActionActive = false) => {
    const isActive = location.pathname === path || isActionActive;
    return isActive
      ? "text-yellow-300 bg-green-700 shadow-inner scale-110" 
      : "text-white hover:text-yellow-200 hover:bg-green-500"; 
  };

  const unreadCount = notifications.filter(n => n.isUnread).length;

  // --- FILTER LOGIC: Determines what is shown based on the active tab ---
  const displayedNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.isUnread);

  return (
    <>
      <header className="bg-green-600 text-white shadow-md w-full sticky top-0 z-50">
        <div className="w-full px-6 py-3 flex justify-between items-center">
          
          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/img/btech.png" alt="BTECH" className="h-10 w-10 object-contain" />
              <img src="/img/iiti.png" alt="IITI" className="h-10 w-10 object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold font-sans text-2xl tracking-wide">BTECH - IITI</h1>
              <p className="text-m font-medium opacity-90">Pre-Admission Management System</p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-6 lg:gap-8">
            <nav>
              <ul className="flex items-center gap-6 text-base lg:text-lg">
                <li><Link to="/dashboard" className={getNavClass('/dashboard')}>Dashboard</Link></li> 
                <li><Link to="/admin/applications" className={getNavClass('/applications')}>Applications</Link></li>        
                <li><Link to="/admin/assessment" className={getNavClass('/admin/assessment')}>Assessments</Link></li>   
                <li><Link to="/admin_exam" className={getNavClass('/admin_exam')}>Admission</Link></li>     
                <li><Link to="/admin_settings" className={getNavClass('/admin_settings')}>Settings</Link></li>
              </ul>
            </nav>

            <div className="h-8 w-px bg-white/40"></div>

            {/* User Controls */}
            <div className="flex items-center gap-4 relative" ref={notifRef}>
              
              {/* NOTIFICATIONS BUTTON */}
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 ${getIconClass(null, isNotifOpen)}`}
                title="View Notifications"
              >
                <i className="fa-solid fa-bell text-xl"></i>
                {unreadCount > 0 && (
                   <span className="absolute top-1 right-1 bg-red-500 h-2.5 w-2.5 rounded-full border border-green-600"></span>
                )}
              </button>

              {/* NOTIFICATION MODAL POPUP */}
              {isNotifOpen && (
                <div className="absolute top-12 right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 text-gray-800 border border-gray-200 overflow-hidden animation-fade-in-down">
                  {/* Header Section */}
                  <div className="p-4 border-b border-gray-100">
                    
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg text-black">All Notifications</h3>
                      <button 
                        onClick={() => {
                          setIsNotifOpen(false); 
                          navigate('/admin_settings', { state: { activeTab: 'notification' } });
                        }}
                        className="text-gray-500 hover:text-green-700 transition-colors p-1"
                        title="Notification Settings"
                      >
                          <FaCog className="text-lg" /> 
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-4">
                        {/* Tab Buttons */}
                        <button 
                          onClick={() => setActiveTab('all')}
                          className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'all' ? 'font-semibold text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}
                        >
                          All
                        </button>
                        <button 
                          onClick={() => setActiveTab('unread')}
                          className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'unread' ? 'font-semibold text-black bg-gray-100' : 'text-gray-500 hover:text-black'}`}
                        >
                          Unread
                        </button>
                      </div>
                      <button 
                        onClick={markAllAsRead}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  {/* Body / List */}
                  <div className="h-64 overflow-y-auto bg-white">
                    {displayedNotifications.length > 0 ? (
                      <ul>
                        {displayedNotifications.map((notif) => (
                          <li 
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)} /* Clicking marks as read */
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${notif.isUnread ? 'bg-blue-50/30' : 'bg-white'}`}
                          >
                             {/* Small Dot for Unread */}
                             <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${notif.isUnread ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                             
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                   <h4 className={`text-sm ${notif.isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                     {notif.title}
                                   </h4>
                                   <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-snug">{notif.message}</p>
                             </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <p className="text-lg text-black font-medium">
                          {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* PROFILE */}
              <Link 
                to="/admin_profile" 
                className={`h-10 w-10 rounded-full border-2 border-white flex items-center justify-center transition-all duration-200 ${getIconClass('/admin_profile')}`}
                title="View Profile"
              >
                <i className="fa-solid fa-user text-lg"></i>
              </Link>

              {/* LOGOUT */}
              <button 
                onClick={handleLogoutClick} 
                className="hover:text-yellow-300 transition-colors p-2"
                title="Logout"
              >
                <i className="fa-solid fa-right-from-bracket text-xl"></i>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Logout Modal  */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            
            <div className="flex justify-end gap-3">
              <button onClick={cancelLogout} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}