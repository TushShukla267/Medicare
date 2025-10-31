import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

type MultiRoleLoginFormProps = {
  onLoginSuccess: () => void;
};

export default function MultiRoleLoginForm({ onLoginSuccess }: MultiRoleLoginFormProps) {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doctorIdentifier, setDoctorIdentifier] = useState("");
  const [adminIdentifier, setAdminIdentifier] = useState("");
  const [guardianIdentifier, setGuardianIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const getRoleInputValue = () => {
    if (role === "patient") return email;
    if (role === "doctor") return doctorIdentifier;
    if (role === "admin") return adminIdentifier;
    if (role === "guardian") return guardianIdentifier;
    return email;
  };

  const setRoleInputValue = (val: string) => {
    if (role === "patient") setEmail(val);
    else if (role === "doctor") setDoctorIdentifier(val);
    else if (role === "admin") setAdminIdentifier(val);
    else if (role === "guardian") setGuardianIdentifier(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifierValue = getRoleInputValue();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifierValue, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }
      setAuth(data.token, data.role);
      setError(null);
      onLoginSuccess();
      let redirectPath = "/home";
      if (data.role === "patient") redirectPath = "/patient-dashboard";
      else if (data.role === "doctor") redirectPath = "/doctor-dashboard";
      else if (data.role === "admin") redirectPath = "/admin-dashboard";
      else if (data.role === "guardian") redirectPath = "/guardian-dashboard";
      navigate(redirectPath);
    } catch (err) {
      setError("Network or server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form-container bg-gray-50 px-8 py-8 rounded-2xl shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Login</h2>
      <div className="flex flex-row gap-3 mb-6">
        {["patient", "doctor", "admin", "guardian"].map((r) => (
          <button
            type="button"
            onClick={() => setRole(r)}
            className={`px-4 py-2 rounded-xl font-semibold ${role === r ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700"}`}
            key={r}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
      <div className="mb-6">
        {role === "patient" && (
          <>
            <label className="block mb-2 text-gray-700">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              required
            />
            <label className="block mt-4 mb-2 text-gray-700">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
            />
            <p className="mt-2 text-sm text-indigo-600">Use your registered email to login as a patient.</p>
          </>
        )}
        {role === "doctor" && (
          <>
            <label className="block mb-2 text-gray-700">Medical License or Email *</label>
            <input
              type="text"
              value={doctorIdentifier}
              onChange={e => setDoctorIdentifier(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
            />
            <label className="block mt-4 mb-2 text-gray-700">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
            />
            <p className="mt-2 text-sm text-indigo-600">You can login using your medical license number or email.</p>
          </>
        )}
        {role === "admin" && (
          <>
            <label className="block mb-2 text-gray-700">Employee ID or Email *</label>
            <input
              type="text"
              value={adminIdentifier}
              onChange={e => setAdminIdentifier(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
            />
            <label className="block mt-4 mb-2 text-gray-700">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
            />
            <p className="mt-2 text-sm text-indigo-600">Use your employee ID or email to access admin features.</p>
          </>
        )}
        {role === "guardian" && (
          <>
            <label className="block mb-2 text-gray-700">Patient Email or Phone *</label>
            <input
              type="text"
              value={guardianIdentifier}
              onChange={e => setGuardianIdentifier(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
            />
            <label className="block mt-4 mb-2 text-gray-700">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
            />
            <p className="mt-2 text-sm text-indigo-600">Login with your associated patient’s email or phone number.</p>
          </>
        )}
        {error && <div className="mt-4 text-red-500 text-lg">{error}</div>}
      </div>
      <button
        type="submit"
        className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
      >
        Login
      </button>
      <div className="mt-6 text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="text-indigo-700 font-semibold hover:underline">Register here</Link>
      </div>
    </form>
  );
}
