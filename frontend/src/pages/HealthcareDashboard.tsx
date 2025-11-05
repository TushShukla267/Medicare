import { useState } from "react";
import { Heart, Activity, Users, Calendar, Bell, Settings, LogOut, Menu, X, Video, FileText, TrendingUp, AlertCircle, User, Stethoscope, UserPlus, Thermometer, Pill, ClipboardList } from "lucide-react";
import { PatientDashboard } from "@/components/dashboard/PatientDashboard";
import { DoctorDashboard } from "@/components/dashboard/DoctorDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { GuardianDashboard } from "@/components/dashboard/GuardianDashboard";
import { NavItem } from "@/components/dashboard/NavItem";

type Role = 'patient' | 'doctor' | 'admin' | 'guardian';

interface HealthcareDashboardProps {
  userRole: Role;
}

const roleColors = {
  patient: 'from-primary via-primary-glow to-primary',
  doctor: 'from-success via-success-glow to-success',
  admin: 'from-warning via-warning-glow to-warning',
  guardian: 'from-danger via-danger-glow to-danger'
};

const roleData = {
  patient: { name: "John Doe", initials: "JD" },
  doctor: { name: "Dr. Sarah Johnson", initials: "SJ" },
  admin: { name: "Admin User", initials: "AU" },
  guardian: { name: "Jane Doe", initials: "JD" }
};

export default function HealthcareDashboard({ userRole }: HealthcareDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const userData = roleData[userRole];

  const getNavigationItems = () => {
    switch(userRole) {
      case 'patient':
        return [
          { icon: Activity, label: "Overview", section: "overview" },
          { icon: Calendar, label: "Appointments", section: "appointments" },
          { icon: Pill, label: "Medications", section: "medications" },
          { icon: FileText, label: "Records", section: "records" },
          { icon: Video, label: "Telemedicine", section: "telemedicine" },
        ];
      case 'doctor':
        return [
          { icon: Activity, label: "Overview", section: "overview" },
          { icon: Calendar, label: "Schedule", section: "schedule" },
          { icon: Users, label: "Patients", section: "patients" },
          { icon: FileText, label: "Reports", section: "reports" },
          { icon: Video, label: "Consultations", section: "consultations" },
        ];
      case 'admin':
        return [
          { icon: Activity, label: "Dashboard", section: "overview" },
          { icon: Users, label: "Users", section: "users" },
          { icon: Stethoscope, label: "Doctors", section: "doctors" },
          { icon: Calendar, label: "Appointments", section: "appointments" },
          { icon: TrendingUp, label: "Analytics", section: "analytics" },
        ];
      case 'guardian':
        return [
          { icon: Activity, label: "Overview", section: "overview" },
          { icon: Users, label: "Dependents", section: "dependents" },
          { icon: Calendar, label: "Appointments", section: "appointments" },
          { icon: FileText, label: "Records", section: "records" },
        ];
    }
  };

  const getRoleSubtitle = () => {
    switch(userRole) {
      case 'patient': return "Here's your health summary";
      case 'doctor': return "You have 8 appointments today";
      case 'admin': return "System overview and analytics";
      case 'guardian': return "Monitor your dependents' health";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-card shadow-elegant transition-all duration-300 z-40 border-r border-border ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${roleColors[userRole]} flex items-center justify-center shadow-glow`}>
                  <Heart className="text-white" size={24} />
                </div>
                <span className="font-bold text-xl text-foreground">HealthCare</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-all"
            >
              {sidebarOpen ? <X size={20} className="text-muted-foreground" /> : <Menu size={20} className="text-muted-foreground" />}
            </button>
          </div>

          <nav className="space-y-2">
            {getNavigationItems().map((item) => (
              <NavItem
                key={item.section}
                icon={<item.icon />}
                label={item.label}
                active={activeSection === item.section}
                onClick={() => setActiveSection(item.section)}
                compact={!sidebarOpen}
              />
            ))}
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
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {userData.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {getRoleSubtitle()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 bg-card rounded-xl shadow-soft hover:shadow-elegant transition-all">
                <Bell size={20} className="text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full animate-pulse-slow"></span>
              </button>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${roleColors[userRole]} flex items-center justify-center text-white font-bold shadow-glow`}>
                {userData.initials}
              </div>
            </div>
          </div>
        </header>

        {/* Role-Specific Dashboard */}
        {userRole === 'patient' && <PatientDashboard activeSection={activeSection} />}
        {userRole === 'doctor' && <DoctorDashboard activeSection={activeSection} />}
        {userRole === 'admin' && <AdminDashboard activeSection={activeSection} />}
        {userRole === 'guardian' && <GuardianDashboard activeSection={activeSection} />}
      </main>
    </div>
  );
}
