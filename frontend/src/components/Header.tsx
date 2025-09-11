import React from 'react';
import { Heart, Bell, Settings, User } from 'lucide-react';
import { UserRole } from '../App';

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Header({ userRole, onRoleChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">MediWatch</h1>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Real-time Health Monitor
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={userRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="patient">Patient View</option>
            <option value="doctor">Doctor View</option>
            <option value="admin">Admin View</option>
            <option value="guardian">Guardian View</option>
          </select>

          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {userRole === 'patient' ? 'John Doe' : userRole === 'doctor' ? 'Dr. Smith' : 'Admin User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}