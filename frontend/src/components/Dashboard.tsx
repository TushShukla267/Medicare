import React, { useState } from 'react';
import {
  Heart, Activity, Users, Calendar, Bell, Settings, LogOut, Menu, X, Phone,
  Video, FileText, TrendingUp, AlertCircle, Clock, User, Stethoscope, Shield,
  UserPlus, ChevronRight, Thermometer, Pill, ClipboardList
} from 'lucide-react';
import { Telemedicine } from './Telemedicine';
import AppointmentScheduler from './Aptmtschd';
import AppointmentReceiver from './Aptmtrcvr';
import { NavItem } from '../UI/dashboard/NavItem';
import { useNavigate } from 'react-router-dom';
import { PatientPortal } from './Medications';
import  ApmtLog  from './Aptmtlog';
import { Analytics } from './Analytics';
import VideoStream, { VideoMode } from './VideoMode';

type Role = 'patient' | 'doctor' | 'admin' | 'guardian' | null;

const patientData = {
  name: "John Doe",
  age: 45,
  bloodType: "O+",
  appointments: [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "Nov 5, 2025", time: "10:30 AM", status: "upcoming" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "General Practice", date: "Oct 28, 2025", time: "2:00 PM", status: "completed" }
  ],
  vitals: {
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygen: 98
  },
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "Dr. Sarah Johnson" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "Dr. Michael Chen" }
  ]
};

const doctorData = {
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  appointments: [
    { id: 1, patient: "John Doe", time: "10:30 AM", condition: "Hypertension Follow-up", status: "upcoming" },
    { id: 2, patient: "Emma Wilson", time: "11:15 AM", condition: "Chest Pain", status: "upcoming" },
    { id: 3, patient: "Michael Brown", time: "2:00 PM", condition: "Annual Checkup", status: "completed" }
  ],
  stats: {
    todayPatients: 8,
    pendingReports: 5,
    totalPatients: 156,
    rating: 4.8
  }
};

const adminData = {
  name: "Admin User",
  stats: {
    totalDoctors: 24,
    totalPatients: 1247,
    appointments: 89,
    revenue: 45678
  },
  recentActivity: [
    { type: "registration", user: "Dr. James Wilson", time: "2 hours ago" },
    { type: "appointment", user: "Patient #1245", time: "3 hours ago" },
    { type: "report", user: "Lab Report Generated", time: "5 hours ago" }
  ]
};

const guardianData = {
  name: "Jane Doe",
  dependents: [
    { name: "Emma Doe", age: 10, relation: "Daughter", lastVisit: "Oct 15, 2025", nextAppointment: "Nov 10, 2025" },
    { name: "Robert Doe", age: 70, relation: "Father", lastVisit: "Oct 20, 2025", nextAppointment: "Nov 5, 2025" }
  ]
};

type UnifiedDashboardProps = {
  userRole: Role;
};

