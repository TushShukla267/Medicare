import React from 'react';
import { 
  LayoutDashboard, Activity, ShieldAlert, Video, BarChart3, UserCircle, Stethoscope, ChevronRight 
} from 'lucide-react';
import { NavigationItem, UserRole } from '../App';

interface SidebarProps {
  activeNav: NavigationItem;
  onNavigate: (nav: NavigationItem) => void;
  userRole: UserRole;
}

export function Sidebar({ activeNav, onNavigate, userRole }: SidebarProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['patient', 'doctor', 'admin', 'guardian'] },
    { id: 'vitals', label: 'Vital Signs', icon: Activity, roles: ['patient', 'doctor', 'admin', 'guardian'] },
    { id: 'fall-detection', label: 'Fall Detection', icon: ShieldAlert, roles: ['patient', 'doctor', 'admin' , 'guardian'] },
    { id: 'telemedicine', label: 'Telemedicine', icon: Video, roles: ['patient', 'doctor' , 'guardian'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['doctor', 'admin'] },
    { id: 'patient-portal', label: 'Patient Portal', icon: UserCircle, roles: ['patient', 'guardian'] },
    { id: 'doctor-portal', label: 'Doctor Portal', icon: Stethoscope, roles: ['doctor', 'admin'] },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as NavigationItem)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${
                isActive ? 'rotate-90 text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}