import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

type MultiRoleRegistrationFormProps = {
  onRegisterSuccess: () => void;
};

export default function MultiRoleRegistrationForm({
  onRegisterSuccess,
}: MultiRoleRegistrationFormProps) {
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();  // TODO: send data to backend here
    onRegisterSuccess(); //Call the parent callback
    navigate("/login");
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-indigo-50 overflow-auto p-8"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-auto border-l-8 border-indigo-600 p-12">
        <div className="text-center mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Medicine_icon.svg"
            alt="Logo"
            className="mx-auto w-16 mb-4 cursor-pointer hover:animate-pulse transition"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Registration Form
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Register as Patient, Doctor, Admin, or Guardian by selecting your role.
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

        <form 
        onSubmit={handleSubmit}
        className="space-y-8 max-h-[80vh] overflow-auto pr-4">
          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email (optional)"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                pattern="[0-9]{10}"
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
                placeholder="Create password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
            />
          </div>

          {/* Role Specific Fields */}
          {role === "patient" && (
            <>
              {/* Personal Info */}
              <section className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
              </section>

              {/* Address */}
              <section>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter your full address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none text-lg"
                />
              </section>

              {/* Emergency Contact */}
              <section className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Emergency Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter contact name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Emergency Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter contact phone"
                    pattern="[0-9]{10}"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </section>

              {/* Insurance Info */}
              <section className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    placeholder="Enter insurance provider"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter policy number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </section>

              {/* Medical History */}
              <section>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Medical History / Allergies / Current Medications
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide relevant medical info"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none text-lg"
                />
              </section>

              {/* Consent */}
              <section className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  required
                  id="consent"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="consent"
                  className="text-gray-700 text-base font-medium"
                >
                  I consent to the hospital's privacy policy and agree to treatment.
                </label>
              </section>
            </>
          )}

          {role === "doctor" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Medical License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter license number"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter specialty (e.g., cardiology)"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter years"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Clinic / Hospital Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter clinic or hospital"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </div>
            </>
          )}

          {role === "admin" && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Employee ID"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Department"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Role Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter role title (e.g., HR Manager)"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Access Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {role === "guardian" && (
            <section>
              <label className="block text-gray-700 mb-2 font-semibold">
                Patient Name (optional)
              </label>
              <input
                type="text"
                placeholder="Enter the name of the patient you are serving"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </section>
          )}

          {/* Submit and Login */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="w-full max-w-md mx-auto py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300 drop-shadow-lg"
            >
              Register
            </button>
            <p className="mt-4 text-lg text-gray-700">
              Already have an acc?{" "}
              <a href="/login" className="text-indigo-600 font-semibold hover:underline">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}