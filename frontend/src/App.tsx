import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import  Dashboard   from './components/Dashboard';
import { VitalSigns } from './components/VitalSigns';
import { FallDetection } from './components/FallDetection';
import { Telemedicine } from './components/Telemedicine';
import { Analytics } from './components/Analytics';
import { EmergencyAlert } from './components/EmergencyAlert';
import { PatientPortal } from './components/PatientPortal';
import { DoctorPortal } from './components/DoctorPortal';

export type UserRole = 'patient' | 'doctor' | 'admin' | 'guardian';
export type NavigationItem = 'dashboard' | 'vitals' | 'fall-detection' | 'telemedicine' | 'analytics' | 'patient-portal' | 'doctor-portal';

function getRoleFromPath(path: string): UserRole {
  if (path.includes('doctor-dashboard')) return 'doctor';
  if (path.includes('admin-dashboard')) return 'admin';
  if (path.includes('patient-dashboard')) return 'patient';
  if (path.includes('guardian-dashboard')) return 'guardian';
  // Fallback if route is /home or unknown - you could also redirect, or show nothing
  return 'patient';
}

function App() {
  const [activeNav, setActiveNav] = useState<NavigationItem>('dashboard');
  const [emergencyAlert, setEmergencyAlert] = useState<{
    type: 'fall' | 'vital' | 'emergency';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  } | null>(null);

  const location = useLocation();
  const userRole = getRoleFromPath(location.pathname);

  // Simulate emergency alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        const alerts = [
          { type: 'fall' as const, message: 'Fall detected in living room', severity: 'critical' as const },
          { type: 'vital' as const, message: 'Heart rate above normal range', severity: 'high' as const },
          { type: 'emergency' as const, message: 'Emergency button pressed', severity: 'critical' as const }
        ];
        setEmergencyAlert(alerts[Math.floor(Math.random() * alerts.length)]);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveComponent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
      case 'vitals':
        return <VitalSigns />;
      case 'fall-detection':
        return <FallDetection />;
      case 'telemedicine':
        return <Telemedicine userRole={userRole} />;
      case 'analytics':
        return <Analytics />;
      case 'patient-portal':
        return <PatientPortal />;
      case 'doctor-portal':
        return <DoctorPortal />;
      // no default hardcoding!
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {emergencyAlert && (
        <EmergencyAlert
          alert={emergencyAlert}
          onDismiss={() => setEmergencyAlert(null)}
        />
      )}
      <main className="flex-1 p-6 ml-64">
        {renderActiveComponent()}
      </main>
    </div>
  );
}

export default App;
