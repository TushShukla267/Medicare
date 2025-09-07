import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Phone, MapPin, Clock } from 'lucide-react';

interface EmergencyAlertProps {
  alert: {
    type: 'fall' | 'vital' | 'emergency';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
  onDismiss: () => void;
}

export function EmergencyAlert({ alert, onDismiss }: EmergencyAlertProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const severityColors = {
    low: 'bg-yellow-500 border-yellow-600 text-yellow-50',
    medium: 'bg-orange-500 border-orange-600 text-orange-50',
    high: 'bg-red-500 border-red-600 text-red-50',
    critical: 'bg-red-600 border-red-700 text-red-50'
  };

  const bgOverlay = {
    low: 'bg-yellow-900',
    medium: 'bg-orange-900',
    high: 'bg-red-900',
    critical: 'bg-red-950'
  };

  return (
    <div className={`fixed inset-0 z-50 ${bgOverlay[alert.severity]} bg-opacity-75 flex items-center justify-center p-4`}>
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full border-4 ${severityColors[alert.severity]} animate-pulse`}>
        <div className={`p-6 rounded-t-2xl ${severityColors[alert.severity]}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
              <div>
                <h2 className="text-xl font-bold">EMERGENCY ALERT</h2>
                <p className="text-sm opacity-90">{alert.severity.toUpperCase()} PRIORITY</p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">{alert.message}</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Alert active for {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              <Phone className="w-4 h-4" />
              <span>Call 911</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Phone className="w-4 h-4" />
              <span>Call Doctor</span>
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Location</span>
            </div>
            <p className="text-sm text-gray-600">Living Room - Main Floor</p>
            <p className="text-xs text-gray-500 mt-1">GPS: 40.7128° N, 74.0060° W</p>
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={onDismiss}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              False Alarm
            </button>
            <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              I'm OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}