import { Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/student/StudentLogin";
import StudentSignUp from "./pages/student/StudentSignUp";
import StudentAdmission from "./pages/student/StudentAdmission";
import StudentProfile from "./pages/student/freshmen/StudentProfile.jsx";
import Education from "./pages/student/freshmen/Education.jsx";
import StudentInterview from "./pages/student/freshmen/StudentInterview.jsx";
import Requirements from "./pages/student/freshmen/Requirements.jsx";
import StudentExam from "./pages/student/freshmen/StudentExam.jsx";

import TransfereeProfile from "./pages/student/transferees/StudentProfile.jsx";
import TransfereeEducation from "./pages/student/transferees/Education.jsx";
import TransfereeInterview from "./pages/student/transferees/StudentInterview.jsx";
import TransfereeRequirements from "./pages/student/transferees/Requirements.jsx";
import TransfereeExam from "./pages/student/transferees/StudentExam.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Applications from "./pages/admin/Applications.jsx"
import Assesment from "./pages/admin/Assesment.jsx"

function App() {
  return (
    <Routes>

      {/* freshmen */}
      <Route path="/student_login" element={<StudentLogin />} />
      <Route path="/student_signup" element={<StudentSignUp />} />
      <Route path="/student_admission" element={<StudentAdmission />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/education" element={<Education />} />
      <Route path="/interview" element={<StudentInterview />} />
      <Route path="/requirements" element={<Requirements />} />
      <Route path="/exam" element={<StudentExam />} />

      {/* Transferee */}
      <Route path="/transferee_profile" element={<TransfereeProfile />} />
      <Route path="/transferee_education" element={<TransfereeEducation />} />
      <Route path="/transferee_interview" element={<TransfereeInterview />} />
      <Route path="/transferee_requirements" element={<TransfereeRequirements />} />
      <Route path="/transferee_exam" element={<TransfereeExam />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />    
      <Route path="/applications" element={<Applications />} />  
      <Route path="/assesment" element={<Assesment />} /> 

    </Routes>
  );
}

export default App;
