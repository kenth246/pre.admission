import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header.jsx';
import {FaSearch} from "react-icons/fa";
import {FaFilter} from "react-icons/fa";
import { MdChat } from "react-icons/md";


export default function admission() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const filterRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatSubject, setChatSubject] = useState("");
    const [chatMessage, setChatMessage] = useState("");


  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      type: "Freshmen",
      date: "12/15/25",
      status: "Passed",
    },
  ]);


  const [_, __] = useState(() => {
    try {
      const saved = localStorage.getItem("applicants");
      if (saved) {
        // replace initial default with saved data
        setApplicants(JSON.parse(saved));
      } else {
        // persist the default initial data
        localStorage.setItem("applicants", JSON.stringify([{
          id: 1,
          name: "Juan Dela Cruz",
          type: "Freshmen",
          date: "12/15/25",
          status: "Passed",
        }]));
      }
    } catch (e) {
      // ignore JSON errors
    }
    return [null, null];
  });

    const logout = () => navigate("/");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredApplicants = applicants.filter((a) => {
  const text = `${a.id} ${a.name} ${a.type} ${a.date} ${a.status}`.toLowerCase();

  if (searchQuery && !text.includes(searchQuery.toLowerCase())) return false;
  if (typeFilter && a.type !== typeFilter) return false;
  if (statusFilter && a.status !== statusFilter) return false;

  return true;
});


  const evaluatedApplicant = (id) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Evaluated" } : a))
    );
    if (selectedApplicant?.id === id) {
      setSelectedApplicant((s) => (s ? { ...s, status: "Evaluated" } : s));
    }
    setIsModalOpen(false);
    // Persist change to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("applicants") || "[]");
      const idx = stored.findIndex((a) => a.id === id);
      if (idx > -1) {
        stored[idx].status = "Evaluated";
      }
      localStorage.setItem("applicants", JSON.stringify(stored));
    } catch (e) {}
  };

  // keep localStorage in sync when applicants change (covers other flows)
  useEffect(() => {
    try {
      localStorage.setItem("applicants", JSON.stringify(applicants));
    } catch (e) {}
  }, [applicants]);



  return (
    <div className="bg-gray-200 min-h-screen">
     <Header username="admin" />

     <main className="p-6">
        <h2 className="text-2xl font-bold mb-1">Pre-Admission</h2>
        <p className="text-gray-600 mb-4">
          Manage and message applicants
        </p>

      <div className="flex gap-3 mb-4 items-center">
        {/* SEARCH */}
        <div className="relative">
          <FaSearch className="absolute right-4  top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            placeholder="Search applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 text-xl rounded-lg  bg-white border border-white w-92"
          />
        </div>

        {/* FILTER */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <FaFilter /> Filter
          </button>

          {showFilter && (
            <div className="absolute left-0 mt-2 bg-white border rounded shadow p-3 w-52 z-20">
              <label className="block text-xs font-semibold mb-1">
                Applicant Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              >
                <option value="">All</option>
                <option value="Freshmen">Freshmen</option>
                <option value="Transferees">Transferees</option>
              </select>

              <label className="block text-xs font-semibold mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              >
                <option value="">All</option>
                <option value="Admitted">Admitted</option>
                <option value="Rejected">Rejected</option>
              </select>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowFilter(false)}
                  className="px-3 py-1 bg-green-700 text-white rounded"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setTypeFilter("");
                    setStatusFilter("");
                    setSearchQuery("");
                  }}
                  className="px-3 py-1 bg-gray-100 rounded"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-y-auto h-134">
          <table className="w-full border-collapse">
            <thead className="bg-green-600 text-white sticky top-0 z-10">
              <tr className="text-lg">
                <th className="p-4 text-left font-semibold">ID</th>
                <th className="p-4 text-left font-semibold">Applicant Name</th>
                <th className="p-4 text-center font-semibold">Applicant Type</th>
                <th className="p-4 text-center font-semibold">Date</th>
                <th className="p-4 text-center font-semibold">Status</th>
                <th className="p-4 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="text-lg">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  {/* ID - Left aligned */}
                  <td className="p-4 text-left">{applicant.id}</td>
                  <td className="p-4 text-left ">{applicant.name}</td>
                  <td className="p-4 text-center">{applicant.type}</td>
                  <td className="p-4 text-center ">{applicant.date}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white inline-block w-24 ${
                        applicant.status === "Pending"
                          ? "bg-yellow-500"
                          : applicant.status === "Passed"
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                    >
                      {applicant.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                        title="View"
                        onClick={() => {
                          setSelectedApplicant(applicant);
                          setIsModalOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>

                        <button
                        className="text-green-600 hover:text-green-800 transition-transform hover:scale-110 text-xl"
                        title="Chat"
                        onClick={() => {
                            setSelectedApplicant(applicant);
                            setIsChatOpen(true);
                        }}
                        >
                        <MdChat />
                        </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredApplicants.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No applicants found matching your criteria.
            </div>
          )}
        </div>
      </div>
      </main>
      
    {/* Modal */}
    {isModalOpen && selectedApplicant && (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedApplicant(null);
          }}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-lg w-11/12 max-w-[1200px] z-10 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-green-700 text-white px-4 py-3">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-xl">APPLICANT DETAILS</h3>
            </div>
            <button
              className="text-white text-lg font-bold px-2"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedApplicant(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Body  */}
            <div className="p-4 overflow-y-auto max-h-[75vh]">
              <div className="space-y-4">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded border border-gray-500 p-3">
                <div className="text-l font-black text-green-700 mb-2">Personal Information</div>
                
                <div className="grid grid-cols-4 gap-3 ">
                  <div>
                    <div className="text-l font-semibold text-gray-800">Given Name</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">{selectedApplicant.name}</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Middle Name</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Surname</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Suffix</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 mt-2 gap-3 ">
                  <div>
                    <div className="text-l font-semibold text-gray-800">Date of birth</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">{selectedApplicant.date}</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Place of Birth</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 w-209 px-2 py-1">
                    &nbsp;</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-2 ">
                  <div>
                    <div className="text-l font-semibold text-gray-800">Gender</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div> 

                  <div>
                    <div className="text-l font-semibold text-gray-800">Email</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div> 

                  <div>
                    <div className="text-l font-semibold text-gray-800">Civil Status</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>

                  
                  <div>
                    <div className="text-l font-semibold text-gray-800">Contact Number</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>

              </div>
                  <div className="col-span-4 mt-2">
                    <div className="text-l font-semibold text-gray-800">Residential Address</div>
                    <div className="mt-1 bg-white border rounded w-280 border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
              </div>


            {/* Family Information */}
            <div className="bg-gray-50 rounded border border-gray-500 p-3">
              <div className="text-l font-black text-green-700 mb-2">
                Family Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Father */}
                <div>
                  <div className="font-semibold text-gray-800">Father's Name</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Occupation</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Contact Number</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>

                {/* Mother */}
                <div>
                  <div className="font-semibold text-gray-800">Mother's Name</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Occupation</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Contact Number</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>

                {/* Guardian */}
                <div>
                  <div className="font-semibold text-gray-800">Guardian's Name</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Occupation</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Contact Number</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>

                {/* Siblings + Income (SAME ROW) */}
                <div>
                  <div className="font-semibold text-gray-800">Number of Siblings</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>

                <div className="md:col-span-2">
                  <div className="font-semibold text-gray-800">Monthly Family Income</div>
                  <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                </div>
              </div>
            </div>


              {/* Education Background */}
              <div className="bg-gray-50 rounded border border-gray-500 p-3">
                <div className="text-l font-black text-green-700 mb-2">Education Background</div>
                <div className="grid grid-cols-3 gap-3 ">
                  <div>
                    <div className="text-l font-semibold text-gray-800">Elementary</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Address</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Year Graduated</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>

                  <div>
                    <div className="text-l font-semibold text-gray-800">Junior High</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Address</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Year Graduated</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Senior High</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Address</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Year Graduated</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>

                  <div>
                    <div className="text-l font-semibold text-gray-800">College</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Address</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                  <div>
                    <div className="text-l font-semibold text-gray-800">Year Graduated</div>
                    <div className="mt-1 bg-white border rounded border-gray-500 px-2 py-1">&nbsp;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-100 flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedApplicant(null);
              }}
            >
              Cancel
            </button>

            {selectedApplicant.status === "Pending" && (
              <>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => evaluatedApplicant(selectedApplicant.id)}
                >
                  Submit
                </button>

              </>
            )}
          </div>
        </div>
      </div>
    )}


    {/* ChatModal */}
    {isChatOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsChatOpen(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-lg z-10 w-[1000px] max-w-[200vw] max-h-[180vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between bg-green-700 text-white px-4 py-2 rounded-t-lg">
                <h3 className="font-bold">MESSAGE</h3>
                <button
                className="font-bold text-lg"
                onClick={() => setIsChatOpen(false)}
                >
                ×
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
                <div>
                <label className="text-sm font-semibold">Send to*</label>
                <input
                    type="email"
                    value={`${selectedApplicant.name.replaceAll(" ", "").toLowerCase()}@gmail.com`}
                    readOnly
                    className="w-full bg-gray-50 rounded border border-gray-500 px-3 py-2 bg-white"
                />
                </div>

                <div>
                <label className="text-sm font-semibold">Message Subject*</label>
                <input
                    type="text"
                    value={chatSubject}
                    onChange={(e) => setChatSubject(e.target.value)}
                    className="w-full bg-gray-50 rounded border border-gray-500 px-3 py-2 resize-yes"
                />
                </div>

                <div>
                <label className="text-sm font-semibold">Message*</label>
                <textarea
                    rows="4"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full bg-gray-50 rounded border border-gray-500 px-3 py-2 resize-yes"
                />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-4 py-3 bg-gray-100 rounded-b-lg">
                <button
                className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setIsChatOpen(false)}
                >
                Cancel
                </button>
                <button
                className="px-4 py-1 rounded bg-green-700 text-white hover:bg-green-800"
                onClick={() => {

                    setChatSubject("");
                    setChatMessage("");
                    setIsChatOpen(false);
                }}
                >
                Send
                </button>
            </div>
        </div>
    </div>
    )}

</div>

  )
}