export default function HealthcareDashboard({ userRole }: UnifiedDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  if (!userRole) return <div className="p-8">Loading...</div>;

  const roleColors = {
    patient: 'from-blue-500 to-cyan-600',
    doctor: 'from-emerald-500 to-teal-600',
    admin: 'from-purple-500 to-pink-600',
    guardian: 'from-orange-500 to-amber-600'
  };

  const getRoleData = () => {
    switch (userRole) {
      case 'patient': return patientData;
      case 'doctor': return doctorData;
      case 'admin': return adminData;
      case 'guardian': return guardianData;
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 min-h-screen w-screen overflow-auto
      ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}
      transition-colors duration-700 z-50 font-sans`}>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${darkMode ? 'bg-gray-900' : 'bg-white'}
        shadow-2xl transition-all duration-400 z-40 flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'} animate-slide-in`}>
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-10">
              <div
                className="flex items-center gap-3 animate-fadeIn cursor-pointer select-none"
                onClick={() => setSidebarOpen((open) => !open)}
                tabIndex={0}
                role="button"
                title="Toggle sidebar"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSidebarOpen((open) => !open); }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${roleColors[userRole]} flex items-center justify-center shadow-lg`}>
                  <Heart className="text-white" size={28} />
                </div>
                {sidebarOpen && (
                  <span className={`font-extrabold text-2xl tracking-wide ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    HealthCare
                  </span>
                )}
              </div>
            </div>
            <nav className="space-y-3">
              {userRole === 'patient' && (
                <>
                  <NavItem icon={<Activity />} label="Overview" active={activeSection === 'overview'}
                    onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                  <NavItem icon={<Calendar />} label="Appointments" active={activeSection === 'appointments'}
                    onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                  <NavItem icon={<Pill />} label="Medications" active={activeSection === 'medications'}
                    onClick={() => setActiveSection('medications')} compact={!sidebarOpen} />
                  <NavItem icon={<FileText />} label="Reports" active={activeSection === 'reports'}
                    onClick={() => setActiveSection('reports')} compact={!sidebarOpen} />
                  <NavItem icon={<Video />} label="Telemedicine" active={activeSection === 'telemedicine'}
                    onClick={() => setActiveSection('telemedicine')} compact={!sidebarOpen} />
                </>
              )}
              {userRole === 'doctor' && (
                <>
                  <NavItem icon={<Activity />} label="Overview" active={activeSection === 'overview'}
                    onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                  <NavItem icon={<Calendar />} label="Schedule" active={activeSection === 'appointments'}
                    onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                  <NavItem icon={<Users />} label="Patients" active={activeSection === 'patients'}
                    onClick={() => setActiveSection('patients')} compact={!sidebarOpen} />
                  <NavItem icon={<FileText />} label="Reports" active={activeSection === 'reports'}
                    onClick={() => setActiveSection('reports')} compact={!sidebarOpen} />
                  <NavItem icon={<Video />} label="Telemedicine" active={activeSection === 'telemedicine'}
                    onClick={() => setActiveSection('telemedicine')} compact={!sidebarOpen} />
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <NavItem icon={<Activity />} label="Dashboard" active={activeSection === 'overview'}
                    onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                  <NavItem icon={<Users />} label="Users" active={activeSection === 'users'}
                    onClick={() => setActiveSection('users')} compact={!sidebarOpen} />
                  <NavItem icon={<Stethoscope />} label="Doctors" active={activeSection === 'doctors'}
                    onClick={() => setActiveSection('doctors')} compact={!sidebarOpen} />
                  <NavItem icon={<Calendar />} label="Appointments" active={activeSection === 'appointments'}
                    onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                  <NavItem icon={<TrendingUp />} label="Analytics" active={activeSection === 'analytics'}
                    onClick={() => setActiveSection('analytics')} compact={!sidebarOpen} />
                </>
              )}
              {userRole === 'guardian' && (
                <>
                  <NavItem icon={<Activity />} label="Overview" active={activeSection === 'overview'}
                    onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                  <NavItem icon={<Users />} label="Dependents" active={activeSection === 'dependents'}
                    onClick={() => setActiveSection('dependents')} compact={!sidebarOpen} />
                  <NavItem icon={<Calendar />} label="Appointments" active={activeSection === 'appointments'}
                    onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                  <NavItem icon={<FileText />} label="Records" active={activeSection === 'records'}
                    onClick={() => setActiveSection('records')} compact={!sidebarOpen} />
                  <NavItem icon={<Video />} label="Telemedicine" active={activeSection === 'telemedicine'}
                    onClick={() => setActiveSection('telemedicine')} compact={!sidebarOpen} />
                </>
              )}
            </nav>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
            <NavItem icon={<Settings />} label="Settings" compact={!sidebarOpen} />
            <NavItem icon={<LogOut />} label="Logout" compact={!sidebarOpen}
              onClick={() => {
                navigate('/login');
              }} />
          </div>
        </div>
      </aside>

      <main className={`transition-all duration-500 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8 animate-fadeIn min-h-screen`}>
        <header className="mb-10 flex items-center justify-between animate-fadeIn">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-wide transition-colors duration-500">
              Welcome back, {getRoleData()?.name}!
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 transition-colors duration-500">
              {userRole === 'patient' && "Here's your health summary"}
              {userRole === 'doctor' && "You have 8 appointments today"}
              {userRole === 'admin' && "System overview and analytics"}
              {userRole === 'guardian' && "Monitor your dependents' health"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-4 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-400 animate-bounce">
              <Bell size={24} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg text-base font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-cyan-400 outline-none transition"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <div className={`w-14 h-14 rounded-3xl bg-gradient-to-r ${roleColors[userRole]}
              flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {getRoleData()?.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          </div>
        </header>

        {userRole === 'patient' && (
          activeSection === 'telemedicine' ? (
            <Telemedicine userRole={userRole} />
          ) : activeSection === 'appointments' ? (
            <AppointmentScheduler onBook={(details: any) => {
              console.log('Booked appointment:', details);
            }} />
          ) : activeSection === 'medications' ? (
            <PatientPortal />
          ) : (
            <PatientDashboard data={patientData} activeSection={activeSection} dark={darkMode} />
          )
        )}

        {userRole === 'doctor' && (
          activeSection === 'telemedicine' ? (
            <Telemedicine userRole={userRole} />
          ) : activeSection === 'appointments' ? (
            <AppointmentReceiver doctorId={1} />
          ) : activeSection === 'reports' ? (
            <ReportsSection dark={darkMode} />
          ) : (
            <DoctorDashboard data={doctorData} activeSection={activeSection} dark={darkMode} />
          )
        )}

        {userRole === 'admin' && (
          activeSection === 'analytics' ? (
            <Analytics />
          ) : activeSection === 'appointments' ? (
            <ApmtLog />
          ) : (
            <AdminDashboard data={adminData} activeSection={activeSection} dark={darkMode} />
          )
        )}

        {userRole === 'guardian' && (
          activeSection === 'telemedicine' ? (
            <Telemedicine userRole={userRole} />
          ) : activeSection === 'appointments' ? (
            <AppointmentScheduler onBook={(details: any) => {
              console.log('Booked appointment:', details);
            }} />
          ) : (
            <GuardianDashboard data={guardianData} activeSection={activeSection} dark={darkMode} />
          )
        )}
      </main>
    </div>
  );
}

