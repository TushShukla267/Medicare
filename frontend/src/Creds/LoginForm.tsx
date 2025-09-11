import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type MultiRoleLoginFormProps = {
  onLoginSuccess: () => void;
};

export default function MultiRoleLoginForm({ onLoginSuccess }: MultiRoleLoginFormProps) {
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();  // TODO: call API and validate login
  onLoginSuccess(); // notify parent after successful login
  navigate("/home");
};

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-indigo-50 overflow-auto p-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-auto border-l-8 border-indigo-600 p-12">
        <div className="text-center mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Medicine_icon.svg"
            alt="Logo"
            className="mx-auto w-16 mb-4 cursor-pointer hover:animate-pulse transition"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Login
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Login as Patient, Doctor, Admin, or Guardian by selecting your role.
          </p>
        </div>

        {/* Role selection buttons */}
        <div className="flex gap-4 justify-center mb-8">
          {["patient", "doctor", "admin", "guardian"].map((r) => (
            <button
              key={r}
              type="button"
              className={`px-6 py-2 rounded-xl font-bold text-lg border 
                ${role === r ? "bg-indigo-600 text-white border-indigo-700" : "bg-gray-100 text-indigo-600 border-gray-300"} 
                transition hover:bg-indigo-400 hover:text-white`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Conditionally show login fields for selected role */}
        {role === "patient" && (
          <form
          onSubmit={handleSubmit} 
          className="space-y-8 max-h-[60vh] overflow-auto pr-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
              />
            </div>
            <p className="text-gray-600 text-sm italic">
              Use your registered email to login as a patient.
            </p>
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-full max-w-md mx-auto py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300 drop-shadow-lg"
              >
                Login
              </button>
              <p className="mt-4 text-lg text-gray-700">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </form>
        )}

        {role === "doctor" && (
          <form 
          onSubmit={handleSubmit}
          className="space-y-8 max-h-[60vh] overflow-auto pr-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Medical License or Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter medical license number or email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
              />
            </div>
            <p className="text-gray-600 text-sm italic">
              You can login using your medical license number or email.
            </p>
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-full max-w-md mx-auto py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300 drop-shadow-lg"
              >
                Login
              </button>
              <p className="mt-4 text-lg text-gray-700">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </form>
        )}

        {role === "admin" && (
          <form 
          onSubmit={handleSubmit}
          className="space-y-8 max-h-[60vh] overflow-auto pr-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Employee ID or Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter employee ID or email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
              />
            </div>
            <p className="text-gray-600 text-sm italic">
              Use your employee ID or email to access admin features.
            </p>
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-full max-w-md mx-auto py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300 drop-shadow-lg"
              >
                Login
              </button>
              <p className="mt-4 text-lg text-gray-700">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Register here
                </a>
              </p>
            </div>
          </form>
        )}

        {role === "guardian" && (
          <form 
          onSubmit={handleSubmit}
          className="space-y-8 max-h-[60vh] overflow-auto pr-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Patient Email or Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter associated patient email or phone"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
              />
            </div>
            <p className="text-gray-600 text-sm italic">
              Login with your associated patient’s email or phone number.
            </p>
            <div className="mt-8 text-center">
              <button
                type="submit"
                className="w-full max-w-md mx-auto py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300 drop-shadow-lg"
              >
                Login
              </button>

              <p className="mt-4 text-lg text-gray-700">
                Don’t have an account?{" "}
                <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
