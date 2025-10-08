import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  Video,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  User,
  Mic,
  MicOff,
  VideoOff,
} from 'lucide-react';
import { UserRole } from '../App';
import { Chatbot } from './Chatbot';

type Appointment =
  | { id?: number; patient: string; time: string; type: string; duration: string }
  | { id?: number; doctor: string; time: string; type: string; duration: string };

interface TelemedicineProps {
  userRole: UserRole;
}

type Provider = {
  id: number;
  name: string;
  specialty: string;
};

type AppointmentType = "Video Call" | "In-Person" | "Phone Call";

type AppointmentDetails = {
  date: string;
  time: string;
  provider: Provider | null;
  type: AppointmentType | null;
};

const providers: Provider[] = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "General Practitioner" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Cardiologist" },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
];

// Signaling server URL
const SIGNALING_SERVER_URL = "http://localhost:3000";

// ICE servers config
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

// Dummy pending appointments and total appointments for doctor/admin
const pendingAppointmentsForDoctor: Appointment[] = [
  { id: 101, patient: 'John Doe', time: '2:00 PM', type: 'Follow-up', duration: '15 min' },
  { id: 102, patient: 'Sarah Wilson', time: '3:30 PM', type: 'Consultation', duration: '30 min' },
];

const allAppointmentsForAdmin: Appointment[] = [
  { id: 201, patient: 'John Doe', time: '2:00 PM', type: 'Follow-up', duration: '15 min' },
  { id: 202, patient: 'Sarah Wilson', time: '3:30 PM', type: 'Consultation', duration: '30 min' },
  { id: 203, doctor: 'Dr. Sarah Johnson', time: 'Tomorrow 10:00 AM', type: 'Specialist Consultation', duration: '45 min' },
];


