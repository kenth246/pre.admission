import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }
    alert(`Logging in as ${email}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <main className="w-full max-w-md">
        <section className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/img/btech.png"
                alt="BTECH logo"
                className="h-18 w-18 object-contain"
              />
              <img
                src="/img/iiti.png"
                alt="IITI logo"
                className="h-18 w-18 object-contain"
              />
            </div>

            <h4 className="text-green-700 font-extrabold text-3xl">BTECH IITI</h4>
            <p className="text-center text-gray-800">
              Pre-Admission Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <h2 className="font-semibold">Email</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-gray-200 rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <h2 className="font-semibold">Password</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-gray-200 rounded-md px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="flex justify-end text-sm">
              <a href="#" className="text-gray-600 hover:underline">
                Forgot Password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
            >
              Login
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
