import React, { useState } from 'react';
import { Users, Calendar, AlertTriangle, FileText, Video, MessageCircle, Search, Filter, User, Activity } from 'lucide-react';

export function DoctorPortal() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    {
      id: '1',
      name: 'John Doe',
      age: 68,
      condition: 'Hypertension',
      status: 'stable',
      lastContact: '2 hours ago',
      riskLevel: 'low',
      vitals: { heartRate: 72, bp: '120/80', temp: 98.6 }
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      age: 45,
      condition: 'Diabetes Type 2',
      status: 'monitoring',
      lastContact: '1 day ago',
      riskLevel: 'medium',
      vitals: { heartRate: 78, bp: '135/85', temp: 99.1 }
    },
    {
      id: '3',
      name: 'Michael Brown',
      age: 72,
      condition: 'Heart Disease',
      status: 'critical',
      lastContact: '30 min ago',
      riskLevel: 'high',
      vitals: { heartRate: 95, bp: '150/95', temp: 98.8 }
    }
  ];

  const alerts = [
    { patient: 'Michael Brown', type: 'Vital Signs', message: 'Blood pressure elevated', time: '15 min ago', severity: 'high' },
    { patient: 'Sarah Wilson', type: 'Medication', message: 'Missed evening dose', time: '2 hours ago', severity: 'medium' },
    { patient: 'John Doe', type: 'Activity', message: 'Unusual movement pattern', time: '4 hours ago', severity: 'low' }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Portal</h1>
          <p className="text-gray-600 mt-1">Manage patient care and monitor health remotely</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Video className="w-4 h-4" />
            <span>Start Consultation</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${
              alert.severity === 'high' ? 'bg-red-50 border-red-200' :
              alert.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.severity === 'high' ? 'text-red-600' :
                  alert.severity === 'medium' ? 'text-amber-600' :
                  'text-yellow-600'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{alert.patient}</h4>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient List</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPatient === patient.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{patient.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      patient.status === 'stable' ? 'bg-green-100 text-green-700' :
                      patient.status === 'monitoring' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {patient.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {patient.age} • {patient.condition}</p>
                    <p>Last contact: {patient.lastContact}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span>HR: {patient.vitals.heartRate}</span>
                      <span>BP: {patient.vitals.bp}</span>
                      <span>Temp: {patient.vitals.temp}°F</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="space-y-6">
          {selectedPatient ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Patient Details</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {(() => {
                const patient = patients.find(p => p.id === selectedPatient);
                return patient ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Age {patient.age} • {patient.condition}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">{patient.vitals.heartRate} BPM</p>
                        <p className="text-xs text-gray-500">Heart Rate</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">{patient.vitals.bp}</p>
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-5 h-5 text-red-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">{patient.vitals.temp}°F</p>
                        <p className="text-xs text-gray-500">Temperature</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Select a patient to view details</p>
            </div>
          )}

          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">John Doe - Follow-up</p>
                  <p className="text-sm text-gray-600">2:00 PM - 2:15 PM</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">NEXT</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Sarah Wilson - Consultation</p>
                  <p className="text-sm text-gray-600">3:30 PM - 4:00 PM</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">SCHEDULED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}