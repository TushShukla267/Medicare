import React, { useState } from "react";

type Role = "admin" | "doctor" | "patient" | "guardian" | null;

type UnifiedDashboardProps = {
  userRole: Role;
};

export default function UnifiedDashboard({ userRole }: UnifiedDashboardProps) {
  const [darkMode, setDarkMode] = useState(false);

  if (!userRole) return <div className="p-8">Loading...</div>;

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-white p-8" : "min-h-screen bg-gray-50 p-8"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Dashboard Overview
          <span className="ml-3 text-lg font-normal italic">
            ({userRole.charAt(0).toUpperCase() + userRole.slice(1)})
          </span>
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded transition hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      
      {/* ADMIN SECTION */}
      {userRole === "admin" && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome, Admin!</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Total Doctors", value: 8, color: "text-blue-600" },
              { title: "Total Patients", value: 230, color: "text-green-600" },
              { title: "Appointments", value: 86, color: "text-yellow-600" },
              { title: "Pending Reports", value: 12, color: "text-red-600" },
            ].map((stat) => (
              <Card key={stat.title} title={stat.title} value={String(stat.value)} color={stat.color} />
            ))}
          </div>
        </section>
      )}

      {/* DOCTOR SECTION */}
      {userRole === "doctor" && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome, Doctor!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Appointments Today" value="14" color="text-blue-600" />
            <Card title="Total Patients" value="48" color="text-green-600" />
            <Card title="Pending Reports" value="6" color="text-yellow-600" />
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-3">Upcoming Appointments</h3>
            <table className="w-full text-sm text-left border-t">
              <thead>
                <tr className="text-gray-600 dark:text-gray-200">
                  <th className="py-2">Patient</th>
                  <th>Time</th>
                  <th>Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "John Doe", time: "10:30 AM", issue: "Fever" },
                  { name: "Sarah Lee", time: "11:15 AM", issue: "Chest Pain" },
                  { name: "Ali Khan", time: "1:00 PM", issue: "Headache" },
                ].map((a) => (
                  <tr key={a.name} className="border-t">
                    <td className="py-2">{a.name}</td>
                    <td>{a.time}</td>
                    <td>{a.issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PATIENT SECTION */}
      {userRole === "patient" && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome, Patient!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Appointments" value="5" color="text-blue-600" />
            <Card title="Prescriptions" value="12" color="text-green-600" />
            <Card title="Upcoming Visits" value="2" color="text-yellow-600" />
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-3">Health Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <HealthStat label="Heart Rate" value="76 bpm" color="text-red-500" />
              <HealthStat label="BP" value="120/80" color="text-blue-500" />
              <HealthStat label="BMI" value="22.5" color="text-green-500" />
              <HealthStat label="Sleep" value="7.5 hrs" color="text-purple-500" />
            </div>
          </div>
        </section>
      )}

      {/* GUARDIAN SECTION */}
      {userRole === "guardian" && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Welcome, Guardian!</h2>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-3">Dependents Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Emma", age: 10, lastVisit: "Aug 14, 2025" },
                { name: "Mohan", age: 45, lastVisit: "Sep 3, 2025" },
              ].map((d) => (
                <div key={d.name} className="border p-4 rounded-lg">
                  <p className="font-medium">{d.name}</p>
                  <p className="text-gray-500 text-sm">Age: {d.age}</p>
                  <p className="text-gray-500 text-sm">Last Visit: {d.lastVisit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-3">Upcoming Visits</h3>
            <p className="text-gray-600 dark:text-gray-300">No upcoming visits scheduled.</p>
          </div>
        </section>
      )}
    </div>
  );
}

/* Reusable card and stats components */
const Card = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => (
  <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition dark:bg-gray-800">
    <p className="text-gray-500 dark:text-gray-300">{title}</p>
    <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const HealthStat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div>
    <p className="text-gray-500 dark:text-gray-300">{label}</p>
    <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
  </div>
);
