import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // Added import
import Header from "../../components/Header"; 
import api from "../../services/api";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Edit3, 
  Shield,
  Activity,
  FileArchive,
  Download,
  AlertTriangle,
  Trash2,
  Clock,
  User,
  CheckCircle,
  Loader2,
  Database,
  FileSpreadsheet,
  // NEW IMPORTS
  Bell,
  Mail,
  MessageSquare
} from "lucide-react";

export default function Settings() {
  const location = useLocation(); // Initialize hook
  const [activeTab, setActiveTab] = useState("general");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);

  // --- State for Data ---
  const defaultSettings = {
    systemName: "BTECH - IITI Pre-Admission System",
    schoolName: "Baliwag Polytechnic College (BTECH)",
    instituteName: "Institute of Information Technology and Innovation",
    admissionOpen: true,
    academicYear: "2025-2026",
    applicationDeadline: "2026-04-15",
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [securitySettings, setSecuritySettings] = useState({ twoFactorAuth: false });

  // --- NEW: Notification State ---
  const [notifSettings, setNotifSettings] = useState({
    emailNewApp: true,      // New application submitted
    emailAssessment: false, // Assessment completed by student
    emailInterview: true,   // Interview schedules
    sysDeadline: true,      // Deadline approaching alerts
    sysMaintenance: true,   // System maintenance alerts
    autoReply: true         // Send auto-acknowledgment to students
  });
  
  // Dummy Logs
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, user: "System", action: "System initialized", timestamp: new Date().toLocaleString(), status: "Success" },
    { id: 2, user: "Admin", action: "Updated School Name", timestamp: new Date().toLocaleString(), status: "Success" },
  ]);

  useEffect(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i < currentYear + 20; i++) {
      years.push(`${i}-${i + 1}`);
    }
    setAcademicYears(years);
  }, []);

  // --- NEW EFFECT: Handle Navigation from Header ---
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      // Optional: Clear state to prevent sticking if user navigates back/forth (depending on preference)
      // window.history.replaceState({}, document.title)
    }
  }, [location]);

  // --- Logic Helpers ---
  const logAction = (action, status = "Success", user = "Admin (You)") => {
    const newLog = {
      id: Date.now(),
      user,
      action,
      timestamp: new Date().toLocaleString(),
      status,
    };
    setActivityLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // --- Action Handlers ---

  const handleToggleAdmission = () => {
    const newState = !settings.admissionOpen;
    setSettings(prev => ({ ...prev, admissionOpen: newState }));
    logAction(`Changed Admission Status to ${newState ? "OPEN" : "CLOSED"}`);
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleDateChange = (dateString) => {
    setSettings({ ...settings, applicationDeadline: dateString });
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsEditingProfile(false);
      setIsLoading(false);
      logAction("Updated System Configuration");
      alert("Settings saved successfully!");
    }, 800);
  };

  const handleToggle2FA = () => {
    const newState = !securitySettings.twoFactorAuth;
    setSecuritySettings(prev => ({ ...prev, twoFactorAuth: newState }));
    logAction(`${newState ? "Enabled" : "Disabled"} Two-Factor Authentication`);
  };

  // --- NEW: Notification Toggle Handler ---
  const handleNotifToggle = (key) => {
    const newState = !notifSettings[key];
    setNotifSettings(prev => ({ ...prev, [key]: newState }));
    // Optional: Log specific changes if needed, or just save quietly
    // logAction(`Updated Notification Setting: ${key}`); 
  };

  const handleArchive = () => {
    if(!window.confirm("Are you sure you want to archive old records?")) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      logAction("Archived previous academic year records");
      alert("Data successfully archived.");
    }, 1500);
  };

  const handleClearLogs = () => {
    if (activityLogs.length === 0) return;
    const confirm = window.confirm("Are you sure you want to clear all activity logs? This action cannot be undone.");
    if (confirm) {
        setActivityLogs([]);
    }
  };

  const generateBackup = (format) => {
    setIsLoading(true);
    
    setTimeout(() => {
      let content = "";
      let mimeType = "";
      let extension = "";
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      if (format === 'sql') {
        extension = "sql";
        mimeType = "application/sql";
        content = `
-- BTECH System Backup
-- Generated: ${new Date().toLocaleString()}
UPDATE system_config SET admission_status = ${settings.admissionOpen ? 1 : 0};
COMMIT;
        `;
      } else if (format === 'csv') {
        extension = "csv";
        mimeType = "text/csv";
        const headers = ["Log ID", "User", "Action", "Timestamp", "Status"];
        const rows = activityLogs.map(log => 
          [log.id, `"${log.user}"`, `"${log.action}"`, `"${log.timestamp}"`, log.status]
        );
        content = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `btech_backup_${timestamp}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logAction(`Generated system backup (${format.toUpperCase()} format)`);
      setIsLoading(false);
    }, 1000); 
  };

  const handleSystemReset = () => {
    const confirmed = window.confirm("⚠️ DANGER: SYSTEM RESET\n\nThis will clear ALL active data.\nProceed?");
    if (confirmed) {
       const doubleCheck = prompt("Type 'RESET' to confirm:");
       if(doubleCheck === "RESET") {
         setIsLoading(true);
         setTimeout(() => {
           setSettings(defaultSettings);
           setSecuritySettings({ twoFactorAuth: false });
           setNotifSettings({ emailNewApp: true, emailAssessment: false, emailInterview: true, sysDeadline: true, sysMaintenance: true, autoReply: true });
           setActivityLogs([]);
           logAction("PERFORMED FULL SYSTEM RESET", "Success", "Super Admin");
           setIsLoading(false);
           alert("System reset complete.");
         }, 1500);
       } else {
         alert("Incorrect code.");
       }
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen font-sans">
      <Header username="Admin" />

      <main className="max-w-[1600px] mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">SETTINGS</h1>
          <p className="text-gray-600">System configuration and preferences</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 min-h-[600px] relative">
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 z-50 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
              <Loader2 className="animate-spin text-green-600 mb-2" size={48} />
              <p className="font-bold text-gray-700 animate-pulse">Processing...</p>
            </div>
          )}

          {/* Navigation Tabs - UPDATED */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap border border-gray-400 rounded-lg sm:rounded-full overflow-hidden w-full max-w-4xl shadow-sm bg-white">
              {['General Settings', 'Notification Settings', 'Security & Logs', 'System Maintenance'].map((tab, idx) => {
                const key = tab.split(' ')[0].toLowerCase();
                const actualKey = key === 'system' ? 'maintenance' : key === 'security' ? 'security' : key; 
                
                return (
                  <button
                    key={actualKey}
                    onClick={() => setActiveTab(actualKey)}
                    className={`flex-1 py-2 px-2 sm:px-4 text-center font-bold text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap ${
                      activeTab === actualKey
                        ? "bg-green-600 text-white"
                        : "bg-white text-black hover:bg-gray-50 " + (idx > 0 ? "border-l border-gray-400" : "")
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>
          </div>

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-black mb-1">System Profile</h2>
                <hr className="border-gray-300 mb-6" />
                
                <div className="space-y-5">
                  <InputGroup label="System Name">
                    <input
                      type="text"
                      name="systemName"
                      value={settings.systemName}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className={`w-full border rounded-lg px-4 py-2 outline-none transition-colors ${
                        isEditingProfile ? "border-green-500 bg-white focus:ring-2 focus:ring-green-200" : "border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </InputGroup>
                  <InputGroup label="School Name">
                    <input
                      type="text"
                      name="schoolName"
                      value={settings.schoolName}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className={`w-full border rounded-lg px-4 py-2 outline-none transition-colors ${
                        isEditingProfile ? "border-green-500 bg-white focus:ring-2 focus:ring-green-200" : "border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </InputGroup>
                  <InputGroup label="Institute Name">
                    <input
                      type="text"
                      name="instituteName"
                      value={settings.instituteName}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      className={`w-full border rounded-lg px-4 py-2 outline-none transition-colors ${
                        isEditingProfile ? "border-green-500 bg-white focus:ring-2 focus:ring-green-200" : "border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                      }`}
                    />
                  </InputGroup>

                  <div className="pt-2">
                    <button 
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className={`flex items-center gap-2 font-bold py-2 px-8 rounded shadow transition-colors ${
                        isEditingProfile ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {isEditingProfile ? "Cancel Editing" : <><Edit3 size={16}/> Edit</>}
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-300 my-8" />

              <div className={`rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors duration-500 ${settings.admissionOpen ? 'bg-gray-200' : 'bg-red-50 border border-red-100'}`}>
                <div>
                  <h3 className="font-bold text-xl text-black mb-1">Admission Portal Status</h3>
                  <p className="text-gray-700">Currently <strong className={settings.admissionOpen ? "text-green-700" : "text-red-600"}>{settings.admissionOpen ? "OPEN" : "CLOSED"}</strong> for new applicants.</p>
                </div>
                <button 
                  onClick={handleToggleAdmission}
                  className={`relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none shadow-inner ${
                    settings.admissionOpen ? 'bg-green-600' : 'bg-gray-400'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${settings.admissionOpen ? 'translate-x-10' : 'translate-x-0'}`}>
                    <div className={`w-2 h-2 rounded-full ${settings.admissionOpen ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6">
                <div className="space-y-2">
                  <label className="font-bold text-black text-lg">Current Academic Year:</label>
                  <div className="relative">
                    <select
                      name="academicYear"
                      value={settings.academicYear}
                      onChange={handleChange}
                      className="w-full appearance-none border border-black rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-600 cursor-pointer"
                    >
                      {academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700"><ChevronRight className="rotate-90" size={20} /></div>
                  </div>
                </div>
                <div className="space-y-2 relative z-50">
                  <label className="font-bold text-black text-lg">Application Deadline:</label>
                  <CustomDatePicker selectedDate={settings.applicationDeadline} onChange={handleDateChange} />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 mt-6">
                 <button 
                   onClick={handleSave}
                   className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg shadow-md active:scale-95 transition-transform"
                 >
                   <Save size={20} /> Save Configuration
                 </button>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS  */}
          {activeTab === "notification" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-black mb-1 flex items-center gap-2">
                  <Bell className="text-green-700" size={24}/> Notification Preferences
                </h2>
                <hr className="border-gray-300 mb-6 mt-2" />
                
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-10">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                      {/* Toggle Item */}
                      <div className="flex justify-between items-center">
                        <div className="pr-4">
                          <p className="font-bold text-gray-800">New Application Received</p>
                          <p className="text-xs text-gray-500">Get notified when a new applicant submits an application.</p>
                        </div>
                        <ToggleSwitch checked={notifSettings.emailNewApp} onChange={() => handleNotifToggle('emailNewApp')} />
                      </div>
                      
                      <hr className="border-gray-200"/>

                      <div className="flex justify-between items-center">
                        <div className="pr-4">
                          <p className="font-bold text-gray-800">BCET Completion</p>
                          <p className="text-xs text-gray-500">Get notified when a student completes the BCET.</p>
                        </div>
                        <ToggleSwitch checked={notifSettings.emailBCET} onChange={() => handleNotifToggle('emailBCET')} />
                      </div>

                       <hr className="border-gray-200"/>

                      <div className="flex justify-between items-center">
                        <div className="pr-4">
                          <p className="font-bold text-gray-800">Pre-Admission Deadline</p>
                          <p className="text-xs text-gray-500">Reminders for end of admission period</p>
                        </div>
                        <ToggleSwitch checked={notifSettings.emailInterview} onChange={() => handleNotifToggle('emailInterview')} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>


               <div className="pt-4 border-t border-gray-100 mt-2 flex justify-end">
                 <button 
                   onClick={() => { logAction("Saved Notification Preferences"); alert("Notification settings updated."); }}
                   className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
                 >
                   Save Preferences
                 </button>
              </div>

            </div>
          )}

          {/* TAB 3: SECURITY & LOGS */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-black mb-1 flex items-center gap-2">
                  <Shield className="text-green-700" size={24}/> Security Settings
                </h2>
                <hr className="border-gray-300 mb-6 mt-2" />
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-gray-600 mt-1">Require verification code for Admin login.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${securitySettings.twoFactorAuth ? "text-green-700" : "text-gray-500"}`}>{securitySettings.twoFactorAuth ? "ENABLED" : "DISABLED"}</span>
                    <ToggleSwitch checked={securitySettings.twoFactorAuth} onChange={handleToggle2FA} />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-xl font-bold text-black flex items-center gap-2">
                    <Activity className="text-green-700" size={24}/> Activity Logs
                  </h2>
                  {activityLogs.length > 0 && (
                    <button 
                      onClick={handleClearLogs}
                      className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition-colors hover:bg-red-50 px-3 py-1 rounded"
                    >
                      <Trash2 size={16} /> Clear All
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm max-h-[500px] overflow-y-auto mt-4">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-100 z-10">
                      <tr className="text-gray-700 text-sm uppercase tracking-wide">
                        <th className="p-4 font-bold border-b">User</th>
                        <th className="p-4 font-bold border-b">Action</th>
                        <th className="p-4 font-bold border-b">Date & Time</th>
                        <th className="p-4 font-bold border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {activityLogs.length > 0 ? (
                        activityLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                            <td className="p-4 text-gray-800 font-medium flex items-center gap-2"><div className="bg-gray-200 p-1 rounded-full"><User size={14}/></div>{log.user}</td>
                            <td className="p-4 text-gray-600">{log.action}</td>
                            <td className="p-4 text-gray-500 text-sm flex items-center gap-2"><Clock size={14}/> {log.timestamp}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {log.status === 'Success' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>} {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500 italic">
                            No activity logs found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM MAINTENANCE */}
          {activeTab === "maintenance" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-black mb-1">System Maintenance</h2>
                <hr className="border-gray-300 my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Archiving */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600"><FileArchive size={24} /></div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Data Archiving</h3>
                    <p className="text-sm text-gray-600 mb-6 h-12">Move "finalized" applicant data to history database.</p>
                    <button onClick={handleArchive} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <FileArchive size={18} /> Archive Records
                    </button>
                  </div>

                  {/* Backup Generator */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600"><Download size={24} /></div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Backup Generator</h3>
                    <p className="text-sm text-gray-600 mb-4 h-12">Generate  copies of the system database.</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => generateBackup('sql')}
                        className="flex flex-col items-center justify-center py-3 px-2 border-2 bg-green-600 border-green-600 text-white rounded-lg h transition-colors"
                      >
                        <Database size={20} className="mb-1"/>
                        <span className="font-bold text-xs">Download SQL</span>
                      </button>
                      <button 
                        onClick={() => generateBackup('csv')}
                        className="flex flex-col items-center justify-center py-3 px-2 border-2 bg-green-600 border-green-600 text-white rounded-lg transition-colors"
                      >
                        <FileSpreadsheet size={20} className="mb-1"/>
                        <span className="font-bold text-xs">Download CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-8 border border-red-200 bg-red-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0"><AlertTriangle size={24} /></div>
                  <div>
                    <h3 className="text-red-700 font-bold text-lg">System Reset</h3>
                    <p className="text-red-600/80 text-sm mt-1 mb-4">Clear all active data for a new academic year. </p>
                    <button onClick={handleSystemReset} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-colors">
                      <Trash2 size={18} /> Reset System Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// --- Helper Components --- 

function InputGroup({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="block font-bold text-gray-800 text-base">{label}</label>
      {children}
    </div>
  );
}

//  TOGGLE SWITCH COMPONENT
function ToggleSwitch({ checked, onChange, color = "green" }) {
  const bgColor = checked 
    ? (color === 'blue' ? 'bg-blue-600' : 'bg-[#1ca81c]')
    : 'bg-gray-300';
    
  return (
    <button 
      onClick={onChange}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${bgColor}`}
    >
      <span className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}/>
    </button>
  );
}

function CustomDatePicker({ selectedDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dateRef = useRef(null);
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewDate, setViewDate] = useState(initialDate); 
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dateRef]);

  const handleDayClick = (day) => {
    const month = (viewDate.getMonth() + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    onChange(`${viewDate.getFullYear()}-${month}-${d}`);
    setIsOpen(false);
  };

  const renderDays = () => {
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const isSelected = selectedDate === dateString;
      days.push(
        <button key={i} onClick={() => handleDayClick(i)} className={`h-9 w-9 text-sm rounded-full flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-[#1ca81c] text-white font-bold shadow-md" : "hover:bg-green-100 text-gray-700"}`}>{i}</button>
      );
    }
    return days;
  };

  return (
    <div className="relative w-full" ref={dateRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between w-full border border-black rounded-lg px-4 py-3 bg-white cursor-pointer transition-all ${isOpen ? 'ring-2 ring-green-500 border-transparent' : 'hover:border-green-600'}`}>
        <span className="text-gray-800 font-medium">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Select Date"}</span>
        <CalendarIcon size={20} className="text-gray-600" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl p-4 w-[340px] z-50 animate-fade-in-up">
          <div className="flex justify-between items-center mb-4 px-1">
             <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
             <div className="font-bold">{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
             <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 place-items-center mb-2">{renderDays()}</div>
        </div>
      )}
    </div>
  );
}