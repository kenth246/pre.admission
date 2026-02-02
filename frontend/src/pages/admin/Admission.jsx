import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header.jsx';
import api from '../../services/api';
import { FaSearch, FaFilter, FaEye, FaPlus, FaTimes, FaFileDownload, FaSearchPlus, FaSearchMinus, FaRedo } from "react-icons/fa"; 
import { FileText, CheckCircle, XCircle } from "lucide-react"; 

export default function Admission() {
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  // --- PREVIEW STATE ---
  const [previewDoc, setPreviewDoc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0.8); // Default to 80% width

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState(""); 
  const filterRef = useRef(null);

  // --- REAL DATABASE STATE ---
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH FROM BACKEND ---
  const fetchApplicants = async () => {
    try {
        setLoading(true);
        const res = await api.get('/admin/applicants');
        const mappedData = res.data.map(app => {
            const p = app.profile || {}; 
            const pers = app.profile?.personal || {}; 
            const edu = app.profile?.education || {};
            const fam = app.profile?.family || {};
            const assess = app.assessment || {};

            return {
                id: app.id || app._id || "N/A",
                _id: app._id,
                name: app.name || "UNKNOWN",
                type: app.type || "Freshmen",
                location: app.location || "UNKNOWN",
                date: app.date || new Date().toLocaleDateString(),
                status: app.status || "Pending",
                
                // Assessment Data
                assessment: {
                    interviewScore: assess.interviewScore || "",
                    interviewStatus: assess.interviewStatus || "Pending",
                    bcetScore: assess.bcetScore || "",
                    bcetStatus: assess.bcetStatus || "Pending"
                },

                // Profile Data
                profile: {
                    personal: {
                        image: pers.image || null,
                        firstName: pers.firstName || "", 
                        middleName: pers.middleName || "", 
                        surname: pers.surname || "", 
                        suffix: pers.suffix || "N/A",
                        dob: pers.dob || "", 
                        pob: pers.pob || "", 
                        gender: pers.gender || "MALE", 
                        email: pers.email || "",
                        civilStatus: pers.civilStatus || "SINGLE", 
                        contact: pers.contact || "", 
                        address: pers.address || ""
                    },
                    family: {
                        fatherName: fam.fatherName || "", 
                        fatherOcc: fam.fatherOcc || "", 
                        fatherContact: fam.fatherContact || "",
                        motherName: fam.motherName || "", 
                        motherOcc: fam.motherOcc || "", 
                        motherContact: fam.motherContact || "",
                        guardianName: fam.guardianName || "N/A", 
                        guardianOcc: fam.guardianOcc || "N/A", 
                        guardianContact: fam.guardianContact || "N/A",
                        siblings: fam.siblings || "0", 
                        income: fam.income || ""
                    },
                    education: {
                        lrn: edu.lrn || "",
                        gwa: edu.gwa || "",
                        elementary: edu.elementary || "", 
                        elemAddr: edu.elemAddr || "", 
                        elemType: edu.elemType || "PUBLIC", 
                        elemYear: edu.elemYear || "",
                        jhs: edu.jhs || "", 
                        jhsAddr: edu.jhsAddr || "", 
                        jhsType: edu.jhsType || "PUBLIC", 
                        jhsYear: edu.jhsYear || "",
                        shs: edu.shs || "", 
                        shsAddr: edu.shsAddr || "", 
                        shsType: edu.shsType || "PUBLIC", 
                        shsYear: edu.shsYear || "",
                        lastSchool: edu.lastSchool || "", 
                        lastSchoolAddr: edu.lastSchoolAddr || "", 
                        lastSchoolType: edu.lastSchoolType || ""
                    },
                    documents: app.profile?.documents || []
                }
            };
        });

        setApplicants(mappedData);
    } catch (err) {
        console.error("Error fetching applicants:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // --- NEW APPLICANT STATE ---
  const [newApplicant, setNewApplicant] = useState({
    type: "Freshmen",
    assessment: {
      interviewScore: "",
      interviewStatus: "Pending",
      bcetScore: "",
      bcetStatus: "Pending"
    },
    profile: {
      personal: { firstName: "", middleName: "", surname: "", suffix: "", dob: "", pob: "", gender: "MALE", email: "", civilStatus: "SINGLE", contact: "", address: "" },
      family: { fatherName: "", fatherOcc: "", fatherContact: "", motherName: "", motherOcc: "", motherContact: "", guardianName: "", guardianOcc: "", guardianContact: "", siblings: "", income: "" },
      education: { lrn: "", gwa: "", elementary: "", elemAddr: "", elemType: "PUBLIC", elemYear: "", jhs: "", jhsAddr: "", jhsType: "PUBLIC", jhsYear: "", shs: "", shsAddr: "", shsType: "PUBLIC", shsYear: "", lastSchool: "", lastSchoolAddr: "", lastSchoolType: "" }
    }
  });

  // --- ZOOM HANDLERS ---
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3.0)); // +20%
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.2)); // -20%
  const handleResetZoom = () => setZoomLevel(0.8); // Reset to 80% width

  // Reset Zoom when opening a new document
  const openPreview = (doc) => {
    // Handle relative backend URLs
    let url = doc.url;
    if (url && !url.startsWith('http') && !url.startsWith('blob')) {
        url = `http://localhost:5000${url}`; 
    }
    setPreviewDoc({ ...doc, url });
    setZoomLevel(0.8); 
  };

  const handleInputChange = (section, field, value) => {
    setNewApplicant(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [section]: {
          ...prev.profile[section],
          [field]: value
        }
      }
    }));
  };

  const handleAssessmentChange = (field, value) => {
    setNewApplicant(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        [field]: value
      }
    }));
  };

  // --- SAVE TO DATABASE ---
  const handleAddSubmit = async () => {
    try {
        const status = (newApplicant.assessment.interviewStatus === "Passed" && newApplicant.assessment.bcetStatus === "Passed") ? "Passed" : "Failed";

        // Payload for Backend
        const payload = {
            firstName: newApplicant.profile.personal.firstName,
            lastName: newApplicant.profile.personal.surname,
            type: newApplicant.type,
            status: status,
            // Pass full profile structure
            profile: newApplicant.profile,
            assessment: newApplicant.assessment
        };

        // Send to Backend
        await api.post('/admin/applicant/add', payload); 
        
        // Refresh List
        fetchApplicants();
        setIsAddModalOpen(false);

        // Reset form
        setNewApplicant({
            type: "Freshmen",
            assessment: { interviewScore: "", interviewStatus: "Pending", bcetScore: "", bcetStatus: "Pending" },
            profile: {
            personal: { firstName: "", middleName: "", surname: "", suffix: "", dob: "", pob: "", gender: "MALE", email: "", civilStatus: "SINGLE", contact: "", address: "" },
            family: { fatherName: "", fatherOcc: "", fatherContact: "", motherName: "", motherOcc: "", motherContact: "", guardianName: "", guardianOcc: "", guardianContact: "", siblings: "", income: "" },
            education: { lrn: "", gwa: "", elementary: "", elemAddr: "", elemType: "PUBLIC", elemYear: "", jhs: "", jhsAddr: "", jhsType: "PUBLIC", jhsYear: "", shs: "", shsAddr: "", shsType: "PUBLIC", shsYear: "", lastSchool: "", lastSchoolAddr: "", lastSchoolType: "" }
            }
        });
        alert("Applicant added successfully!");
    } catch (err) {
        console.error("Failed to add applicant", err);
        alert("Failed to save applicant. Please try again.");
    }
  };

