import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Header from '../../components/Header.jsx';
import { FaSearch, FaFilter, FaEye, FaTimes, FaFileDownload, FaSearchPlus, FaSearchMinus, FaRedo } from "react-icons/fa"; 
import { FileText, MessageSquare } from "lucide-react"; 
import api from "../../services/api";

export default function Applications() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  
  // --- PREVIEW STATE ---
  const [previewDoc, setPreviewDoc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0.8);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState(""); 
  const filterRef = useRef(null);

  // --- REAL DATA STATE ---
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/admin/applicants');
        setApplicants(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    if (location.state?.applicantId) {
      if (applicants.length > 0) {
        const target = applicants.find(a => a.id === location.state.applicantId);
        if (target) {
          setSelectedApplicant(target);
          setIsModalOpen(true);
          navigate(location.pathname, { replace: true, state: {} });
        }
      }
    }
  }, [location.state, applicants, navigate, location.pathname]);

  const filteredApplicants = applicants.filter((a) => {
    const text = `${a.id} ${a.name} ${a.type} ${a.location} ${a.date}`.toLowerCase();
    if (searchQuery && !text.includes(searchQuery.toLowerCase())) return false;
    if (typeFilter && a.type !== typeFilter) return false;
    if (locationFilter && a.location !== locationFilter) return false;
    return true;
  });

  const locations = [...new Set(applicants.map(a => a.location))];

  // --- ZOOM HANDLERS ---
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3.0)); // +20%
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.2)); // -20%
  const handleResetZoom = () => setZoomLevel(0.8); // Reset to 80% width

  // Reset Zoom when opening a new document
  const openPreview = (doc) => {
    setPreviewDoc(doc);
    setZoomLevel(0.8); // Start at 80% container width
  };

  const DataBox = ({ label, value }) => (
    <div>
      <div className="text-[11px] font-bold text-gray-700 uppercase">{label}</div>
      <div className="mt-1 bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 flex items-center shadow-sm truncate">
        {value || "N/A"}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-200 h-screen flex flex-col overflow-hidden font-sans">
      <Header username="admin" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="shrink-0">
          <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">Applications</h2>
          <p className="text-gray-600 mb-4">Review and verify applicant information and documents</p>

          <div className="flex gap-3 mb-4 items-center">
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

            <div className="relative" ref={filterRef}>
              <button onClick={() => setShowFilter((v) => !v)} className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 font-semibold">
                <FaFilter /> Filter
              </button>
              {showFilter && (
                <div className="absolute left-0 mt-2 bg-white border rounded shadow-xl p-3 w-52 z-30">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Applicant Type</label>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full mb-3 p-2 border rounded text-sm outline-none">
                    <option value="">All</option>
                    <option value="Freshmen">Freshmen</option>
                    <option value="Transferee">Transferees</option>
                  </select>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Location</label>
                  <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full mb-3 p-2 border rounded text-sm outline-none">
                    <option value="">All Locations</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <div className="flex justify-between">
                    <button onClick={() => setShowFilter(false)} className="px-3 py-1 bg-green-700 text-white rounded text-xs font-bold">Apply</button>
                    <button onClick={() => { setTypeFilter(""); setLocationFilter(""); setSearchQuery(""); }} className="px-3 py-1 bg-gray-100 rounded text-xs font-bold">Clear</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- MAIN TABLE  --- */}
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
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-bold">Loading Applications...</td></tr>
                ) : filteredApplicants.length > 0 ? (
                    filteredApplicants.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className=" py-2  pl-6 text-sm text-gray-500 font-medium">{a.id}</td>
                        <td className="px-7 py-2 text-sm text-gray-900 font-medium">{a.name}</td>
                        <td className="px-4 py-2  text-sm uppercase text-gray-600">{a.type}</td>
                        <td className="px-4 py-2  text-sm uppercase text-gray-600">{a.location}</td>
                        <td className="px-4 py-2  text-sm text-gray-600 text-center">{a.date}</td>
                        <td className="px-4 py-2  text-center">
                        <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border border-yellow-200">
                            {a.status === "Pending" ? "Pending Interview" : a.status}
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
                    ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400 italic">No applicants found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- APPLICANT DETAILS MODAL --- */}
      {isModalOpen && selectedApplicant && selectedApplicant.profile && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-11/12 max-w-[1200px] z-10 flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between rounded-t-2xl bg-green-700 text-white px-6 py-4 shrink-0">
              <h3 className="font-bold text-lg uppercase">Applicant Details</h3>
              <button className="text-white text-3xl font-bold" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 bg-gray-100">
              {/* PERSONAL INFORMATION */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Personal Information</div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="text-[11px] font-bold text-gray-700 uppercase mb-1">Applicant Picture</div>
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center overflow-hidden relative">
                      {selectedApplicant.profile.personal?.image ? (
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
                    <DataBox label="First Name" value={selectedApplicant.profile.personal?.firstName} />
                    <DataBox label="Middle Name" value={selectedApplicant.profile.personal?.middleName} />
                    <DataBox label="Surname" value={selectedApplicant.profile.personal?.surname} />
                    <DataBox label="Suffix" value={selectedApplicant.profile.personal?.suffix} />
                    <DataBox label="Date of Birth" value={selectedApplicant.profile.personal?.dob} />
                    <DataBox label="Place of Birth" value={selectedApplicant.profile.personal?.pob} />
                    <DataBox label="Gender" value={selectedApplicant.profile.personal?.gender} />
                    <DataBox label="Civil Status" value={selectedApplicant.profile.personal?.civilStatus} />
                    <DataBox label="Email Address" value={selectedApplicant.profile.personal?.email} />
                    <DataBox label="Contact Number" value={selectedApplicant.profile.personal?.contact} />
                    <div className="lg:col-span-2">
                      <DataBox label="Residential Address" value={selectedApplicant.profile.personal?.address} />
                    </div>
                  </div>
                </div>
              </div>

              {/* FAMILY & EDUCATION SECTIONS */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Family Information</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DataBox label="Father's Name" value={selectedApplicant.profile.family?.fatherName} />
                  <DataBox label="Occupation" value={selectedApplicant.profile.family?.fatherOcc} />
                  <DataBox label="Contact" value={selectedApplicant.profile.family?.fatherContact} />
                  <DataBox label="Mother's Name" value={selectedApplicant.profile.family?.motherName} />
                  <DataBox label="Occupation" value={selectedApplicant.profile.family?.motherOcc} />
                  <DataBox label="Contact" value={selectedApplicant.profile.family?.motherContact} />
                  <DataBox label="Guardian's Name" value={selectedApplicant.profile.family?.guardianName} />
                  <DataBox label="Occupation" value={selectedApplicant.profile.family?.guardianOcc} />
                  <DataBox label="Contact" value={selectedApplicant.profile.family?.guardianContact} />
                  <DataBox label="Number of Siblings" value={selectedApplicant.profile.family?.siblings} />
                  <div className="md:col-span-2">
                    <DataBox label="Monthly Family Income" value={selectedApplicant.profile.family?.income} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Education Profile</div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2 border-b border-gray-100">
                    <div className="md:col-span-2">
                      <DataBox label="LRN/ Student Number" value={selectedApplicant.profile.education?.lrn} />
                    </div>
                    <div className="md:col-span-2">
                      <DataBox label="General Weighted Average (GWA)" value={selectedApplicant.profile.education?.gwa} />
                    </div>
                  </div>
                  {[ 
                    {l: "Elementary", k: "elementary", a: "elemAddr", t: "elemType", y: "elemYear"},
                    {l: "Junior High", k: "jhs", a: "jhsAddr", t: "jhsType", y: "jhsYear"},
                    {l: "Senior High", k: "shs", a: "shsAddr", t: "shsType", y: "shsYear"}
                  ].map(row => (
                    <div key={row.k} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <DataBox label={row.l} value={selectedApplicant.profile.education?.[row.k]} />
                      <DataBox label="Address" value={selectedApplicant.profile.education?.[row.a]} />
                      <DataBox label="Type" value={selectedApplicant.profile.education?.[row.t]} />
                      <DataBox label="Year Graduated" value={selectedApplicant.profile.education?.[row.y]} />
                    </div>
                  ))}
                   {selectedApplicant.type === "Transferees" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                      <DataBox label="Last School Attended" value={selectedApplicant.profile.education?.lastSchool} />
                      <DataBox label="Address" value={selectedApplicant.profile.education?.lastSchoolAddr} />
                      <DataBox label="Type" value={selectedApplicant.profile.education?.lastSchoolType} />
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
                      <div className="text-gray-400 text-xs italic">No documents submitted.</div>
                  )}
                </div>
              </div> 
                         
              <div className="justify-end flex">
                  <button 
                    onClick={() => navigate('/admin/assessment', { state: { applicantId: selectedApplicant.id } })}
                    className="flex items-center justify-end gap-2 px-6 py-3 bg-blue-50 text-green-700 border border-blue-200 rounded-xl font-black uppercase text-[10px] hover:bg-green-600 hover:text-white transition-all shadow-sm group"
                  >
                    <MessageSquare size={16} className="group-hover:text-white" />
                    <span>View Interview Responses</span>
                  </button>
              </div>
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
                            <h3 className="font-bold text-lg uppercase tracking-wider">{previewDoc.name || "Document"}</h3>
                            <p className="text-xs text-gray-400 uppercase">{previewDoc.format || previewDoc.type} File Preview</p>
                        </div>

                        {/* ZOOM CONTROLS  */}
                        {['png', 'jpg', 'jpeg' ].includes((previewDoc.format || previewDoc.type || '').toLowerCase()) && (
                           <div className="flex items-center gap-2 bg-green-700 rounded-lg p-1 ml-6 shadow-inner border ">
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
                    {/* Inner wrapper ensures min-height for vertical centering when image is smaller than viewport */}
                    <div className="min-h-full min-w-full flex items-center justify-center">
                        {(previewDoc.format || previewDoc.type || '').toLowerCase() === 'pdf' ? (
                            <iframe 
                                src={previewDoc.url} 
                                className="w-full h-full rounded-lg shadow-lg bg-white" 
                                title="Document Preview"
                            />
                        ) : ['png', 'jpg', 'jpeg'].includes((previewDoc.format || previewDoc.type || '').toLowerCase()) ? (
                            // WIDTH-BASED ZOOMING (Fixes Clipping/Overlap)
                            <img 
                                src={previewDoc.url} 
                                alt="Preview" 
                                className="shadow-2xl rounded-lg transition-all duration-200 ease-out"
                                style={{ 
                                    width: `${zoomLevel * 100}%`, // Controls size via width percentage
                                    maxWidth: 'none' // Allows expanding beyond container
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