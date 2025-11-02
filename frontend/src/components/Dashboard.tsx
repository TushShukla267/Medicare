import React, { useState } from 'react';
import { Heart, Activity, Users, Calendar, Bell, Settings, LogOut, Menu, X, Phone, Video, FileText, TrendingUp, AlertCircle, Clock, User, Stethoscope, Shield, UserPlus, ChevronRight, Thermometer, Pill, ClipboardList } from 'lucide-react';
import { Telemedicine } from './Telemedicine'; // Import your telemedicine component here
import AppointmentScheduler from './Aptmtschd'; // Import your AppointmentScheduler

type Role = 'patient' | 'doctor' | 'admin' | 'guardian' | null;

// Mock data
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

  if (!userRole) return <div className="p-8">Loading...</div>;
  const roleColors = {
    patient: 'from-blue-500 to-cyan-500',
    doctor: 'from-emerald-500 to-teal-500',
    admin: 'from-purple-500 to-pink-500',
    guardian: 'from-orange-500 to-amber-500'
  };

  const getRoleData = () => {
    switch(userRole) {
      case 'patient': return patientData;
      case 'doctor': return doctorData;
      case 'admin': return adminData;
      case 'guardian': return guardianData;
      default: return null;
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'} min-h-screen`}>
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex gap-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-md text-sm font-medium transition bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${roleColors[userRole]} flex items-center justify-center`}>
                  <Heart className="text-white" size={24} />
                </div>
                <span className="font-bold text-xl text-gray-800 dark:text-white">HealthCare</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="space-y-2">
            {userRole === 'patient' && (
              <>
                <NavItem icon={<Activity />} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                <NavItem icon={<Calendar />} label="Appointments" active={activeSection === 'appointments'} onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                <NavItem icon={<Pill />} label="Medications" active={activeSection === 'medications'} onClick={() => setActiveSection('medications')} compact={!sidebarOpen} />
                <NavItem icon={<FileText />} label="Records" active={activeSection === 'records'} onClick={() => setActiveSection('records')} compact={!sidebarOpen} />
                <NavItem icon={<Video />} label="Telemedicine" active={activeSection === 'telemedicine'} onClick={() => setActiveSection('telemedicine')} compact={!sidebarOpen} />
              </>
            )}
            {userRole === 'doctor' && (
              <>
                <NavItem icon={<Activity />} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                <NavItem icon={<Calendar />} label="Schedule" active={activeSection === 'schedule'} onClick={() => setActiveSection('schedule')} compact={!sidebarOpen} />
                <NavItem icon={<Users />} label="Patients" active={activeSection === 'patients'} onClick={() => setActiveSection('patients')} compact={!sidebarOpen} />
                <NavItem icon={<FileText />} label="Reports" active={activeSection === 'reports'} onClick={() => setActiveSection('reports')} compact={!sidebarOpen} />
                <NavItem icon={<Video />} label="Consultations" active={activeSection === 'consultations'} onClick={() => setActiveSection('consultations')} compact={!sidebarOpen} />
              </>
            )}
            {userRole === 'admin' && (
              <>
                <NavItem icon={<Activity />} label="Dashboard" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                <NavItem icon={<Users />} label="Users" active={activeSection === 'users'} onClick={() => setActiveSection('users')} compact={!sidebarOpen} />
                <NavItem icon={<Stethoscope />} label="Doctors" active={activeSection === 'doctors'} onClick={() => setActiveSection('doctors')} compact={!sidebarOpen} />
                <NavItem icon={<Calendar />} label="Appointments" active={activeSection === 'appointments'} onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                <NavItem icon={<TrendingUp />} label="Analytics" active={activeSection === 'analytics'} onClick={() => setActiveSection('analytics')} compact={!sidebarOpen} />
              </>
            )}
            {userRole === 'guardian' && (
              <>
                <NavItem icon={<Activity />} label="Overview" active={activeSection === 'overview'} onClick={() => setActiveSection('overview')} compact={!sidebarOpen} />
                <NavItem icon={<Users />} label="Dependents" active={activeSection === 'dependents'} onClick={() => setActiveSection('dependents')} compact={!sidebarOpen} />
                <NavItem icon={<Calendar />} label="Appointments" active={activeSection === 'appointments'} onClick={() => setActiveSection('appointments')} compact={!sidebarOpen} />
                <NavItem icon={<FileText />} label="Records" active={activeSection === 'records'} onClick={() => setActiveSection('records')} compact={!sidebarOpen} />
              </>
            )}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <NavItem icon={<Settings />} label="Settings" compact={!sidebarOpen} />
            <NavItem icon={<LogOut />} label="Logout" compact={!sidebarOpen} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Welcome back, {getRoleData()?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {userRole === 'patient' && "Here's your health summary"}
                {userRole === 'doctor' && "You have 8 appointments today"}
                {userRole === 'admin' && "System overview and analytics"}
                {userRole === 'guardian' && "Monitor your dependents' health"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition">
                <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${roleColors[userRole]} flex items-center justify-center text-white font-bold shadow-md`}>
                {getRoleData()?.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </header>

        {/* Role-Specific Dashboard */}
        {userRole === 'patient' && (
          activeSection === 'telemedicine' ? (
            <Telemedicine userRole={userRole} />
          ) : (
            <PatientDashboard data={patientData} activeSection={activeSection} />
          )
        )}
        {userRole === 'doctor' && <DoctorDashboard data={doctorData} activeSection={activeSection} />}
        {userRole === 'admin' && <AdminDashboard data={adminData} activeSection={activeSection} />}
        {userRole === 'guardian' && <GuardianDashboard data={guardianData} activeSection={activeSection} />}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick = () => {}, compact = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        active 
          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${compact ? 'justify-center' : ''}`}
    >
      <span className={active ? 'scale-110' : ''}>{React.cloneElement(icon, { size: 20 })}</span>
      {!compact && <span className="font-medium">{label}</span>}
    </button>
  );
}

function PatientDashboard({ data, activeSection }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Vital Signs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            icon={<Heart className="text-red-500" />}
            label="Heart Rate"
            value={`${data.vitals.heartRate} bpm`}
            trend="+2%"
            color="red"
          />
          <StatCard 
            icon={<Activity className="text-blue-500" />}
            label="Blood Pressure"
            value={data.vitals.bloodPressure}
            trend="Normal"
            color="blue"
          />
          <StatCard 
            icon={<Thermometer className="text-orange-500" />}
            label="Temperature"
            value={`${data.vitals.temperature}°F`}
            trend="Normal"
            color="orange"
          />
          <StatCard 
            icon={<Activity className="text-green-500" />}
            label="Oxygen"
            value={`${data.vitals.oxygen}%`}
            trend="Good"
            color="green"
          />
        </div>
        {/* Appointments & Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Appointments</h2>
              <Calendar className="text-blue-500" size={24} />
            </div>
            <div className="space-y-4">
              {data.appointments.filter((a: any) => a.status === 'upcoming').map((apt: any) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition dark:from-blue-900 dark:to-cyan-900">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {apt.doctor.split(' ')[1][0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{apt.doctor}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{apt.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-white">{apt.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Current Medications</h2>
              <Pill className="text-purple-500" size={24} />
            </div>
            <div className="space-y-4">
              {data.medications.map((med: any, idx: number) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition dark:from-purple-900 dark:to-pink-900">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{med.name}</h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium dark:bg-purple-700 dark:text-purple-100">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{med.frequency}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prescribed by {med.prescribed}</p>
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
      <div className="max-w-2xl mx-auto py-12">
        <AppointmentScheduler onBook={(details) => {
          console.log('Booked appointment:', details);
        }} />
      </div>
    );
  }
  return <div className="text-center text-gray-500 dark:text-gray-400 mt-20">Content for {activeSection}</div>;
}

function DoctorDashboard({ data, activeSection }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users className="text-emerald-500" />}
            label="Today's Patients"
            value={data.stats.todayPatients}
            trend="+3 from yesterday"
            color="emerald"
          />
          <StatCard 
            icon={<FileText className="text-blue-500" />}
            label="Pending Reports"
            value={data.stats.pendingReports}
            trend="2 urgent"
            color="blue"
          />
          <StatCard 
            icon={<Users className="text-purple-500" />}
            label="Total Patients"
            value={data.stats.totalPatients}
            trend="+12 this month"
            color="purple"
          />
          <StatCard 
            icon={<TrendingUp className="text-yellow-500" />}
            label="Rating"
            value={`${data.stats.rating}/5.0`}
            trend="Excellent"
            color="yellow"
          />
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Today's Schedule</h2>
            <Clock className="text-emerald-500" size={24} />
          </div>
          <div className="space-y-3">
            {data.appointments.map((apt: any) => (
              <div key={apt.id} className={`flex items-center gap-4 p-4 rounded-xl transition hover:shadow-md ${
                apt.status === 'upcoming' ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900' : 'bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                  apt.status === 'upcoming' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-400'
                }`}>
                  {apt.time.split(':')[0]}:{apt.time.split(':')[1].split(' ')[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{apt.patient}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{apt.condition}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  apt.status === 'upcoming' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return <div className="text-center text-gray-500 dark:text-gray-400 mt-20">Content for {activeSection}</div>;
}

function AdminDashboard({ data, activeSection }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            icon={<Stethoscope className="text-purple-500" />}
            label="Total Doctors"
            value={data.stats.totalDoctors}
            trend="+2 this week"
            color="purple"
          />
          <StatCard 
            icon={<Users className="text-blue-500" />}
            label="Total Patients"
            value={data.stats.totalPatients}
            trend="+45 this month"
            color="blue"
          />
          <StatCard 
            icon={<Calendar className="text-emerald-500" />}
            label="Appointments"
            value={data.stats.appointments}
            trend="Today"
            color="emerald"
          />
          <StatCard 
            icon={<TrendingUp className="text-pink-500" />}
            label="Revenue"
            value={`$${(data.stats.revenue / 1000).toFixed(1)}k`}
            trend="+8.2% vs last month"
            color="pink"
          />
        </div>

        {/* Recent Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
              <Activity className="text-purple-500" size={24} />
            </div>
            <div className="space-y-4">
              {data.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    {activity.type === 'registration' && <UserPlus size={18} />}
                    {activity.type === 'appointment' && <Calendar size={18} />}
                    {activity.type === 'report' && <FileText size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{activity.user}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quick Actions</h2>
              <Shield className="text-purple-500" size={24} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionButton icon={<UserPlus />} label="Add Doctor" color="purple" />
              <QuickActionButton icon={<Users />} label="Manage Users" color="blue" />
              <QuickActionButton icon={<Calendar />} label="View Schedule" color="emerald" />
              <QuickActionButton icon={<FileText />} label="Reports" color="pink" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="text-center text-gray-500 dark:text-gray-400 mt-20">Content for {activeSection}</div>;
}

function GuardianDashboard({ data, activeSection }: any) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Dependents Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.dependents.map((dependent: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-2xl">
                  {dependent.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{dependent.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{dependent.relation} • {dependent.age} years old</p>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg dark:bg-orange-900">
                  <span className="text-gray-600 dark:text-orange-200">Last Visit</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{dependent.lastVisit}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg dark:bg-amber-900">
                  <span className="text-gray-600 dark:text-amber-200">Next Appointment</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{dependent.nextAppointment}</span>
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition">
                View Full Profile
              </button>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-orange-500" size={24} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Health Alerts</h2>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500 dark:bg-orange-900 dark:border-orange-700">
            <p className="font-semibold text-gray-800 dark:text-orange-300">Upcoming vaccination for Emma</p>
            <p className="text-sm text-gray-600 dark:text-orange-200 mt-1">Annual flu shot scheduled for Nov 10, 2025</p>
          </div>
        </div>
      </div>
    );
  }
  return <div className="text-center text-gray-500 dark:text-gray-400 mt-20">Content for {activeSection}</div>;
}

function StatCard({ icon, label, value, trend, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center`}>
          {icon}
        </div>
        <ChevronRight className="text-gray-400 dark:text-gray-300" size={20} />
      </div>
      <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">{label}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{trend}</p>
    </div>
  );
}

function QuickActionButton({ icon, label, color }: any) {
  return (
    <button className={`p-4 bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-900 dark:to-${color}-800 rounded-xl hover:shadow-md transition flex flex-col items-center gap-2`}>
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center text-white`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );
}
