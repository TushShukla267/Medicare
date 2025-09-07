import React from 'react';
import { Calendar, FileText, Pill, Activity, Phone, MessageCircle, User, Download } from 'lucide-react';

export function PatientPortal() {
  const medications = [
    { name: 'Lisinopril 10mg', frequency: 'Once daily', nextDose: '8:00 AM tomorrow', status: 'on-track' },
    { name: 'Metformin 500mg', frequency: 'Twice daily', nextDose: '6:00 PM today', status: 'on-track' },
    { name: 'Vitamin D3 1000 IU', frequency: 'Once daily', nextDose: '8:00 AM tomorrow', status: 'missed' }
  ];

  const appointments = [
    { doctor: 'Dr. Sarah Johnson', date: 'Today, 2:00 PM', type: 'Follow-up', status: 'upcoming' },
    { doctor: 'Dr. Michael Chen', date: 'Dec 28, 10:00 AM', type: 'Cardiology Consultation', status: 'scheduled' },
    { doctor: 'Dr. Emily Rodriguez', date: 'Jan 5, 3:30 PM', type: 'Annual Physical', status: 'scheduled' }
  ];

  const healthRecords = [
    { title: 'Blood Test Results', date: 'Dec 15, 2024', doctor: 'Dr. Johnson', type: 'Lab Report' },
    { title: 'Cardiology Report', date: 'Nov 28, 2024', doctor: 'Dr. Chen', type: 'Specialist Report' },
    { title: 'Medication History', date: 'Nov 15, 2024', doctor: 'Dr. Johnson', type: 'Prescription' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
        <p className="text-gray-600 mt-1">Manage your health information and connect with your care team</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors text-center group">
          <Calendar className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Book Appointment</span>
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors text-center group">
          <MessageCircle className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Message Doctor</span>
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors text-center group">
          <FileText className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">View Records</span>
        </button>
        <button className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-xl transition-colors text-center group">
          <Phone className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Emergency Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
            <Pill className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                med.status === 'on-track' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{med.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    med.status === 'on-track' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {med.status === 'on-track' ? 'ON TRACK' : 'MISSED'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{med.frequency}</p>
                <p className="text-sm text-gray-500">Next dose: {med.nextDose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {appointment.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{appointment.type}</p>
                <p className="text-sm text-gray-500">{appointment.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {healthRecords.map((record, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{record.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{record.date}</span>
                    <span>•</span>
                    <span>{record.doctor}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {record.type}
                </span>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}