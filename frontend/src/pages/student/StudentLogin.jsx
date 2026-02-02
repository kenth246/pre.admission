import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

export default function StudentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username.trim() || !password.trim()) {
    alert("Please enter username and password");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/applicant/login", { username, password });

localStorage.setItem("token", response.data.token);
localStorage.setItem("username", username);

navigate("/student_admission");

// FORCE redirect so auth guard sees token
window.location.replace("/student_admission");

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || "Login failed. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};


  const handleResetSubmit = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${resetEmail}`);
    setIsModalOpen(false);
    setResetEmail("");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-md">
        <section className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 sm:p-8">
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="flex items-center gap-3">
              <img src="/img/btech.png" alt="BTECH logo" className="h-12 w-12 sm:h-18 sm:w-18 object-contain" />
              <img src="/img/iiti.png" alt="IITI logo" className="h-12 w-12 sm:h-18 sm:w-18 object-contain" />
            </div>
            <h4 className="text-green-700 font-extrabold text-2xl sm:text-3xl">BTECH IITI</h4>
            <p className="text-center text-gray-800 text-sm sm:text-base">Pre-Admission Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div>
              <label className="font-semibold text-sm">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="font-semibold text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex justify-end text-xs sm:text-sm">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(true)}
                className="text-gray-600 hover:underline"
              >
                Forgot Password
              </button>
            </div>

            <button type="submit" className="w-full bg-green-700 text-white py-2 sm:py-2.5 rounded-md hover:bg-green-800 transition font-bold">
              Sign In
            </button>

            <div className="flex justify-center gap-1 text-xs sm:text-sm pt-1">
              <span>Don't have an account?</span>
              <a href="/student_signup" className="text-green-700 font-semibold hover:underline">Sign Up</a>
            </div>
          </form>
        </section>
      </main>

      {/* Forgot Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-green-700 mb-2">Reset Password</h3>
            <p className="text-gray-600 text-sm mb-4">Enter your registered email address to receive a reset link.</p>
            
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full bg-gray-100 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <div className="flex flex-col gap-2">
                <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-md font-bold hover:bg-green-800 transition">
                  Send Reset Link
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}