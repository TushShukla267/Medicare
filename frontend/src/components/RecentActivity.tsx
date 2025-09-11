import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { UserRole } from '../App';

interface RecentActivityProps {
  userRole: UserRole;
}

export function RecentActivity({ userRole }: RecentActivityProps) {
  const activities = userRole === 'doctor' ? [
    { type: 'alert', message: 'Patient John Doe: Heart rate spike detected', time: '2 min ago', icon: AlertTriangle, color: 'text-red-600' },
    { type: 'normal', message: 'Consultation completed with Sarah Wilson', time: '15 min ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'activity', message: 'New vital signs data received', time: '1 hour ago', icon: Activity, color: 'text-blue-600' },
    { type: 'normal', message: 'Patient Michael Brown checked in', time: '2 hours ago', icon: CheckCircle, color: 'text-green-600' }
  ] : [
    { type: 'normal', message: 'Vital signs recorded successfully', time: '5 min ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'activity', message: 'Daily health report generated', time: '1 hour ago', icon: Activity, color: 'text-blue-600' },
    { type: 'normal', message: 'Medication reminder completed', time: '3 hours ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'activity', message: 'Sleep tracking data synced', time: '8 hours ago', icon: Activity, color: 'text-blue-600' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${
                activity.type === 'alert' ? 'bg-red-50' :
                activity.type === 'normal' ? 'bg-green-50' :
                'bg-blue-50'
              }`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}