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

const SIGNALING_SERVER_URL = "http://localhost:5000";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

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
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'ringing' | 'connected'>('idle');
  const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');

  const roomId = "telemedicine-room";

  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<number | null>(null);
  const remoteUserIdRef = useRef<string | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    console.log('🎬 Telemedicine component mounted');
    return () => {
      console.log('🎬 Telemedicine component unmounting');
      cleanup();
    };
  }, []);

  // FIX #2: Call timer effect - now properly starts when connected
useEffect(() => {
  if (callState === 'connected') {
    callTimerRef.current = window.setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);
  } else {
    if (callTimerRef.current !== null) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallDuration(0); // ✅ no comparison needed here
  }

  return () => {
    if (callTimerRef.current !== null) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };
}, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanup = () => {
    console.log('🧹 Cleaning up connection...');
    setCallState('idle');
    setIsInCall(false);
    setConnectionStatus('Not connected');

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

    remoteUserIdRef.current = null;
    pendingCandidatesRef.current = [];
    setIsMuted(false);
    setIsVideoOff(false);
    setCallDuration(0);
  };

  const startCall = async () => {
    console.log('📞 ========================================');
    console.log('📞 STARTING CALL');
    console.log('📞 ========================================');
    
    setIsInCall(true);
    setCallState('connecting');
    setConnectionStatus('Connecting to server...');

    try {
      // STEP 1: Get user media FIRST
      console.log('🎥 Step 1: Requesting camera and microphone...');
      const localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      localStreamRef.current = localStream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        console.log('✅ Local video element set');
      }
      console.log('✅ Local stream acquired:', localStream.getTracks().map(t => t.kind));
      setConnectionStatus('Camera and mic ready');

      // STEP 2: Setup remote stream
      console.log('🎥 Step 2: Setting up remote stream...');
      const remoteStream = new MediaStream();
      remoteStreamRef.current = remoteStream;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log('✅ Remote video element set');
      }

      // STEP 3: Create peer connection
      console.log('🔧 Step 3: Creating peer connection...');
      const peerConnection = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = peerConnection;
      console.log('✅ Peer connection created');

      // Add local tracks
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
        console.log('➕ Added track:', track.kind);
      });

      // Setup event handlers
      peerConnection.ontrack = (event) => {
        console.log('📥 *** RECEIVED REMOTE TRACK ***:', event.track.kind);
        event.streams[0].getTracks().forEach(track => {
          remoteStreamRef.current?.addTrack(track);
          console.log('➕ Added remote track to stream:', track.kind);
        });
        
        // FIX #1: Set to connected when we receive the first track
        console.log('🎉 *** CALL CONNECTED - REMOTE TRACK RECEIVED ***');
        setCallState('connected');
        setConnectionStatus('Connected!');
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && remoteUserIdRef.current) {
          console.log('🧊 Sending ICE candidate');
          socketRef.current?.emit('ice-candidate', {
            candidate: event.candidate,
            to: remoteUserIdRef.current,
          });
        }
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('🔗 ICE state:', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'connected') {
          console.log('🎉 *** ICE CONNECTED ***');
        } else if (peerConnection.iceConnectionState === 'disconnected' || 
                   peerConnection.iceConnectionState === 'failed') {
          console.log('⚠️ ICE connection issue:', peerConnection.iceConnectionState);
        }
      };

      peerConnection.onsignalingstatechange = () => {
        console.log('📡 Signaling state:', peerConnection.signalingState);
      };

      // STEP 4: Connect to signaling server
      console.log('🌐 Step 4: Connecting to signaling server...');
      const socket = io(SIGNALING_SERVER_URL, {
        transports: ['websocket', 'polling']
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ *** SOCKET CONNECTED ***:', socket.id);
        setConnectionStatus('Connected to server');
        socket.emit('join-room', roomId);
        console.log('📤 Joined room:', roomId);
      });

      socket.on('connect_error', (err: Error) => {
        console.error('❌ Socket connection error:', err);
        alert('Failed to connect to server');
        cleanup();
      });


      // Handle room users
      socket.on('room-users', async (users: string[]) => {
        console.log('👥 *** ROOM USERS ***:', users);
        if (users.length > 0) {
          const targetUser = users[0];
          remoteUserIdRef.current = targetUser;
          console.log('🎯 Creating offer for:', targetUser);
          
          try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('✅ Offer created and set as local description');
            
            socket.emit('offer', { to: targetUser, offer });
            console.log('📤 Offer sent to:', targetUser);
            
            setCallState('ringing');
            setConnectionStatus('Calling...');
          } catch (err) {
            console.error('❌ Error creating offer:', err);
          }
        } else {
          console.log('⏳ Waiting for other user...');
          setConnectionStatus('Waiting for other user...');
        }
      });

      // Handle incoming offer
      socket.on('offer', async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
        console.log('📥 ========================================');
        console.log('📥 *** RECEIVED OFFER ***');
        console.log('📥 From:', data.from);
        console.log('📥 Current signaling state:', peerConnection.signalingState);
        console.log('📥 ========================================');
        
        remoteUserIdRef.current = data.from;
        
        try {
          // If we're in 'have-local-offer' state, we have a glare condition
          if (peerConnection.signalingState === 'have-local-offer') {
            const isPolite = (socketRef.current?.id ?? "") < data.from;
            console.log('⚠️ GLARE DETECTED! I am:', socket.id, 'Remote is:', data.from);
            console.log('⚠️ Am I polite?', isPolite);
            
            if (isPolite) {
              console.log('🔄 Rolling back local offer...');
              await peerConnection.setLocalDescription({ type: 'rollback' } as any);
              console.log('✅ Rollback complete');
            } else {
              console.log('🚫 Ignoring incoming offer (I am impolite)');
              return;
            }
          }
          
          console.log('📝 Setting remote description...');
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
          console.log('✅ Remote description set');
          
          // Add any pending ICE candidates
          if (pendingCandidatesRef.current.length > 0) {
            console.log('🧊 Adding', pendingCandidatesRef.current.length, 'pending ICE candidates');
            for (const candidate of pendingCandidatesRef.current) {
              await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidatesRef.current = [];
          }
          
          console.log('📝 Creating answer...');
          const answer = await peerConnection.createAnswer();
          console.log('✅ Answer created');
          
          console.log('📝 Setting local description...');
          await peerConnection.setLocalDescription(answer);
          console.log('✅ Local description set');
          
          console.log('📤 Sending answer to:', data.from);
          socket.emit('answer', { to: data.from, answer });
          console.log('✅ *** ANSWER SENT SUCCESSFULLY ***');
          
          setCallState('ringing');
          setConnectionStatus('Connecting...');
        } catch (err) {
          console.error('❌ ========================================');
          console.error('❌ ERROR HANDLING OFFER');
          console.error('❌', err);
          console.error('❌ ========================================');
        }
      });

      // Handle incoming answer
      socket.on('answer', async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
        console.log('📥 ========================================');
        console.log('📥 *** RECEIVED ANSWER ***');
        console.log('📥 From:', data.from);
        console.log('📥 ========================================');
        
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
          console.log('✅ Answer applied');
          
          // Add any pending ICE candidates
          if (pendingCandidatesRef.current.length > 0) {
            console.log('🧊 Adding', pendingCandidatesRef.current.length, 'pending ICE candidates');
            for (const candidate of pendingCandidatesRef.current) {
              await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidatesRef.current = [];
          }
        } catch (err) {
          console.error('❌ Error handling answer:', err);
        }
      });

      // Handle ICE candidates
      socket.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit; from: string }) => {
        console.log('🧊 Received ICE candidate from:', data.from);
        
        try {
          if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log('✅ ICE candidate added');
          } else {
            console.log('⏳ Queuing ICE candidate (no remote description yet)');
            pendingCandidatesRef.current.push(data.candidate);
          }
        } catch (err) {
          console.error('❌ Error adding ICE candidate:', err);
        }
      });

      // Handle user joined
      socket.on('user-joined', async (userId: string) => {
        console.log('👤 *** USER JOINED ***:', userId);
        
        if (!remoteUserIdRef.current) {
          remoteUserIdRef.current = userId;
          console.log('🎯 Creating offer for new user');
          
          try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('✅ Offer created');
            
            socket.emit('offer', { to: userId, offer });
            console.log('📤 Offer sent');
            
            setCallState('ringing');
          } catch (err) {
            console.error('❌ Error creating offer:', err);
          }
        }
      });

      // FIX #4: Handle user disconnection gracefully
      socket.on('user-disconnected', (userId: string) => {
        console.log('👋 User disconnected:', userId);
        if (userId === remoteUserIdRef.current) {
          setConnectionStatus('Other user disconnected - waiting for reconnection...');
          setCallState('ringing');
          // Don't cleanup immediately - let them reconnect within 60 seconds
          console.log('⏳ Waiting for user to reconnect (60 second window)...');
        }
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });

    } catch (err) {
      console.error('❌ Error in startCall:', err);
      alert('Error: ' + err);
      cleanup();
    }
  };

  // FIX #3: Fixed video toggle to properly handle video element
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
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      // FIX #3: Update the video element's srcObject to ensure it stays visible
      if (localVideoRef.current && localVideoRef.current.srcObject !== localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      
      setIsVideoOff(!isVideoOff);
      console.log('📹 Video toggled:', !isVideoOff ? 'OFF' : 'ON');
    }
  };

  const endCall = () => {
    // Emit leave-room to let server know we're leaving
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
    }
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

  const ScheduleAppointmentBooking: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [details, setDetails] = useState<AppointmentDetails>({
      date: '',
      time: '',
      provider: null,
      type: null,
    });
    const [confirmed, setConfirmed] = useState(false);

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={e => e.stopPropagation()}>
          <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full border border-gray-200 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &#x2715;
            </button>
            <h2 className="text-2xl font-semibold mb-5 text-center">Schedule Appointment</h2>
            <input
              type="date"
              value={details.date}
              onChange={(e) => setDetails({ ...details, date: e.target.value, })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full mb-5 p-2 border rounded-md"
            />
            <div className="flex flex-wrap gap-3 mb-5">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setDetails({ ...details, time: slot })}
                  className={`px-4 py-2 rounded-md border ${details.time === slot ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <select
              value={details.provider?.id || ''}
              onChange={(e) => {
                const provider = providers.find(p => p.id === Number(e.target.value)) || null;
                setDetails({ ...details, provider });
              }}
              className="w-full mb-5 p-2 border rounded-md"
            >
              <option value="">Select a provider</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.specialty}</option>
              ))}
            </select>
            <div className="flex gap-4 mb-5">
              {(['Video Call', 'In-Person', 'Phone Call'] as AppointmentType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setDetails({ ...details, type })}
                  className={`flex-1 py-2 rounded-md border ${details.type === type ? 'border-blue-600 bg-blue-100' : 'border-gray-300'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (details.date && details.time && details.provider && details.type) {
                  setConfirmed(true);
                } else {
                  alert("Please select all fields");
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
            >
              Confirm Appointment
            </button>
            {confirmed && (
              <p className="mt-5 text-green-700 text-center">
                Appointment confirmed for {details.date} at {details.time}
              </p>
            )}
          </div>
        </div>
      </>
    );
  };

  const DoctorAcceptAppointments: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [pending, setPending] = useState(pendingAppointmentsForDoctor);
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full relative">
            <button onClick={onClose} className="absolute top-4 right-4">&#x2715;</button>
            <h2 className="text-2xl mb-5">Accept Appointments</h2>
            {pending.map(appt => (
              <div key={(appt as any).id} className="mb-4 p-4 bg-gray-50 rounded flex justify-between">
                <div>
                  <p>Patient: {(appt as any).patient}</p>
                  <p>Time: {appt.time}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPending(prev => prev.filter(a => (a as any).id !== (appt as any).id))} className="px-4 py-2 bg-green-600 text-white rounded">Accept</button>
                  <button onClick={() => setPending(prev => prev.filter(a => (a as any).id !== (appt as any).id))} className="px-4 py-2 bg-red-600 text-white rounded">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const AdminManageAppointments: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [appointments, setAppointments] = useState(allAppointmentsForAdmin);
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full relative max-h-[80vh] overflow-auto">
            <button onClick={onClose} className="absolute top-4 right-4">&#x2715;</button>
            <h2 className="text-2xl mb-5">Manage Appointments</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Patient</th>
                  <th className="border p-2">Doctor</th>
                  <th className="border p-2">Time</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={(appt as any).id}>
                    <td className="border p-2">{(appt as any).id}</td>
                    <td className="border p-2">{(appt as any).patient || '-'}</td>
                    <td className="border p-2">{(appt as any).doctor || '-'}</td>
                    <td className="border p-2">{appt.time}</td>
                    <td className="border p-2">
                      <button onClick={() => setAppointments(prev => prev.filter(a => (a as any).id !== (appt as any).id))} className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

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
          {/* Local video - always keep srcObject attached */}
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

          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />

          {/* Connection status overlay - only show when not connected */}
          {(callState === 'connecting' || callState === 'ringing') && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-white text-2xl mb-2 animate-pulse">
                {callState === 'connecting' ? 'Connecting...' : 'Ringing...'}
              </div>
              <div className="text-white text-sm">{connectionStatus}</div>
            </div>
          )}

          {/* Call duration timer - only show when connected */}
          {callState === 'connected' && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{formatDuration(callDuration)}</span>
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-30">
            <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-600' : 'bg-gray-600'}`}>
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
            <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600' : 'bg-gray-600'}`}>
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
            <button onClick={endCall} className="p-3 bg-red-600 rounded-full">
              <Phone className="w-6 h-6 text-white rotate-135" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Telemedicine Platform</h1>
        <p className="text-gray-600 mt-1">
          {userRole === 'doctor' ? 'Connect with patients remotely' : 'Connect with your healthcare providers'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={startCall} className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl">
          <Video className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">Start Video Call</h3>
        </button>
        <button onClick={() => setShowSchedule(true)} className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl">
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg">
            {userRole === 'patient' ? 'Schedule Appointment' : userRole === 'doctor' ? 'Accept Appointments' : 'Manage Appointments'}
          </h3>
        </button>
      </div>

      {renderScheduleModal()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {userRole === 'doctor' ? "Today's Appointments" : 'Upcoming Appointments'}
        </h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {upcomingAppointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
