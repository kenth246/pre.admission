import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header.jsx';
import { FaSearch, FaFilter, FaEye, FaCheckSquare, FaSquare } from "react-icons/fa";
import { FileText } from "lucide-react";

export default function Assesments() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState(""); 
  const filterRef = useRef(null);

  // --- MOCK DATABASE ---
  const [applicants] = useState([
    {
      id: "2026-0001",
      name: "JUAN DELA CRUZ",
      type: "Freshmen",
      location: "PULILAN",
      date: "12/15/25",
      status: "Pending",
      profile: {
        personal: {
          firstName: "JUAN", middleName: "REYES", surname: "DELA CRUZ", suffix: "N/A",
          dob: "2007-05-12", pob: "MALOLOS, BULACAN", gender: "MALE", email: "juan.dc@email.com",
          civilStatus: "SINGLE", contact: "09123456789", address: "123 MABINI ST. POB. PULILAN, BULACAN"
        },
        family: {
          fatherName: "ROBERTO DELA CRUZ", fatherOcc: "ENGINEER", fatherContact: "09171112233",
          motherName: "MARIA REYES", motherOcc: "TEACHER", motherContact: "09174445566",
          guardianName: "N/A", guardianOcc: "N/A", guardianContact: "N/A",
          siblings: "2", income: "PHP 30,000 - 40,000"
        },
        education: {
          elementary: "PULILAN CENTRAL SCHOOL", elemAddr: "PULILAN", elemType: "PUBLIC", elemYear: "2018",
          jhs: "PULILAN NATIONAL HIGH", jhsAddr: "PULILAN", jhsType: "PUBLIC", jhsYear: "2022",
          shs: "BTECH SENIOR HIGH", shsAddr: "BALIUAG", shsType: "PUBLIC",shsYear: "2024",
        },
        otherInfo: {
          is4Ps: true,
          isPWD: false,
          isIndigenous: false
        },
        documents: [
          { name: "Birth Certificate", type: "PDF" },
          { name: "Report Card (Form 138)", type: "IMG" },
          { name: "Good Moral Certificate", type: "PDF" }
        ]
      }
    }
  ]);

  const filteredApplicants = applicants.filter((a) => {
    const text = `${a.id} ${a.name} ${a.type} ${a.location} ${a.date}`.toLowerCase();
    if (searchQuery && !text.includes(searchQuery.toLowerCase())) return false;
    if (typeFilter && a.type !== typeFilter) return false;
    if (locationFilter && a.location !== locationFilter) return false;
    return true;
  });

  const locations = [...new Set(applicants.map(a => a.location))];

  const DataBox = ({ label, value }) => (
    <div>
      <div className="text-[11px] font-bold text-gray-700 uppercase">{label}</div>
      <div className="mt-1 bg-white border border-gray-400 rounded-lg px-2 py-1 text-sm uppercase h-8 flex items-center shadow-sm">
        {value || ""}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-200 h-screen flex flex-col overflow-hidden font-sans">
      <Header username="admin" />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* FIXED HEADER CONTENT */}
        <div className="shrink-0">
          <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">Assesments</h2>
          <p className="text-gray-600 mb-4">Review and verify applicant information and documents</p>

          <div className="flex gap-3 mb-4 items-center">
            <div className="relative">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search applicant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-xl rounded-lg bg-white border border-white w-92 outline-none"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button onClick={() => setShowFilter((v) => !v)} className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2 font-semibold">
                <FaFilter /> Filter
              </button>
              {showFilter && (
                <div className="absolute left-0 mt-2 bg-white border rounded shadow p-3 w-52 z-30">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-tight">Applicant Type</label>
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full mb-3 p-2 border rounded text-sm outline-none">
                    <option value="">All</option>
                    <option value="Freshmen">Freshmen</option>
                    <option value="Transferees">Transferees</option>
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

        {/* SCROLLABLE TABLE CONTENT */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col overflow-hidden">
          <div className="overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-green-600 text-white sticky top-0 z-20">
                <tr className="text-lg">
                  <th className="p-4 text-left font-semibold">ID</th>
                  <th className="p-4 text-left font-semibold uppercase">Applicant Name</th>
                  <th className="p-4 text-center font-semibold uppercase">Applicant Type</th>
                  <th className="p-4 text-center font-semibold uppercase">Location</th>
                  <th className="p-4 text-center font-semibold uppercase">Date</th>
                  <th className="p-4 text-center font-semibold uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="text-lg divide-y divide-gray-100">
                {filteredApplicants.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-m text-left">{a.id}</td>
                    <td className="px-4 py-2 text-m text-left ">{a.name}</td>
                    <td className="px-4 py-2 text-m text-center uppercase">{a.type}</td>
                    <td className="px-4 py-2 text-m text-center">{a.location}</td>
                    <td className="px-4 py-2 text-m text-center">{a.date}</td>
                    <td className="px-4 py-2 text-m text-center">
                      <button onClick={() => { setSelectedApplicant(a); setIsModalOpen(true); }} className="text-blue-600 hover:scale-125 transition-transform">
                        <FaEye size={22} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl  shadow-lg w-11/12 max-w-[1200px] z-10 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between rounded-t-2xl bg-green-700 text-white px-6 py-4 shrink-0">
              <h3 className="font-bold text-lg uppercase">Applicant Details</h3>
              <button className="text-white text-3xl font-bold" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 bg-gray-100">
              {/* PERSONAL */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Personal Information</div>
                <div className="grid grid-cols-4 gap-4">
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
                  <div className="col-span-2">
                    <DataBox label="Residential Address" value={selectedApplicant.profile.personal.address} />
                  </div>
                </div>
              </div>

              {/* FAMILY */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Family Information</div>
                <div className="grid grid-cols-3 gap-4">
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
                  <div className="col-span-2">
                    <DataBox label="Monthly Family Income" value={selectedApplicant.profile.family.income} />
                  </div>
                </div>
              </div>

              {/* EDUCATION */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Education Profile</div>
                <div className="space-y-4">
                  {[ 
                    {l: "Elementary", k: "elementary", a: "elemAddr", t: "elemType", y: "elemYear"},
                    {l: "Junior High", k: "jhs", a: "jhsAddr", t: "jhsType", y: "jhsYear"},
                    {l: "Senior High", k: "shs", a: "shsAddr", t: "shsType", y: "shsYear"}
                  ].map(row => (
                    <div key={row.k} className="grid grid-cols-4 gap-4">
                      <DataBox label={row.l} value={selectedApplicant.profile.education[row.k]} />
                      <DataBox label="Address" value={selectedApplicant.profile.education[row.a]} />
                      <DataBox label="Type" value={selectedApplicant.profile.education[row.t]} />
                      <DataBox label="Year Graduated" value={selectedApplicant.profile.education[row.y]} />
                    </div>
                  ))}
                </div>
              </div>

              {/* OTHER INFORMATION SECTION  */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Other Information</div>
                <div className="space-y-3">
                  {[
                    { text: 'Member of Pantawid Pamilyang Pilipino Program (4Ps)', val: selectedApplicant.profile.otherInfo.is4Ps },
                    { text: 'Has a disability', val: selectedApplicant.profile.otherInfo.isPWD },
                    { text: 'Part of an indigenous group', val: selectedApplicant.profile.otherInfo.isIndigenous }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-700">
                      {item.val ? (
                        <FaCheckSquare className="text-green-700 text-lg" />
                      ) : (
                        <FaSquare className="text-gray-300 text-lg" />
                      )}
                      <span className={`text-sm font-semibold ${item.val ? 'text-black' : 'text-gray-400'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMITTED DOCUMENTS SECTION */}
              <div className="bg-white rounded-xl border border-gray-300 p-5 shadow-sm">
                <div className="text-sm font-black text-green-700 mb-4 uppercase">Submitted Documents</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedApplicant.profile.documents?.map((doc, idx) => (
                    <div key={idx} className="flex items-center p-3 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 mr-3">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-black text-gray-800 uppercase leading-tight">{doc.name}</div>
                        <div className="text-[9px] text-gray-500 uppercase">{doc.type} FILE</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-400 rounded-b-2xl gap-4 shrink-0 flex justify-end">
              <button className="px-8 py-2 rounded-lg bg-gray-900 text-white font-bold uppercase text-xs" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}