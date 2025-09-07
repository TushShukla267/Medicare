import React, { useState } from 'react';
import { Video, Phone, MessageCircle, Calendar, Clock, User, Mic, MicOff, VideoOff } from 'lucide-react';
import { UserRole } from '../App';

interface TelemedicineProps {
  userRole: UserRole;
}

export function Telemedicine({ userRole }: TelemedicineProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const upcomingAppointments = userRole === 'doctor' ? [
    { patient: 'John Doe', time: '2:00 PM', type: 'Follow-up', duration: '15 min' },
    { patient: 'Sarah Wilson', time: '3:30 PM', type: 'Consultation', duration: '30 min' },
    { patient: 'Michael Brown', time: '4:15 PM', type: 'Check-up', duration: '20 min' }
  ] : [
    { doctor: 'Dr. Sarah Johnson', time: '2:00 PM', type: 'Follow-up', duration: '15 min' },
    { doctor: 'Dr. Michael Chen', time: 'Tomorrow 10:00 AM', type: 'Specialist Consultation', duration: '45 min' }
  ];

  if (isInCall) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
            {!isVideoOff ? (
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <User className="w-16 h-16" />
                </div>
                <p className="text-xl font-semibold">
                  {userRole === 'doctor' ? 'John Doe' : 'Dr. Sarah Johnson'}
                </p>
                <p className="text-blue-200">Connected</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <VideoOff className="w-16 h-16 mb-4 mx-auto text-gray-400" />
                <p className="text-xl">Video Off</p>
              </div>
            )}
            
            {/* Call duration */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">05:23</span>
              </div>
            </div>
          </div>
          
          {/* Call Controls */}
          <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
            </button>
            
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
            </button>
            
            <button
              onClick={() => setIsInCall(false)}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <Phone className="w-5 h-5 text-white transform rotate-135" />
            </button>
          </div>
        </div>

        {/* Chat During Call */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Notes</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-900">Patient reports feeling better after medication adjustment</p>
              <span className="text-xs text-gray-500">Dr. Johnson - 2 min ago</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-900">Blood pressure readings have been stable</p>
              <span className="text-xs text-gray-500">John Doe - 1 min ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Telemedicine Platform</h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'doctor' 
              ? 'Connect with patients remotely for consultations and monitoring'
              : 'Connect with your healthcare providers from anywhere'
            }
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setIsInCall(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md group"
        >
          <Video className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg">Start Video Call</h3>
          <p className="text-blue-100 text-sm mt-1">
            {userRole === 'doctor' ? 'Begin patient consultation' : 'Connect with your doctor'}
          </p>
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md group">
          <MessageCircle className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg">Secure Messaging</h3>
          <p className="text-green-100 text-sm mt-1">
            {userRole === 'doctor' ? 'Message patients' : 'Contact healthcare team'}
          </p>
        </button>

        <button className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md group">
          <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg">Schedule Appointment</h3>
          <p className="text-purple-100 text-sm mt-1">
            {userRole === 'doctor' ? 'Manage schedule' : 'Book consultation'}
          </p>
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {userRole === 'doctor' ? 'Today\'s Appointments' : 'Upcoming Appointments'}
        </h3>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {userRole === 'doctor' ? appointment.patient : appointment.doctor}
                  </h4>
                  <p className="text-sm text-gray-600">{appointment.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{appointment.time}</p>
                <p className="text-sm text-gray-500">{appointment.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900">How are you feeling today?</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">Dr. Johnson - 10 min ago</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 justify-end">
              <div className="flex-1 text-right">
                <div className="bg-gray-100 p-3 rounded-lg inline-block">
                  <p className="text-sm text-gray-900">Much better, thank you! The new medication is helping.</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 block">You - 8 min ago</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Send
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Overall Health Status</span>
              <span className="text-sm font-bold text-green-600">GOOD</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Last Vitals Check</span>
              <span className="text-sm text-blue-600">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Medication Adherence</span>
              <span className="text-sm text-purple-600">95%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Next Appointment</span>
              <span className="text-sm text-amber-600">Tomorrow 10 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}