const filteredApplicants = applicants.filter((a) => {
    // 1. Safe Variable Access
    const id = a.id || "";
    const name = a.name || "";
    const type = a.type || "";
    const location = a.location || "";
    const status = (a.status || "").toLowerCase();

    // 2. Search Query Logic
    const searchText = `${id} ${name} ${type} ${status}`.toLowerCase();
    if (searchQuery && !searchText.includes(searchQuery.toLowerCase())) return false;

    // 3. Type Filter (Freshmen, Transferees)
    if (typeFilter && type !== typeFilter) return false;

    // 4. Location Filter
    if (locationFilter && !location.includes(locationFilter)) return false; 

    // 5. STATUS FILTERING
    if (statusFilter) {
        const filter = statusFilter.toLowerCase();

        if (filter === "passed") {
            if (!status.includes("passed") && !status.includes("admitted")) return false;
        } 
        else if (filter === "failed") {
            if (!status.includes("failed")) return false;
        } 
        else if (filter === "pending") {
            if (!status.includes("pending")) return false;
        }
        else {
            if (status !== filter) return false;
        }
    }

    return true;
  });

  const locations = [...new Set(applicants.map(a => a.location))];

  const DataBox = ({ label, value }) => (
    <div>
      <div className="text-[11px] font-bold text-gray-700 uppercase">{label}</div>
      <div className="mt-1 bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 flex items-center shadow-sm truncate">
        {value || ""}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-200 h-screen flex flex-col overflow-hidden font-sans">
      <Header username="admin" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">Admissions</h2>
              <p className="text-gray-600">Finalize admission status and review qualification results</p>
            </div>
          </div>

          <div className="flex gap-3 mb-4 items-center">
            {/* SEARCH */}
            <div className="relative">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search applicant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-xl rounded-lg bg-white border border-white w-92 outline-none shadow-sm"
              />
            </div>

            {/* FILTER */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter((v) => !v)}
                className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 font-semibold"
              >
                <FaFilter /> Filter
              </button>

              {showFilter && (
                <div className="absolute left-0 mt-2 bg-white border rounded shadow-xl p-3 w-52 z-30">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full mb-3 p-2 border rounded text-sm outline-none"
                  >
                    <option value="">All</option>
                    <option value="Freshmen">Freshmen</option>
                    <option value="Transferee">Transferees</option>
                  </select>

                  {/* Added Location Filter */}
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full mb-3 p-2 border rounded text-sm outline-none"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>

				<label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full mb-3 p-2 border rounded text-sm outline-none"
                  >
                    <option value="">All</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option> {/* Added this option */}
                  </select>

                  <div className="flex justify-between">
                    <button onClick={() => setShowFilter(false)} className="px-3 py-1 bg-green-700 text-white rounded text-xs font-bold">Apply</button>
                    <button onClick={() => { setTypeFilter(""); setLocationFilter(""); setStatusFilter(""); setSearchQuery(""); }} className="px-3 py-1 bg-gray-100 rounded text-xs font-bold">Clear</button>
                  </div>
                </div>
              )}
            </div>

            {/* ADD APPLICANT BUTTON */}
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase flex items-center gap-2 hover:bg-green-800 transition-all shadow-md active:scale-95 ml-auto"
            >
                <FaPlus /> Add Applicant
            </button>
          </div>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          <div className="overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-white sticky top-0 z-20">
                <tr className="text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left text-lg font-bold pl-6">ID</th>
                  <th className="px-7 py-3 text-lg text-left font-bold">Applicant Name</th>
                  <th className="px-4 py-3 text-lg text-left font-bold">Type</th>
                  <th className="px-4 py-3 text-lg text-left font-bold">Location</th> 
                  <th className="px-4 py-3 text-lg text-center font-bold">Date</th>
                  <th className="px-4 py-3 text-lg text-center font-bold">Status</th>
                  <th className="px-4 py-3 text-lg text-center font-bold pr-8">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading Applicants...</td></tr>
                ) : filteredApplicants.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    {/* SAFE ID CHECK TO PREVENT SUBSTRING CRASH */}
                    <td className="py-2 pl-6 text-sm text-gray-500 font-medium">
                        {(a.id || "").toString().length > 8 ? (a.id || "").toString().substring(0, 8) + '...' : (a.id || "N/A")}
                    </td>
                    <td className="px-7 py-2 text-sm text-gray-900 font-medium">{a.name}</td>
                    <td className="px-4 py-2 text-sm uppercase text-gray-600">{a.type}</td>
                    <td className="px-4 py-2 text-sm uppercase text-gray-600">{a.location}</td> 
                    <td className="px-4 py-2 text-sm text-gray-600 text-center">{a.date}</td>
                    
                    <td className="px-4 py-2 text-center">
                      <span className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border ${
                        a.status === "Passed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : a.status === "Failed"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }`}>
                        {a.status}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-center pr-6">
                      <button 
                        onClick={() => { setSelectedApplicant(a); setIsModalOpen(true); }} 
                        className="text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                
                {!loading && filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400 italic">No applicants found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- ADD APPLICANT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-11/12 max-w-[1200px] z-10 flex flex-col max-h-[90vh] overflow-hidden">
            {/* ... Add Applicant Form Content (Same as previous) ... */}
            <div className="flex items-center justify-between rounded-t-2xl bg-green-700 text-white px-6 py-4 shrink-0">
              <h3 className="font-bold text-lg uppercase">Add New Applicant</h3>
              <button className="text-white text-3xl font-bold" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 bg-gray-100">
               {/* ADD FORM FIELDS (Collapsed for brevity - unchanged) */}
               {/* PERSONAL INFORMATION */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-black text-green-700 uppercase">Personal Information</div>
                    {/* Applicant Type Dropdown */}
                    <select 
                        value={newApplicant.type}
                        onChange={(e) => setNewApplicant({...newApplicant, type: e.target.value})}
                        className="bg-gray-50 border border-gray-400 text-sm font-bold rounded px-3 py-1 outline-none uppercase"
                    >
                        <option value="Freshmen">Freshmen</option>
                        <option value="Transferees">Transferees</option>
                    </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">First Name</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.firstName} onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Middle Name</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.middleName} onChange={(e) => handleInputChange('personal', 'middleName', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Surname</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.surname} onChange={(e) => handleInputChange('personal', 'surname', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Suffix</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.suffix} onChange={(e) => handleInputChange('personal', 'suffix', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
                        <input type="date" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.dob} onChange={(e) => handleInputChange('personal', 'dob', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Place of Birth</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.pob} onChange={(e) => handleInputChange('personal', 'pob', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Gender</label>
                        <select className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.gender} onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}>
                            <option value="MALE">SELECT GENDER</option>
                            <option value="MALE">MALE</option>
                            <option value="FEMALE">FEMALE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Civil Status</label>
                        <select className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.civilStatus} onChange={(e) => handleInputChange('personal', 'civilStatus', e.target.value)}>
                            <option value="SINGLE">SELECT STATUS</option>
                            <option value="SINGLE">SINGLE</option>
                            <option value="MARRIED">MARRIED</option>
                            <option value="SEPARATED">SEPARATED</option>
                            <option value="WIDOWED">WIDOWED</option>
                            
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Email Address</label>
                        <input type="email" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.email} onChange={(e) => handleInputChange('personal', 'email', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contact Number</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.contact} onChange={(e) => handleInputChange('personal', 'contact', e.target.value)} />
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Residential Address</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.personal.address} onChange={(e) => handleInputChange('personal', 'address', e.target.value)} />
                    </div>
                </div>
              </div>

              {/* FAMILY */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Family Information</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Father */}
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Father's Name</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.fatherName} onChange={(e) => handleInputChange('family', 'fatherName', e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Occupation</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.fatherOcc} onChange={(e) => handleInputChange('family', 'fatherOcc', e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contact</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.fatherContact} onChange={(e) => handleInputChange('family', 'fatherContact', e.target.value)} />
                  </div>
                  
                  {/* Mother */}
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Mother's Name</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.motherName} onChange={(e) => handleInputChange('family', 'motherName', e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Occupation</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.motherOcc} onChange={(e) => handleInputChange('family', 'motherOcc', e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contact</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.motherContact} onChange={(e) => handleInputChange('family', 'motherContact', e.target.value)} />
                  </div>

                  {/* Guardian */}
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Guardian's Name</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.guardianName} onChange={(e) => handleInputChange('family', 'guardianName', e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Occupation</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.guardianOcc} onChange={(e) => handleInputChange('family', 'guardianOcc', e.target.value)} />
                  </div>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Contact</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.guardianContact} onChange={(e) => handleInputChange('family', 'guardianContact', e.target.value)} />
                  </div>

                  <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Number of Siblings</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.siblings} onChange={(e) => handleInputChange('family', 'siblings', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Monthly Family Income</label>
                      <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                          value={newApplicant.profile.family.income} onChange={(e) => handleInputChange('family', 'income', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* EDUCATION */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Education Profile</div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-gray-100">
                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">LRN/ Student Number</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.lrn} onChange={(e) => handleInputChange('education', 'lrn', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">General Weighted Average (GWA)</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.gwa} onChange={(e) => handleInputChange('education', 'gwa', e.target.value)} />
                    </div>
                  </div>
                  
                  {/* Elementary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Elementary</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.elementary} onChange={(e) => handleInputChange('education', 'elementary', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.elemAddr} onChange={(e) => handleInputChange('education', 'elemAddr', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Type</label>
                        <select className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.elemType} onChange={(e) => handleInputChange('education', 'elemType', e.target.value)}>
                            <option value="MALE">SELECT TYPE</option>
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="PRIVATE">PRIVATE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Year Graduated</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.elemYear} onChange={(e) => handleInputChange('education', 'elemYear', e.target.value)} />
                    </div>
                  </div>

                  {/* Junior High */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Junior High School</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.jhs} onChange={(e) => handleInputChange('education', 'jhs', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.jhsAddr} onChange={(e) => handleInputChange('education', 'jhsAddr', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Type</label>
                        <select className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.jhsType} onChange={(e) => handleInputChange('education', 'jhsType', e.target.value)}>
                            <option value="MALE">SELECT TYPE</option>
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="PRIVATE">PRIVATE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Year Graduated</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.jhsYear} onChange={(e) => handleInputChange('education', 'jhsYear', e.target.value)} />
                    </div>
                  </div>

                  {/* Senior High Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Senior High School</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.shs} onChange={(e) => handleInputChange('education', 'shs', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.shsAddr} onChange={(e) => handleInputChange('education', 'shsAddr', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Type</label>
                        <select className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.shsType} onChange={(e) => handleInputChange('education', 'shsType', e.target.value)}>
                            <option value="MALE">SELECT TYPE</option>
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="PRIVATE">PRIVATE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Year Graduated</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.shsYear} onChange={(e) => handleInputChange('education', 'shsYear', e.target.value)} />
                    </div>
                  </div>

                  {/* Transferee Fields */}
                  {newApplicant.type === "Transferees" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Last School Attended</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.lastSchool} onChange={(e) => handleInputChange('education', 'lastSchool', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Address</label>
                        <input type="text" className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.lastSchoolAddr} onChange={(e) => handleInputChange('education', 'lastSchoolAddr', e.target.value)} />
                      </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Type</label>
                        <select className="w-full bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 outline-none focus:border-green-600" 
                            value={newApplicant.profile.education.lastSchoolType} onChange={(e) => handleInputChange('education', 'lastSchoolType', e.target.value)}>
                            <option value="MALE">SELECT TYPE</option>
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="PRIVATE">PRIVATE</option>
                        </select>
                    </div>
                    </div>
                  )}
                </div>
              </div>

              {/* --- ASSESSMENT RESULTS INPUT SECTION --- */}
              <div className="bg-white rounded-xl p-6 shadow-md relative overflow-hidden">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Assessment Results</div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Interview Result */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Initial Interview</span>
                            <select 
                                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border border-gray-300 outline-none"
                                value={newApplicant.assessment.interviewStatus}
                                onChange={(e) => handleAssessmentChange('interviewStatus', e.target.value)}
                            >
                                <option value="Pending">Remarks</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <input 
                            type="number"
                            placeholder="Score"
                            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-3xl font-black text-gray-800 outline-none focus:border-green-600"
                            value={newApplicant.assessment.interviewScore}
                            onChange={(e) => handleAssessmentChange('interviewScore', e.target.value)}
                        />
                    </div>

                    {/* BCET Result */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Entrance Test (BCET)</span>
                            <select 
                                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border border-gray-300 outline-none"
                                value={newApplicant.assessment.bcetStatus}
                                onChange={(e) => handleAssessmentChange('bcetStatus', e.target.value)}
                            >
                                <option value="Pending">Remarks</option>
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <input 
                            type="text"
                            placeholder="Score (eg. 50/50)"
                            className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-3xl font-black text-gray-800 outline-none focus:border-green-600"
                            value={newApplicant.assessment.bcetScore}
                            onChange={(e) => handleAssessmentChange('bcetScore', e.target.value)}
                        />
                    </div>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-400 rounded-b-2xl shrink-0 flex justify-end gap-3">
              <button className="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 font-bold uppercase text-xs hover:bg-gray-400" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              <button className="px-8 py-2 rounded-lg bg-green-700 text-white font-bold uppercase text-xs hover:bg-green-800" onClick={handleAddSubmit}>Save Applicant</button>
            </div>
          </div>
        </div>
      )}

      {/* --- APPLICANT DETAILS MODAL --- */}
      {isModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-11/12 max-w-[1200px] z-10 flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between rounded-t-2xl bg-green-700 text-white px-6 py-4 shrink-0">
              <h3 className="font-bold text-lg uppercase">Applicant Details</h3>
              <button className="text-white text-3xl font-bold" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            {/* Content  */}
            <div className="p-6 overflow-y-auto space-y-6 bg-gray-100">
              
              {/* PERSONAL INFORMATION */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Personal Information</div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="text-[11px] font-bold text-gray-700 uppercase mb-1">Applicant Picture</div>
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center overflow-hidden relative">
                      {selectedApplicant.profile.personal.image ? (
                        <img 
                          src={selectedApplicant.profile.personal.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2">
                            <FaEye size={24} />
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">No Image</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DataBox label="First Name" value={selectedApplicant.profile.personal.firstName} />
                    <DataBox label="Middle Name" value={selectedApplicant.profile.personal.middleName} />
                    <DataBox label="Surname" value={selectedApplicant.profile.personal.surname} />
                    <DataBox label="Suffix" value={selectedApplicant.profile.personal.suffix} />
                    <DataBox label="Date of Birth" value={selectedApplicant.profile.personal.dob} />
                    <DataBox label="Place of Birth" value={selectedApplicant.profile.personal.pob} />
                    <DataBox label="Gender" value={selectedApplicant.profile.personal.gender} />
                    <DataBox label="Civil Status" value={selectedApplicant.profile.personal.civilStatus} />
                    <DataBox label="Email Address" value={selectedApplicant.profile.personal.email} />
                    <DataBox label="Contact Number" value={selectedApplicant.profile.personal.contact} />
                    <div className="lg:col-span-2">
                      <DataBox label="Residential Address" value={selectedApplicant.profile.personal.address} />
                    </div>
                  </div>
                </div>
              </div>

              {/* FAMILY */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Family Information</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataBox label="Father's Name" value={selectedApplicant.profile.family.fatherName} />
                  <DataBox label="Occupation" value={selectedApplicant.profile.family.fatherOcc} />
                  <DataBox label="Contact" value={selectedApplicant.profile.family.fatherContact} />
                  <DataBox label="Mother's Name" value={selectedApplicant.profile.family.motherName} />
                  <DataBox label="Occupation" value={selectedApplicant.profile.family.motherOcc} />
                  <DataBox label="Contact" value={selectedApplicant.profile.family.motherContact} />
                  <DataBox label="Guardian's Name" value={selectedApplicant.profile.family.guardianName} />
                  <DataBox label="Occupation" value={selectedApplicant.profile.family.guardianOcc} />
                  <DataBox label="Contact" value={selectedApplicant.profile.family.guardianContact} />
                  <DataBox label="Number of Siblings" value={selectedApplicant.profile.family.siblings} />
                  <div className="md:col-span-2">
                    <DataBox label="Monthly Family Income" value={selectedApplicant.profile.family.income} />
                  </div>
                </div>
              </div>

              {/* EDUCATION PROFILE */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Education Profile</div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-gray-100">
                    <div className="md:col-span-2">
                      <DataBox label="LRN/ Student Number" value={selectedApplicant.profile.education.lrn} />
                    </div>
                    <div className="md:col-span-2">
                      <DataBox label="General Weighted Average (GWA)" value={selectedApplicant.profile.education.gwa} />
                    </div>
                  </div>

                  {[ 
                    {l: "Elementary", k: "elementary", a: "elemAddr", t: "elemType", y: "elemYear"},
                    {l: "Junior High", k: "jhs", a: "jhsAddr", t: "jhsType", y: "jhsYear"},
                    {l: "Senior High", k: "shs", a: "shsAddr", t: "shsType", y: "shsYear"}
                  ].map(row => (
                    <div key={row.k} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <DataBox label={row.l} value={selectedApplicant.profile.education[row.k]} />
                      <DataBox label="Address" value={selectedApplicant.profile.education[row.a]} />
                      <DataBox label="Type" value={selectedApplicant.profile.education[row.t]} />
                      <DataBox label="Year Graduated" value={selectedApplicant.profile.education[row.y]} />
                    </div>
                  ))}

                  {selectedApplicant.type === "Transferees" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                      <DataBox label="Last School Attended" value={selectedApplicant.profile.education.lastSchool} />
                      <DataBox label="Address" value={selectedApplicant.profile.education.lastSchoolAddr} />
                      <DataBox label="Type" value={selectedApplicant.profile.education.lastSchoolType} />
                      <DataBox label="Year Graduated" value={selectedApplicant.profile.education.lastSchoolYear} />
                    </div>
                  )}
                </div>
              </div>

              {/* DOCUMENTS */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Submitted Documents</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {selectedApplicant.profile.documents?.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                      <div className="flex items-center overflow-hidden">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-3 shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-black text-gray-800 uppercase leading-tight truncate">{doc.name}</div>
                            <div className="text-[9px] text-gray-500 uppercase">{doc.type} FILE</div>
                        </div>
                      </div>
                      
                      {/* VIEW BUTTON */}
                      <button 
                        onClick={() => openPreview(doc)}
                        className="ml-2 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                        title="View Document"
                      >
                         <FaEye size={14} />
                      </button>
                    </div>
                  ))}
                  {(!selectedApplicant.profile.documents || selectedApplicant.profile.documents.length === 0) && (
                      <p className="text-sm text-gray-400 italic">No documents submitted.</p>
                  )}
                </div>
              </div> 

              {/* --- ASSESSMENT RESULTS SECTION --- */}
              {selectedApplicant.assessment && (
                <div className="bg-white rounded-xl  p-6 shadow-md relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <h3 className="text-sm font-black text-green-800 uppercase tracking-widest">Assessment Results</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Interview Result */}
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Initial Interview</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    selectedApplicant.assessment.interviewStatus === "Passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                    {selectedApplicant.assessment.interviewStatus}
                                </span>
                            </div>
                            <div className="text-3xl font-black text-gray-800">
                                {selectedApplicant.assessment.interviewScore}%
                            </div>
                        </div>

                        {/* BCET Result */}
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Entrance Test (BCET)</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    selectedApplicant.assessment.bcetStatus === "Passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                    {selectedApplicant.assessment.bcetStatus}
                                </span>
                            </div>
                            <div className="text-3xl font-black text-gray-800">
                                {selectedApplicant.assessment.bcetScore}
                            </div>
                        </div>
                    </div>
                </div>
              )}

            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-400 rounded-b-2xl shrink-0 flex justify-end">
              <button className="px-8 py-2 rounded-lg bg-gray-900 text-white font-bold uppercase text-xs" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- DOCUMENT PREVIEW MODAL --- */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                
                {/* Modal Header & Controls */}
                <div className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shrink-0 z-10 relative shadow-md">
                    <div className="flex items-center gap-4">
                        <div>
                            <h3 className="font-bold text-lg uppercase tracking-wider">{previewDoc.name}</h3>
                            <p className="text-xs text-gray-400 uppercase">{previewDoc.format} File Preview</p>
                        </div>

                        {/* ZOOM CONTROLS (Only for Images) */}
                        {['png', 'jpg', 'jpeg'].includes(previewDoc.format.toLowerCase()) && (
                           <div className="flex items-center gap-2 bg-green-700 rounded-lg p-1 ml-6 shadow-inner border">
                              <button onClick={handleZoomOut} className="p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors active:scale-95" title="Zoom Out">
                                <FaSearchMinus size={14} />
                              </button>
                              <span className="text-xs font-bold w-12 text-center select-none text-gray-200">{Math.round(zoomLevel * 100)}%</span>
                              <button onClick={handleZoomIn} className="p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors active:scale-95" title="Zoom In">
                                <FaSearchPlus size={14} />
                              </button>
                              <div className="w-px h-4 bg-gray-600 mx-1"></div>
                              <button onClick={handleResetZoom} className="p-2 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors active:scale-95" title="Reset Zoom">
                                <FaRedo size={12} />
                              </button>
                           </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setPreviewDoc(null)}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* File Viewer Container */}
                <div className="flex-1 bg-gray-100 overflow-auto flex items-start justify-center relative p-4 scroll-smooth">
                    <div className="min-h-full min-w-full flex items-center justify-center">
                        {previewDoc.format.toLowerCase() === 'pdf' ? (
                            <iframe 
                                src={previewDoc.url} 
                                className="w-full h-full rounded-lg shadow-lg bg-white" 
                                title="Document Preview"
                            />
                        ) : ['png', 'jpg', 'jpeg'].includes(previewDoc.format.toLowerCase()) ? (
                            <img 
                                src={previewDoc.url} 
                                alt="Preview" 
                                className="shadow-2xl rounded-lg transition-all duration-200 ease-out"
                                style={{ 
                                    width: `${zoomLevel * 100}%`, 
                                    maxWidth: 'none' 
                                }}
                            />
                        ) : (
                            <div className="text-gray-500 flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow">
                                <FileText size={64} className="mb-4 text-gray-300" />
                                <p className="font-bold">Preview not available for this file type.</p>
                                <a href={previewDoc.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 underline mt-4 hover:text-blue-800">
                                    <FaFileDownload /> Download File
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t px-6 py-3 text-right z-10 relative">
                    <button 
                        className="px-6 py-2 bg-gray-800 text-white font-bold uppercase text-xs rounded-lg hover:bg-black"
                        onClick={() => setPreviewDoc(null)}
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}