import React, { useState } from 'react';
import { FileText, Pill, Phone, MessageCircle, Download, Calendar, X } from 'lucide-react';

export function PatientPortal() {
  const medications = [
    { name: 'Lisinopril 10mg', frequency: 'Once daily', nextDose: '8:00 AM tomorrow', status: 'on-track' },
    { name: 'Metformin 500mg', frequency: 'Twice daily', nextDose: '6:00 PM today', status: 'on-track' },
    { name: 'Vitamin D3 1000 IU', frequency: 'Once daily', nextDose: '8:00 AM tomorrow', status: 'missed' }
  ];

  const detailedMedications = [
    {
      name: 'Lisinopril 10mg',
      dosageForm: 'Tablet',
      frequency: 'Once daily',
      nextDose: '8:00 AM tomorrow',
      status: 'on-track',
      prescribingDoctor: 'Dr. Sarah Johnson',
      startDate: '2024-01-15',
      notes: 'Take with or without food. Monitor blood pressure regularly.',
      pharmacyContact: 'Pharmacy ABC, +1-555-1234'
    },
    {
      name: 'Metformin 500mg',
      dosageForm: 'Tablet',
      frequency: 'Twice daily',
      nextDose: '6:00 PM today',
      status: 'on-track',
      prescribingDoctor: 'Dr. Michael Chen',
      startDate: '2023-11-10',
      notes: 'Take after meals to reduce stomach upset.',
      pharmacyContact: 'Pharmacy XYZ, +1-555-5678'
    },
    {
      name: 'Vitamin D3 1000 IU',
      dosageForm: 'Capsule',
      frequency: 'Once daily',
      nextDose: '8:00 AM tomorrow',
      status: 'missed',
      prescribingDoctor: 'Dr. Emily Rodriguez',
      startDate: '2024-07-01',
      notes: 'Take with fatty food for better absorption.',
      pharmacyContact: 'Pharmacy ABC, +1-555-1234'
    },
    {
      name: 'Atorvastatin 20mg',
      dosageForm: 'Tablet',
      frequency: 'Once nightly',
      nextDose: '10:00 PM tonight',
      status: 'on-track',
      prescribingDoctor: 'Dr. Michael Chen',
      startDate: '2023-12-15',
      notes: 'Avoid grapefruit juice while taking this medication.',
      pharmacyContact: 'Pharmacy XYZ, +1-555-5678'
    },
    {
      name: 'Albuterol Inhaler',
      dosageForm: 'Inhaler',
      frequency: 'As needed',
      nextDose: 'Immediately if needed',
      status: 'on-track',
      prescribingDoctor: 'Dr. Sarah Johnson',
      startDate: '2024-03-20',
      notes: 'Use only as directed for shortness of breath.',
      pharmacyContact: 'Pharmacy DEF, +1-555-9012'
    }
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

  // Sample contacts for emergency modal
  const guardians = [
    { name: 'John Doe', phone: '+1-555-1111' },
    { name: 'Jane Smith', phone: '+1-555-2222' }
  ];

  const doctorsContacts = [
    { name: 'Dr. Sarah Johnson', phone: '+1-555-3333' },
    { name: 'Dr. Michael Chen', phone: '+1-555-4444' },
    { name: 'Dr. Emily Rodriguez', phone: '+1-555-5555' }
  ];

  // Modal and state for message doctor
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: 'user' | 'doctor'; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Modal for detailed medication records
  const [isDetailedMedRecordsModalOpen, setIsDetailedMedRecordsModalOpen] = useState(false);

  // Modal for emergency contact popup
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyOption, setEmergencyOption] = useState<'guardian' | 'doctor' | null>(null);

  // Message Doctor modal handlers
  function openMessageModal() {
    setSelectedDoctor(null);
    setIsMessageModalOpen(true);
    setMessages([]);
  }
  function closeMessageModal() {
    setIsMessageModalOpen(false);
    setSelectedDoctor(null);
    setMessages([]);
  }
  function selectDoctor(doctor: string) {
    setSelectedDoctor(doctor);
    setMessages([{ sender: 'doctor', text: `Hello, this is ${doctor}. How can I help you today?` }]);
  }
  function sendMessage() {
    if (inputMessage.trim() === '') return;
    setMessages(prev => [...prev, { sender: 'user', text: inputMessage }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'doctor', text: 'Thank you for your message. I will get back to you shortly.' }]);
    }, 1000);
    setInputMessage('');
  }

  // Detailed Medications modal handlers
  function openDetailedMedRecordsModal() {
    setIsDetailedMedRecordsModalOpen(true);
  }
  function closeDetailedMedRecordsModal() {
    setIsDetailedMedRecordsModalOpen(false);
  }

  // Emergency contact modal handlers
  function openEmergencyModal() {
    setEmergencyOption(null);
    setIsEmergencyModalOpen(true);
  }
  function closeEmergencyModal() {
    setIsEmergencyModalOpen(false);
    setEmergencyOption(null);
  }
  function handleCall(contact: { name: string; phone: string }) {
    alert(`Calling ${contact.name} at ${contact.phone}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
        <p className="text-gray-600 mt-1">Manage your health information and connect with your care team</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={openMessageModal}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors group flex flex-col items-center justify-center h-28"
        >
          <MessageCircle className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Message Doctor</span>
        </button>
        <button
          onClick={openDetailedMedRecordsModal}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-colors group flex flex-col items-center justify-center h-28"
        >
          <FileText className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">View Medications</span>
        </button>
        <button
          onClick={openEmergencyModal}
          className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-xl transition-colors group flex flex-col items-center justify-center h-28"
        >
          <Phone className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Emergency Contact</span>
        </button>
      </div>

      {/* Other content unchanged: medications summary, appointments, health records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
            <Pill className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  med.status === 'on-track' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{med.name}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      med.status === 'on-track' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {med.status === 'on-track' ? 'ON TRACK' : 'MISSED'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{med.frequency}</p>
                <p className="text-sm text-gray-500">Next dose: {med.nextDose}</p>
              </div>
            ))}
          </div>
        </div>
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
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
          <FileText className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {healthRecords.map((record, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
            >
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
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{record.type}</span>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Doctor Modal */}
      {isMessageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeMessageModal}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedDoctor ? `Chat with ${selectedDoctor}` : 'Select a Doctor'}
              </h2>
              <button onClick={closeMessageModal} aria-label="Close modal" className="text-gray-600 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!selectedDoctor ? (
              <div>
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {[...new Set(appointments.map((appt) => appt.doctor))].map((doctor, i) => (
                    <li key={i}>
                      <button
                        onClick={() => selectDoctor(doctor)}
                        className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-md font-medium"
                      >
                        {doctor}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col h-80">
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md p-3 mb-3">
                  {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 max-w-[80%] px-3 py-2 rounded-lg ${
                        msg.sender === 'user' ? 'bg-green-200 self-end' : 'bg-gray-200 self-start'
                      }`}
                    >
                      <p className="text-gray-800">{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-green-600 text-white px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Medication Records Modal */}
      {isDetailedMedRecordsModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeDetailedMedRecordsModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Detailed Medication Records</h2>
              <button
                onClick={closeDetailedMedRecordsModal}
                aria-label="Close modal"
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <ul className="space-y-6">
              {detailedMedications.map((med, index) => (
                <li key={index} className="p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{med.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-sm">
                    <div>
                      <strong>Dosage Form:</strong> {med.dosageForm}
                    </div>
                    <div>
                      <strong>Frequency:</strong> {med.frequency}
                    </div>
                    <div>
                      <strong>Next Dose:</strong> {med.nextDose}
                    </div>
                    <div>
                      <strong>Status:</strong> {med.status === 'on-track' ? 'On Track' : 'Missed'}
                    </div>
                    <div>
                      <strong>Prescribing Doctor:</strong> {med.prescribingDoctor}
                    </div>
                    <div>
                      <strong>Start Date:</strong> {new Date(med.startDate).toLocaleDateString()}
                    </div>
                    <div className="sm:col-span-2">
                      <strong>Notes:</strong> {med.notes}
                    </div>
                    <div className="sm:col-span-2">
                      <strong>Pharmacy Contact:</strong> {med.pharmacyContact}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Emergency Contact Modal */}
      {isEmergencyModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEmergencyModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Emergency Contact</h2>
              <button
                onClick={closeEmergencyModal}
                aria-label="Close modal"
                className="text-gray-600 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {!emergencyOption ? (
              <div className="space-y-4">
                <button
                  onClick={() => setEmergencyOption('guardian')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 p-3 rounded-md font-medium"
                >
                  Call Guardian
                </button>
                <button
                  onClick={() => setEmergencyOption('doctor')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 p-3 rounded-md font-medium"
                >
                  Call Doctor
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setEmergencyOption(null)}
                  className="mb-4 text-blue-600 hover:underline"
                >
                  &larr; Back
                </button>
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {(emergencyOption === 'guardian' ? guardians : doctorsContacts).map((contact, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleCall(contact)}
                        className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-md font-medium"
                      >
                        {contact.name} - {contact.phone}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}