export function Telemedicine({ userRole }: TelemedicineProps) {
  // Existing call states and refs
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'ringing' | 'connected'>('idle');

  const roomId = "telemedicine-room";

  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (callState === 'connected') {
      callTimerRef.current = window.setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      if (callTimerRef.current !== null) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanup = () => {
    setCallState('idle');
    setIsInCall(false);

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsMuted(false);
    setIsVideoOff(false);
  };

  const startCall = async () => {
    setIsInCall(true);
    setCallState('connecting');

    socketRef.current = io(SIGNALING_SERVER_URL);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join-room', roomId);
    });

    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    } catch (err) {
      alert('Camera/microphone access denied.');
      cleanup();
      return;
    }

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;

    const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = peerConnection;

    localStreamRef.current.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStreamRef.current!);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStreamRef.current?.addTrack(track);
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && remoteUserId) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          to: remoteUserId,
        });
      }
    };

    let remoteUserId: string | null = null;

    socketRef.current.on('room-users', async (users: string[]) => {
      if (users.length > 0) {
        remoteUserId = users[0];
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current.emit('offer', {
          to: remoteUserId,
          offer,
        });

        setCallState('ringing');
      }
    });

    socketRef.current.on('offer', async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
      remoteUserId = data.from;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketRef.current.emit('answer', {
        to: remoteUserId,
        answer,
      });

      setCallState('ringing');
    });

    socketRef.current.on('answer', async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      setCallState('connected');
    });

    socketRef.current.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit; from: string }) => {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        console.error('Error adding ICE candidate', err);
      }
    });

    socketRef.current.on('user-disconnected', (id: string) => {
      if (id === remoteUserId) {
        alert('Remote user disconnected');
        cleanup();
      }
    });

    socketRef.current.on('disconnect', () => {
      cleanup();
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    cleanup();
  };

  const upcomingAppointments: Appointment[] = userRole === 'doctor'
    ? [
        { patient: 'John Doe', time: '2:00 PM', type: 'Follow-up', duration: '15 min' },
        { patient: 'Sarah Wilson', time: '3:30 PM', type: 'Consultation', duration: '30 min' },
        { patient: 'Michael Brown', time: '4:15 PM', type: 'Check-up', duration: '20 min' }
      ]
    : [
        { doctor: 'Dr. Sarah Johnson', time: '2:00 PM', type: 'Follow-up', duration: '15 min' },
        { doctor: 'Dr. Michael Chen', time: 'Tomorrow 10:00 AM', type: 'Specialist Consultation', duration: '45 min' }
      ];

  const handleChatbotAction = (action: string) => {
    switch (action) {
      case 'emergency-call':
        alert('Connecting to emergency services...');
        break;
      case 'book-appointment':
        setShowSchedule(true);
        setShowChatbot(false);
        break;
      case 'contact-doctor':
        alert('Connecting to your healthcare provider...');
        break;
      default:
        console.log('Unhandled action:', action);
    }
  };

  // --- Role-Based ScheduleAppointment Subcomponents ---

  // Patient booking
  const ScheduleAppointmentBooking: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [details, setDetails] = useState<AppointmentDetails>({
      date: '',
      time: '',
      provider: null,
      type: null,
    });
    const [confirmed, setConfirmed] = useState(false);

    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDetails({ ...details, date: e.target.value });
      setConfirmed(false);
    };

    const handleSelectTime = (time: string) => {
      setDetails({ ...details, time });
      setConfirmed(false);
    };

    const handleSelectProvider = (id: number) => {
      const provider = providers.find((p) => p.id === id) || null;
      setDetails({ ...details, provider });
      setConfirmed(false);
    };

    const handleSelectType = (type: AppointmentType) => {
      setDetails({ ...details, type });
      setConfirmed(false);
    };

    const handleConfirm = () => {
      if (details.date && details.time && details.provider && details.type) {
        setConfirmed(true);
      } else {
        alert("Please select all fields before confirming.");
      }
    };

    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-appointment-title"
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full border border-gray-200 relative">
            <button
              onClick={onClose}
              aria-label="Close scheduling modal"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              &#x2715;
            </button>
            <h2 id="schedule-appointment-title" className="text-2xl font-semibold mb-5 text-center">
              Schedule Appointment
            </h2>
            <label className="block font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={details.date}
              onChange={handleChangeDate}
              min={new Date().toISOString().split("T")[0]}
              className="w-full mb-5 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block font-medium mb-1">Select Time</label>
            <div className="flex flex-wrap gap-3 mb-5">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => handleSelectTime(slot)}
                  className={`px-4 py-2 rounded-md border ${
                    details.time === slot ? 'border-blue-600 bg-blue-100 font-semibold' : 'border-gray-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <label className="block font-medium mb-1">Select Provider</label>
            <select
              value={details.provider ? details.provider.id : ''}
              onChange={(e) => handleSelectProvider(Number(e.target.value))}
              className="w-full mb-5 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select a provider</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.specialty}</option>
              ))}
            </select>
            <label className="block font-medium mb-1">Appointment Type</label>
            <div className="flex gap-4 mb-5">
              {(['Video Call', 'In-Person', 'Phone Call'] as AppointmentType[]).map(type => (
                <button
                  key={type}
                  onClick={() => handleSelectType(type)}
                  className={`flex-1 py-2 rounded-md border ${
                    details.type === type ? 'border-blue-600 bg-blue-100 font-semibold' : 'border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={handleConfirm}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Confirm Appointment
              </button>
            </div>
            {confirmed && (
              <p className="mt-5 text-green-700 font-semibold text-center">
                Appointment confirmed for <strong>{details.date}</strong> at <strong>{details.time}</strong> with <strong>{details.provider?.name}</strong> via <strong>{details.type}</strong>.
              </p>
            )}
          </div>
        </div>
      </>
    );
  };

  // Doctor accepts appointments
  const DoctorAcceptAppointments: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [pending, setPending] = useState<Appointment[]>(pendingAppointmentsForDoctor);

    const handleAccept = (patientId: number) => {
      setPending(prev => prev.filter(a => (a as any).id !== patientId));
      alert(`Appointment ${patientId} accepted.`);
    };

    const handleReject = (patientId: number) => {
      setPending(prev => prev.filter(a => (a as any).id !== patientId));
      alert(`Appointment ${patientId} rejected.`);
    };

    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doctor-accept-title"
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full border border-gray-200 relative">
            <button
              onClick={onClose}
              aria-label="Close accept appointments modal"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              &#x2715;
            </button>
            <h2 id="doctor-accept-title" className="text-2xl font-semibold mb-5 text-center">
              Accept Appointments
            </h2>
            {pending.length === 0 ? (
              <p className="text-center text-gray-700">No pending appointments.</p>
            ) : (
              pending.map((appt) => (
                <div key={(appt as any).id} className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-300 flex justify-between items-center">
                  <div>
                    <p><strong>Patient:</strong> {(appt as any).patient}</p>
                    <p><strong>Time:</strong> {appt.time}</p>
                    <p><strong>Type:</strong> {appt.type}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAccept((appt as any).id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject((appt as any).id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  // Admin manages all appointments
  const AdminManageAppointments: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [appointments, setAppointments] = useState<Appointment[]>(allAppointmentsForAdmin);

    const handleCancel = (id?: number) => {
      if (!id) return;
      setAppointments(prev => prev.filter(a => (a as any).id !== id));
      alert(`Appointment ${id} canceled.`);
    };

    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-manage-title"
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl w-full border border-gray-200 relative overflow-auto max-h-[80vh]">
            <button
              onClick={onClose}
              aria-label="Close admin manage modal"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              &#x2715;
            </button>
            <h2 id="admin-manage-title" className="text-2xl font-semibold mb-5 text-center">
              Manage Appointments
            </h2>
            {appointments.length === 0 ? (
              <p className="text-center text-gray-700">No appointments available.</p>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Patient</th>
                    <th className="border p-2">Doctor</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={(appt as any).id} className="even:bg-gray-50">
                      <td className="border p-2">{(appt as any).id || '-'}</td>
                      <td className="border p-2">{(appt as any).patient || '-'}</td>
                      <td className="border p-2">{(appt as any).doctor || '-'}</td>
                      <td className="border p-2">{appt.time}</td>
                      <td className="border p-2">{appt.type}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleCancel((appt as any).id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </>
    );
  };

  // Render based on role for schedule modal
  const renderScheduleModal = () => {
    if (!showSchedule) return null;
    if (userRole === 'patient') return <ScheduleAppointmentBooking onClose={() => setShowSchedule(false)} />;
    if (userRole === 'doctor') return <DoctorAcceptAppointments onClose={() => setShowSchedule(false)} />;
    if (userRole === 'admin') return <AdminManageAppointments onClose={() => setShowSchedule(false)} />;
    return null;
  };

  if (isInCall) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden relative h-[500px] md:h-[600px]">
          {/* Local Video */}
          {!isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="absolute top-4 left-4 w-40 h-40 rounded-xl border border-white object-cover z-20"
            />
          ) : (
            <div className="absolute top-4 left-4 w-40 h-40 bg-gray-700 flex items-center justify-center rounded-xl border border-white z-20">
              <VideoOff className="w-12 h-12 text-gray-300" />
            </div>
          )}

          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />

          {callState === 'connecting' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl animate-pulse">
              Connecting...
            </div>
          )}

          {callState === 'ringing' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl animate-pulse">
              Ringing...
            </div>
          )}

          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>{formatDuration(callDuration)}</span>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={endCall}
              className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <Phone className="w-6 h-6 text-white rotate-135" />
            </button>
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
              : userRole === 'admin'
                ? 'Manage the telemedicine platform appointments and schedules'
                : 'Connect with your healthcare providers from anywhere'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={startCall}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md group"
        >
          <Video className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg">Start Video Call</h3>
          <p className="text-blue-100 text-sm mt-1">
            {userRole === 'doctor' ? 'Begin patient consultation' : 'Connect with your doctor'}
          </p>
        </button>
        <button
          onClick={() => setShowSchedule(true)}
          className={`${
            userRole === 'doctor' ? 'bg-green-600 hover:bg-green-700' :
            userRole === 'admin' ? 'bg-yellow-600 hover:bg-yellow-700' :
            'bg-purple-600 hover:bg-purple-700'
          } text-white p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md group`}
        >
          <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-lg">
            {userRole === 'patient' ? 'Schedule Appointment' : userRole === 'doctor' ? 'Accept Appointments' : 'Manage Appointments'}
          </h3>
          <p className="text-purple-100 text-sm mt-1">
            {userRole === 'patient' ? 'Book consultation' : userRole === 'doctor' ? 'Review and accept appointment requests' : 'Oversee all appointments'}
          </p>
        </button>
      </div>

      {renderScheduleModal()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {userRole === 'doctor' ? "Today's Appointments" : 'Upcoming Appointments'}
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {upcomingAppointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {userRole === 'doctor'
                      ? (appointment as { patient: string }).patient
                      : (appointment as { doctor: string }).doctor}
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

      {showChatbot ? (
        <Chatbot userRole={userRole} onQuickAction={handleChatbotAction} />
      ) : (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
          title="AI Health Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}