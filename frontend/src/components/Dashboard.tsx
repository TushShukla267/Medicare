import React from 'react';
import { 
  Activity, Heart, Thermometer, Droplets, Shield, Users, Calendar, TrendingUp, User, Moon, Repeat 
} from 'lucide-react';
import { UserRole } from '../App';
import { VitalCard, VitalCardProps } from './VitalCard';
import { StatusCard, StatusCardProps } from './StatusCard';
import { RecentActivity } from './RecentActivity';

interface DashboardProps {
  userRole: UserRole;
}

export function Dashboard({ userRole }: DashboardProps) {
  // -------------------- Patient Vitals (Updated) --------------------
  const patientVitals = [
    { label: 'Hydration Level', value: '75', unit: '%', icon: Droplets, status: 'normal', trend: '+3%' },
    { label: 'Sleep Quality Score', value: '85', unit: '/100', icon: Moon, status: 'normal', trend: '+2%' },
    { label: 'Activity Level', value: '6.5K', unit: 'steps', icon: Activity, status: 'normal', trend: '+5%' },
    { label: 'Stress Index (HRV)', value: '60', unit: 'ms', icon: Repeat, status: 'normal', trend: '-1%' }
  ] as const;

  // -------------------- Admin Vitals --------------------
  const adminVitals = [
    { label: 'Avg. Health Score', value: '88', unit: '/100', icon: TrendingUp, status: 'normal', trend: '+3%' },
    { label: 'Total Appointments', value: '12.5K', unit: '', icon: Calendar, status: 'normal', trend: '+8%' }
  ] as const;

  // -------------------- Guardian Vitals --------------------
  const guardianVitals = [
    { label: 'Average Heart Rate', value: '70', unit: 'BPM', icon: Heart, status: 'normal', trend: '+1%' },
    { label: 'Average Activity', value: '5.8K', unit: 'steps', icon: Activity, status: 'normal', trend: '+4%' }
  ] as const;

  // -------------------- Status Cards --------------------
  const doctorStatusCards = [
    { label: 'Active Patients', value: '127', icon: Users, color: 'blue' },
    { label: 'Critical Alerts', value: '3', icon: Shield, color: 'red' },
    { label: 'Appointments Today', value: '8', icon: Calendar, color: 'green' },
    { label: 'Data Points Collected', value: '12.4K', icon: TrendingUp, color: 'purple' }
  ] as const;

  const patientStatusCards = [
    { label: 'Days Monitored', value: '45', icon: Calendar, color: 'blue' },
    { label: 'Health Score', value: '92/100', icon: TrendingUp, color: 'green' },
    { label: 'Active Sensors', value: '4', icon: Activity, color: 'purple' },
    { label: 'Fall Risk Level', value: 'Low', icon: Shield, color: 'green' }
  ] as const;

  const adminStatusCards = [
    { label: 'Total Users', value: '2,340', icon: Users, color: 'blue' },
    { label: 'Active Doctors', value: '78', icon: Activity, color: 'green' },
    { label: 'Active Patients', value: '2,120', icon: Activity, color: 'purple' },
    { label: 'System Alerts', value: '5', icon: Shield, color: 'red' }
  ] as const;

  const guardianStatusCards = [
    { label: 'Monitored Patients', value: '3', icon: Users, color: 'blue' },
    { label: 'Active Alerts', value: '1', icon: Shield, color: 'red' },
    { label: 'Upcoming Appointments', value: '2', icon: Calendar, color: 'green' },
    { label: 'System Notifications', value: '4', icon: TrendingUp, color: 'purple' }
  ] as const;

  // -------------------- Patient List for Doctors --------------------
  const patients = ['John Doe', 'Sarah Wilson', 'Michael Brown'];
  return (
    <div className="space-y-6">
      {/* Admin Dashboard Section */}
      {userRole === 'admin' && (
        <div className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage system users, performance, and reports</p>
          </header>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStatusCards.map((card, i) => (
              <StatusCard key={i} {...(card as StatusCardProps)} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminVitals.map((stat, i) => (
              <VitalCard key={i} {...(stat as VitalCardProps)} />
            ))}
          </div>
        </div>
      )}

      {/* General Dashboard Section */}
      {userRole === 'guardian' && (
        <div className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold">General Health Overview</h1>
            <p className="text-gray-600">Explore how the system works and track sample data</p>
          </header>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Platform Users', value: '2.3K+', icon: Users, color: 'blue' as const },
              { label: 'Appointments Today', value: '560', icon: Calendar, color: 'green' as const }
            ].map((card, i) => (
              <StatusCard key={i} {...card} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Avg Heart Rate', value: '75', unit: 'BPM', icon: Heart, status: 'normal' as const, trend: '+1%' },
              { label: 'Avg Activity', value: '6.2K', unit: 'steps', icon: Activity, status: 'normal' as const, trend: '+5%' }
            ].map((vital, i) => (
              <VitalCard key={i} {...vital} />
            ))}
          </div>
        </div>
      )}

      {/* Patients/Doctors/Guardians Dashboards */}
      {(userRole === 'doctor' || userRole === 'patient' || userRole === 'guardian') && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userRole === 'doctor' && 'Medical Dashboard'}
                {userRole === 'patient' && 'Health Dashboard'}
                {userRole === 'guardian' && 'Guardian Health Overview'}
              </h1>
              <p className="text-gray-600 mt-1">
                {userRole === 'doctor' && 'Monitor your patients and manage care remotely'}
                {userRole === 'patient' && 'Real-time monitoring of your health vitals and activity'}
                {userRole === 'guardian' && 'View and monitor your loved ones\' health status'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Live Monitoring</span>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRole === 'doctor' && doctorStatusCards.map((card, i) => (
              <StatusCard key={i} {...(card as StatusCardProps)} />
            ))}
            {userRole === 'patient' && patientStatusCards.map((card, i) => (
              <StatusCard key={i} {...(card as StatusCardProps)} />
            ))}
            {userRole === 'guardian' && guardianStatusCards.map((card, i) => (
              <StatusCard key={i} {...(card as StatusCardProps)} />
            ))}
          </div>

          {/* Vitals */}
          {(userRole === 'patient' || userRole === 'guardian') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userRole === 'patient' && patientVitals.map((v, i) => (
                <VitalCard key={i} {...(v as VitalCardProps)} />
              ))}
              {userRole === 'guardian' && guardianVitals.map((v, i) => (
                <VitalCard key={i} {...(v as VitalCardProps)} />
              ))}
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Trends */}
              {(userRole === 'doctor' || userRole === 'patient') && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Health Trends</h3>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-gray-600">Interactive charts and real-time data visualization</p>
                      <p className="text-sm text-gray-500 mt-1">Connected to live sensor data</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Overview (Doctor only) */}
              {userRole === 'doctor' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Overview</h3>
                  <div className="space-y-3">
                    {patients.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{p}</p>
                            <p className="text-sm text-gray-500">Last update: 2 min ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">Normal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {(userRole === 'doctor' || userRole === 'patient') && (
                <RecentActivity userRole={userRole} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}