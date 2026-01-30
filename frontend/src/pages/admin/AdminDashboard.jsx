import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
} from "chart.js";


Chart.register(ArcElement, Tooltip, Legend, PieController);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      type: "Freshmen",
      date: "12/15/25",
      status: "Pending",
      email: "juan.delacruz@email.com",
    },
  ]);

  useEffect(() => {

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "pie",
      data: {
        labels: ["Freshmen", "Transferees"],
        datasets: [
          {
            data: [75, 25],
            backgroundColor: ["#0284c7", "#22c55e"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);



  const logout = () => navigate("/");

  const approveApplicant = (id) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Admitted" } : a))
    );
    if (selectedApplicant?.id === id) {
      setSelectedApplicant((s) => (s ? { ...s, status: "Admitted" } : s));
    }
    setIsModalOpen(false);
  };

  const rejectApplicant = (id) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Rejected" } : a))
    );
    if (selectedApplicant?.id === id) {
      setSelectedApplicant((s) => (s ? { ...s, status: "Rejected" } : s));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-200 min-h-screen">
     <Header username="admin" />

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-1">Welcome back, admin!</h2>
        <p className="text-gray-600 mb-6">
          Here's what's happening with your pre-admission system today.
        </p>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[ 
            { icon: "users", label: "Total Applicants", value: 500, color: "text-green-600" },
            { icon: "clock", label: "Pending Applicants", value: 200, color: "text-blue-500" },
            { icon: "user-check", label: "Admitted Applicants", value: 400, color: "text-blue-800" },
            { icon: "hourglass-half", label: "Pending Interview", value: 30, color: "text-yellow-500" },
            { icon: "circle-check", label: "Completed Interview", value: 100, color: "text-orange-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg p-4 shadow flex items-center gap-4"
            >
              <i className={`fa-solid fa-${stat.icon} text-3xl ${stat.color}`}></i>
              <div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xl mt-1">Recent Applicants</h3>
              <button
                type="button"
                className="w-20 bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
              ><a href="/applicantions">View All</a>
              </button>
            </div>

          <table className="w-full text-sm table-auto">
            <thead className="border-b border-gray-300">
              <tr>
                <th class="text-left py-2">Applicant Name</th>
                <th>Applicant Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="border-b border-gray-200">
                  <td className="py-2">{applicant.name}</td>
                  <td className="text-center">{applicant.type}</td>
                  <td className="text-center">{applicant.date}</td>

                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold text-white inline-block w-24 ${
                            applicant.status === "Pending"
                              ? "bg-yellow-500"
                              : applicant.status === "Admitted"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>

                  <td className="text-center space-x-3">
                    {/* VIEW */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSelectedApplicant(applicant);
                        setIsModalOpen(true);
                      }}
                      title="View"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>

                    {applicant.status === "Pending" && (
                      <>
                        {/* APPROVE */}
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Approve"
                          onClick={() => approveApplicant(applicant.id)}
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>

                        {/* REJECT */}
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                          onClick={() => rejectApplicant(applicant.id)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                  onClick={() => rejectApplicant(selectedApplicant.id)}
                >
                  Reject
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={() => approveApplicant(selectedApplicant.id)}
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )}


          <div className="bg-white rounded-lg shadow p-4">
            <div className="font-bold text-xl mb-3">Applicant Type</div>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </main>
    </div>
  );
}
