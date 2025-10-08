import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

type MultiRoleRegistrationFormProps = {
  onRegisterSuccess: () => void;
};

export default function MultiRoleRegistrationForm({ onRegisterSuccess }: MultiRoleRegistrationFormProps) {
  const [role, setRole] = useState("patient");

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Patient-specific
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);

  // Doctor-specific
  const [medicalLicense, setMedicalLicense] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [hospitalName, setHospitalName] = useState("");

  // Admin-specific
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [accessLevel, setAccessLevel] = useState("");

  // Guardian-specific
  const [patientName, setPatientName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Split full name
    const [first_name, ...rest] = fullName.trim().split(" ");
    const last_name = rest.join(" ");

    // Prepare base payload
    const payload: any = {
      role,
      email,
      password,
      first_name,
      last_name,
      phone,
    };

    // Add role-specific fields
    if (role === "patient") {
      payload.date_of_birth = dob;
      payload.gender = gender;
      payload.marital_status = maritalStatus;
      payload.address = address;
      payload.emergency_contact_name = emergencyContactName;
      payload.emergency_contact_phone = emergencyContactPhone;
      payload.insurance_provider = insuranceProvider;
      payload.policy_number = policyNumber;
      payload.medical_history = medicalHistory;
      payload.consent_given = consentGiven;
    } else if (role === "doctor") {
      payload.medical_license = medicalLicense;
      payload.specialization = specialty;
      payload.years_experience = yearsExperience ? parseInt(yearsExperience, 10) : undefined;
      payload.hospital_affiliation = hospitalName;
    } else if (role === "admin") {
      payload.employee_id = employeeId;
      payload.department = department;
      payload.role_title = roleTitle;
      payload.access_level = accessLevel;
    } else if (role === "guardian") {
      payload.patient_name = patientName;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      setError(null);
      onRegisterSuccess();
      navigate("/login");
    } catch {
      setError("Network or server error");
    }
  };

  // ... Render code remains unchanged (form fields & markup as you provided) ...
  // (You can keep your full JSX as-is here)

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-indigo-50 overflow-auto p-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-auto border-l-8 border-indigo-600 p-12">
        <div className="text-center mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Medicine_icon.svg"
            alt="Logo"
            className="mx-auto w-16 mb-4 cursor-pointer hover:animate-pulse transition"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Registration Form</h1>
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
              className={`px-6 py-2 rounded-xl font-bold text-lg border ${
                role === r
                  ? "bg-indigo-600 text-white border-indigo-700"
                  : "bg-gray-100 text-indigo-600 border-gray-300"
              } transition hover:bg-indigo-400 hover:text-white`}
              onClick={() => setRole(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-auto pr-4">
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition duration-300 text-lg"
            />
          </div>

          {/* Role Specific Fields */}
          {role === "patient" && (
            <>
              <section className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
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
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
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

              <section>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter your full address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none text-lg"
                />
              </section>

              <section className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Emergency Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter contact name"
                    required
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
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
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </section>

              <section className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Insurance Provider</label>
                  <input
                    type="text"
                    placeholder="Enter insurance provider"
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Policy Number</label>
                  <input
                    type="text"
                    placeholder="Enter policy number"
                    value={policyNumber}
                    onChange={(e) => setPolicyNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
              </section>

              <section>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Medical History / Allergies / Current Medications
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide relevant medical info"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none text-lg"
                />
              </section>

              <section className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  required
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-gray-700 text-base font-medium">
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
                    value={medicalLicense}
                    onChange={(e) => setMedicalLicense(e.target.value)}
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
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
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
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
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
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
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
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
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
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
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
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Access Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
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
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition text-lg"
              />
            </section>
          )}

          {/* Submit and Login */}
          <div className="mt-8 text-center">
            {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
            <button
              type="submit"
              className="w-full max-w-md mx-auto py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-extrabold shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300 drop-shadow-lg"
            >
              Register
            </button>
            <p className="mt-4 text-lg text-gray-700">
              Already have an acc?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
