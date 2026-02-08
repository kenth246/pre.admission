import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../services/api";
import {
  FaUserGraduate,
  FaClipboardList,
  FaUserCheck,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  BarController,
} from "chart.js";

// Register Chart.js components
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  BarController
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);

  // State
  const [applicants, setApplicants] = useState([]);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get('/admin/applicants');
        
        const formattedData = res.data.map(app => ({
            id: app.id,
            name: app.name,
            type: app.type,
            location: app.location || "N/A",
            date: app.date,
            status: app.status || "Pending Interview",
            email: app.email
        }));

        setApplicants(formattedData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchApplicants();
  }, []);

  // --- 2. KPI CALCULATIONS ---
  const totalApplicants = applicants.length;
  const pendingInterview = applicants.filter(a => a.status === "Pending Interview").length;
  const pendingBcet = applicants.filter(a => a.status === "Pending BCET" || a.status === "For Exam").length;
  const admittedApplicants = applicants.filter(a => a.status === "Admitted" || a.status === "Enrolled").length;

  // --- 3. CHARTS ---
  useEffect(() => {
    // A. PIE CHART
    const freshmenCount = applicants.filter((a) => a.type === "Freshmen" || a.type === "Freshman").length;
    const transfereesCount = applicants.filter((a) => a.type === "Transferee").length;

    if (pieChartInstance.current) pieChartInstance.current.destroy();

    if (pieChartRef.current) {
        pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
            labels: ["Freshmen", "Transferees"],
            datasets: [{
                data: [freshmenCount, transfereesCount],
                backgroundColor: ["#15803d", "#facc15"], 
                hoverOffset: 4,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } },
        },
        });
    }

    // B. BAR CHART
    const locationCounts = applicants.reduce((acc, curr) => {
      const loc = curr.location || "Unknown";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});

    if (barChartInstance.current) barChartInstance.current.destroy();

    if (barChartRef.current) {
        barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
            labels: Object.keys(locationCounts),
            datasets: [{
                label: "Applicants",
                data: Object.values(locationCounts),
                backgroundColor: "#009437", 
                borderRadius: 5,
            }],
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { display: false } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } },
        },
        });
    }

    return () => {
      if (pieChartInstance.current) pieChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [applicants]);

  // Filter for Table
  const recentApplicants = applicants.slice(0, 5);

  // --- HELPER FOR STATUS COLORS ---
  const getStatusColor = (status) => {
      const s = status?.toLowerCase() || "";
      
      if (s.includes("admitted") || s.includes("enrolled")) {
          return "bg-green-100 text-green-700 border-green-200";
      }
      if (s.includes("pending bcet") || s.includes("for exam")) {
          return "bg-orange-100 text-orange-700 border-orange-200";
      }
      if (s.includes("fail") || s.includes("rejected") || s.includes("denied")) {
          return "bg-red-100 text-red-700 border-red-200";
      }
      // Default Yellow for Pending, Pending Interview, etc.
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
      <Header username="admin" />

      <main className="flex-1 p-6 overflow-y-auto">
        
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Welcome back, Admin! Here is the latest admission summary.</p>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard title="Total Applicants" count={totalApplicants} icon={<FaClipboardList />} color="bg-blue-600" />
          <KPICard title="Pending Interview" count={pendingInterview} icon={<FaClock />} color="bg-yellow-500" />
          <KPICard title="Pending BCET" count={pendingBcet} icon={<FaUserGraduate />} color="bg-orange-500" />
          <KPICard title="Total Admitted" count={admittedApplicants} icon={<FaUserCheck />} color="bg-green-600" />
        </div>

        {/* --- CHARTS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-700 mb-4 w-full text-left border-b pb-2">Applicant Type</h3>
            <div className="w-64 h-64">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
              <FaMapMarkerAlt className="text-green-700"/> Applicant Locations
            </h3>
            <div className="h-64 w-full">
               <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* --- RECENT APPLICANTS TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
               Recent Applications <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{recentApplicants.length}</span>
            </h3>
            <button 
              onClick={() => navigate('/applications')}
              className="text-sm text-green-700 font-bold hover:underline"
            >
              View All Applications
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {recentApplicants.length > 0 ? (
                  recentApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-gray-500">{String(app.id).substring(0, 6)}...</td>
                      <td className="p-4 font-medium text-gray-900">{app.name}</td>
                      <td className="p-4 text-gray-600">{app.type}</td>
                      <td className="p-4 text-gray-600">{app.location}</td>
                      <td className="p-4 text-gray-600">{app.date}</td>
                      <td className="p-4">
                        {/* APPLYING THE NEW COLOR LOGIC HERE */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => navigate('/applications', { state: { applicantId: app.id } })}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase border border-blue-200 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                   <tr>
                     <td colSpan="7" className="p-8 text-center text-gray-400 italic">No applications found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

function KPICard({ title, count, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-l-green-600 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-black text-gray-800">{count}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-xl shadow-lg`}>
        {icon}
      </div>
    </div>
  );
}