function PatientDashboard({ data, activeSection, dark }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-10 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<Heart className="text-red-500 animate-heartbeat" />}
            label="Heart Rate"
            value={`${data.vitals.heartRate} bpm`}
            trend="Normal"
            color="red"
            darkMode={dark}
          />
          <StatCard
            icon={<Thermometer className="text-orange-500 animate-pulse" />}
            label="Temperature"
            value={`${data.vitals.temperature}°F`}
            trend="Normal body temp"
            color="orange"
            darkMode={dark}
          />
          <StatCard
            icon={<Activity className="text-blue-500 animate-bounce" />}
            label="Acceleration"
            value={`${data.vitals.acceleration ?? 0} m/s²`}
            trend="Motion sensor"
            color="blue"
            darkMode={dark}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-transform hover:scale-105 duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Upcoming Appointments
              </h2>
              <Calendar className="text-blue-600" size={26} />
            </div>
            <div className="space-y-6">
              {data.appointments
                .filter((a: any) => a.status === 'upcoming')
                .map((apt: any) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-5 p-5 bg-accent/60 rounded-2xl border border-border transition-shadow hover:shadow-lg animate-fadeIn"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg animate-bounce shadow-md shadow-cyan-400/70">
                      {apt.doctor.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {apt.doctor}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {apt.specialty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {apt.date}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {apt.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-transform hover:scale-105 duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Current Medications
              </h2>
              <Pill className="text-purple-600 animate-pulse" size={26} />
            </div>
            <div className="space-y-6">
              {data.medications.map((med: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 bg-accent/50 rounded-2xl border border-border transition-shadow hover:shadow-lg animate-fadeIn"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {med.name}
                    </h3>
                    <span className="px-4 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold dark:bg-purple-800 dark:text-purple-200">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {med.frequency}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Prescribed by {med.prescribed}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'appointments') {
    return (
      <div className="max-w-5xl mx-auto py-16 animate-fadeIn">
        <ApmtLog />
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-24 animate-fadeIn">
      Content for {activeSection}
    </div>
  );
}

function DoctorDashboard({ data, activeSection, dark }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard
            icon={<Users className="text-emerald-500 animate-bounce" />}
            label="Today's Patients"
            value={data.stats.todayPatients}
            trend="+3 from yesterday"
            color="emerald"
            darkMode={dark}
          />
          <StatCard
            icon={<FileText className="text-blue-500 animate-pulse" />}
            label="Pending Reports"
            value={data.stats.pendingReports}
            trend="2 urgent"
            color="blue"
            darkMode={dark}
          />
          <StatCard
            icon={<Users className="text-purple-500 animate-bounce" />}
            label="Total Patients"
            value={data.stats.totalPatients}
            trend="+12 this month"
            color="purple"
            darkMode={dark}
          />
          <StatCard
            icon={<TrendingUp className="text-yellow-500 animate-pulse" />}
            label="Rating"
            value={`${data.stats.rating}/5.0`}
            trend="Excellent"
            color="yellow"
            darkMode={dark}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-transform hover:scale-105 duration-300 animate-fadeIn">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Today's Schedule</h2>
            <Clock className="text-emerald-500 animate-bounce" size={26} />
          </div>
          <div className="space-y-5">
            {data.appointments.map((apt: any) => (
              <div
                key={apt.id}
                className={`flex items-center gap-6 p-5 rounded-2xl border transition-shadow hover:shadow-lg animate-fadeIn ${
                  apt.status === 'upcoming'
                    ? 'bg-accent/60 border-success/30 shadow-success/40'
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                    apt.status === 'upcoming'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      : 'bg-gray-500/40'
                  }`}
                >
                  {apt.time.split(':')[0]}:{apt.time.split(':')[1].split(' ')[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{apt.patient}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{apt.condition}</p>
                </div>
                <span
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${
                    apt.status === 'upcoming' ? 'bg-success/30 text-success' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'appointments') {
    return (
      <div className="max-w-3xl mx-auto py-16 animate-fadeIn">
        <AppointmentReceiver doctorId={data.id} />
      </div>
    );
  }

  if (activeSection === 'patients') {
    return (
      <div className="space-y-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Patients
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Quick view of your active, follow-up, and high-priority patients.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-3 pr-4">Patient</th>
                  <th className="py-3 pr-4">Condition</th>
                  <th className="py-3 pr-4">Last visit</th>
                  <th className="py-3 pr-4">Next appointment</th>
                  <th className="py-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.patients?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-semibold">
                          {p.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {p.age} yrs • {p.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-700 dark:text-gray-300">
                      {p.condition}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-400">
                      {p.lastVisit}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-400">
                      {p.nextAppointment}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'High priority' || p.status === 'Critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : p.status === 'Follow-up' || p.status === 'Scheduled' || p.status === 'upcoming'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500 dark:text-gray-400 mt-24 animate-fadeIn">
      Content for {activeSection}
    </div>
  );
}

function AdminDashboard({ data, activeSection, dark }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-10 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          <StatCard icon={<Stethoscope className="text-purple-500 animate-bounce" />} label="Total Doctors" value={data.stats.totalDoctors} trend="+2 this week" color="purple" darkMode={dark} />
          <StatCard icon={<Users className="text-blue-500 animate-bounce" />} label="Total Patients" value={data.stats.totalPatients} trend="+45 this month" color="blue" darkMode={dark} />
          <StatCard icon={<Calendar className="text-emerald-500 animate-pulse" />} label="Appointments" value={data.stats.appointments} trend="Today" color="emerald" darkMode={dark} />
          <StatCard icon={<TrendingUp className="text-pink-500 animate-bounce" />} label="Revenue" value={`$${(data.stats.revenue / 1000).toFixed(1)}k`} trend="+8.2% vs last month" color="pink" darkMode={dark} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-transform hover:scale-105 duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
              <Activity className="text-purple-600 animate-pulse" size={26} />
            </div>
            <div className="space-y-6">
              {data.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center gap-5 p-4 bg-accent/60 rounded-2xl border border-border animate-fadeIn shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white animate-bounce shadow-lg">
                    {activity.type === 'registration' && <UserPlus size={20} />}
                    {activity.type === 'appointment' && <Calendar size={20} />}
                    {activity.type === 'report' && <FileText size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-transform hover:scale-105 duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
              <Shield className="text-purple-600 animate-bounce" size={26} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <button className="flex flex-col items-center gap-3 py-5 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-400 rounded-xl">
                <UserPlus size={26} className="text-purple-600 animate-pulse" />
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">Add Doctor</span>
              </button>
              <button className="flex flex-col items-center gap-3 py-5 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-xl">
                <Users size={26} className="text-blue-600 animate-bounce" />
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">Manage Users</span>
              </button>
              <button className="flex flex-col items-center gap-3 py-5 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-400 rounded-xl">
                <Calendar size={26} className="text-emerald-600 animate-pulse" />
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">View Schedule</span>
              </button>
              <button className="flex flex-col items-center gap-3 py-5 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-400 rounded-xl">
                <FileText size={26} className="text-pink-600 animate-bounce" />
                <span className="text-base font-semibold text-gray-700 dark:text-gray-300">Reports</span>
              </button>
            </div>
          </div>
        </div>
        {/* Add appointment log section to overview if wanted */}
      </div>
    );
  }
  if (activeSection === 'appointments') {
    return (
      <div className="max-w-5xl mx-auto py-16 animate-fadeIn">
        <ApmtLog />
      </div>
    );
  }
  return <div className="text-center text-gray-500 dark:text-gray-400 mt-24 animate-fadeIn">Content for {activeSection}</div>;
}

function GuardianDashboard({ data, activeSection, dark }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-10 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.dependents.map((dep: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 hover:scale-105 transition-transform duration-300 animate-fadeIn">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-3xl animate-bounce shadow-lg">
                  {dep.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{dep.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{dep.relation} • {dep.age} years old</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-800 rounded-lg animate-fadeIn shadow-sm">
                  <span className="text-orange-700 dark:text-orange-200 font-semibold">Last Visit</span>
                  <span className="font-semibold text-gray-900 dark:text-orange-100">{dep.lastVisit}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-800 rounded-lg animate-fadeIn shadow-sm">
                  <span className="text-amber-700 dark:text-amber-200 font-semibold">Next Appointment</span>
                  <span className="font-semibold text-gray-900 dark:text-amber-100">{dep.nextAppointment}</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-3xl hover:scale-105 hover:shadow-xl transition-transform animate-fadeIn focus:outline-none focus:ring-4 focus:ring-orange-400">
                View Full Profile
              </button>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 animate-fadeIn mt-10">
          <div className="flex items-center gap-4 mb-5">
            <AlertCircle className="text-orange-600 animate-pulse" size={28} />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Health Alerts</h2>
          </div>
          <div className="p-6 bg-orange-50 dark:bg-orange-900 rounded-2xl border-l-8 border-orange-600 dark:border-orange-800 animate-fadeIn shadow-inner">
            <p className="font-semibold text-gray-900 dark:text-orange-300">Upcoming vaccination for Emma</p>
            <p className="text-sm text-gray-600 dark:text-orange-200 mt-2">Annual flu shot scheduled for Nov 10, 2025</p>
          </div>
        </div>
      </div>
    );
  }
  if (activeSection === 'appointments') {
    return (
      <div className="max-w-3xl mx-auto py-16 animate-fadeIn">
        <AppointmentScheduler onBook={(details: any) => {
          console.log('Booked appointment:', details);
        }} />
      </div>
    );
  }
  return <div className="text-center text-gray-500 dark:text-gray-400 mt-24 animate-fadeIn">Content for {activeSection}</div>;
}

function ReportsSection({ dark }: { dark: boolean }) {
  const [streamUrl, setStreamUrl] = useState('ws://localhost:8080/stream');
  const [streamMode, setStreamMode] = useState<'mjpeg' | 'ws'>('ws');


  return (
    <div className="space-y-8">
      <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-8`}>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Medical Imaging & Reports
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          View live medical imaging streams and patient monitoring data
        </p>


        {/* Stream Configuration */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Stream URL
            </label>
            <input
              type="text"
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter stream URL"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setStreamMode('ws')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                streamMode === 'ws'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              WebSocket Mode
            </button>
            <button
              onClick={() => setStreamMode('mjpeg')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                streamMode === 'mjpeg'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              MJPEG Mode
            </button>
          </div>
        </div>


        {/* Video Stream */}
        <VideoStream
          src={streamUrl}
          mode={streamMode}
          onStatusChange={(status) => console.log('Stream status:', status)}
        />


        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Configuration Instructions:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• WebSocket mode: Use ws:// or wss:// protocol</li>
            <li>• MJPEG mode: Use http:// or https:// protocol</li>
            <li>• Ensure your backend streaming service is running</li>
            <li>• Check firewall settings if connection fails</li>
          </ul>
        </div>
      </div>


      {/* Sample Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="text-emerald-500" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lab Reports</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Recent patient lab results and analysis</p>
        </div>
        <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6`}>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-blue-500" size={24} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Vitals History</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Patient vital signs monitoring data</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color, darkMode }: any) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 hover:scale-105 transition-transform duration-300 animate-fadeIn cursor-pointer`}>
      <div className="flex items-center justify-between mb-5">
        <div className={`w-14 h-14 rounded-3xl bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center shadow-md`}>
          {icon}
        </div>
        <ChevronRight className="text-gray-400 dark:text-gray-300" size={22} />
      </div>
      <h3 className="text-gray-700 dark:text-gray-300 text-base font-semibold mb-1">{label}</h3>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">{value}</p>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{trend}</p>
    </div>
  );
}

function QuickActionButton({ icon, label, color }: any) {
  return (
    <button className={`p-5 bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-900 dark:to-${color}-800 rounded-3xl hover:scale-105 transition-transform duration-300 flex flex-col items-center gap-3 animate-fadeIn shadow-lg`}>
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-${color}-500 to-${color}-600 dark:from-${color}-700 dark:to-${color}-800 flex items-center justify-center text-white shadow-md`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <span className="text-base font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
}
