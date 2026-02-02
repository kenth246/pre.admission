<<<<<<< HEAD
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api.js";

export default function StudentSignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !username.trim() || !password.trim()) {
      setError("Please enter all required details");
      return;
    }

    try {
      setLoading(true);

      await api.post("/applicant/register", {
        email,
        username,
        password
      });

      alert("Account created successfully. Please login.");
      navigate("/student_login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <main className="w-full max-w-md">
        <section className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-3">
              <img src="/img/btech.png" alt="BTECH logo" className="h-12 w-12 object-contain" />
              <img src="/img/iiti.png" alt="IITI logo" className="h-12 w-12 object-contain" />
            </div>

            <h4 className="text-green-700 font-extrabold text-2xl">BTECH IITI</h4>
            <p className="text-center text-gray-800 text-sm">
              Pre-Admission Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <p className="text-red-600 text-sm font-semibold text-center">{error}</p>
            )}

            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-2.5 rounded-md hover:bg-green-800 transition font-bold shadow-md disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link to="/student_login" className="text-green-700 font-bold hover:underline">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
=======
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation

export default function StudentSignUp() {
  const [email, setEmail] = useState(""); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !username.trim() || !password.trim()) {
      alert("Please enter all details");
      return;
    }
    alert(`Signing up as ${username}`);
    navigate("/student_admission");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center sm:items-center justify-center p-4 sm:p-6">
      <main className="w-full max-w-md">
        <section className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 sm:p-8">
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/img/btech.png"
                alt="BTECH logo"
                className="h-12 w-12 sm:h-18 sm:w-18 object-contain" 
              />
              <img
                src="/img/iiti.png"
                alt="IITI logo"
                className="h-12 w-12 sm:h-18 sm:w-18 object-contain"
              />
            </div>

            <h4 className="text-green-700 font-extrabold text-2xl sm:text-3xl">BTECH IITI</h4>
            <p className="text-center text-gray-800 text-sm sm:text-base">
              Pre-Admission Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                required
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password" // Fixed: Changed from "........" to "password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2.5 rounded-md hover:bg-green-800 transition font-bold mt-2 shadow-md active:scale-95"
            >
              Create Account
            </button>

            {/* BACK TO LOGIN SECTION */}
            <div className="text-center mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/student_login" 
                  className="text-green-700 font-bold hover:underline"
                >
                  Back to Sign In
                </Link>
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
>>>>>>> 256611974d8899d35d39bb893041335fc87ff6df
