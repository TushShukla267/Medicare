import React, { useState } from 'react';
import { ShieldAlert, Camera, Smartphone, AlertTriangle, CheckCircle, MapPin, Clock } from 'lucide-react';

export function FallDetection() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [sensitivity, setSensitivity] = useState(75);

  const recentEvents = [
    { type: 'normal', message: 'Regular movement detected in kitchen', time: '2 min ago', location: 'Kitchen' },
    { type: 'normal', message: 'Sitting position maintained in living room', time: '15 min ago', location: 'Living Room' },
    { type: 'alert', message: 'Rapid movement detected - False alarm cleared', time: '1 hour ago', location: 'Bedroom' },
    { type: 'normal', message: 'Walking pattern normal in hallway', time: '2 hours ago', location: 'Hallway' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fall Detection System</h1>
          <p className="text-gray-600 mt-1">AI-powered fall detection using computer vision and motion sensors</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className={`text-sm font-medium ${isMonitoring ? 'text-green-600' : 'text-gray-500'}`}>
              {isMonitoring ? 'Active Monitoring' : 'Monitoring Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMonitoring 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? 'Pause Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Monitoring Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Computer Vision</h3>
              <p className="text-sm text-gray-600">4 cameras active</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Living Room</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bedroom</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kitchen</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bathroom</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Wearable Sensors</h3>
              <p className="text-sm text-gray-600">Motion & impact detection</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Smartwatch</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chest Sensor</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fall Risk Assessment</h3>
              <p className="text-sm text-gray-600">AI-powered analysis</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">LOW</div>
            <p className="text-sm text-gray-600">Risk Level</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensitivity Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Settings</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensitivity Level: {sensitivity}%
            </label>
            <input
              type="range"
              min="25"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Less Sensitive</span>
              <span>More Sensitive</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Emergency Contacts</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Manage
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Dr. Sarah Johnson - Primary Care</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Emergency Services - 911</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Family Contact - Jane Doe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Detection Events</h3>
        <div className="space-y-4">
          {recentEvents.map((event, index) => {
            const isAlert = event.type === 'alert';
            return (
              <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${
                isAlert ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
              }`}>
                <div className={`p-2 rounded-lg ${isAlert ? 'bg-amber-100' : 'bg-green-100'}`}>
                  {isAlert ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.message}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}