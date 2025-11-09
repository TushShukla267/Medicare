import React, { useEffect, useState } from 'react';

type AppointmentLog = {
  id: number;
  patientName?: string;
  doctorName?: string;
  doctorId?: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
};

const ApmtLog: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('http://localhost:5000/api/appointments/all');
        const data = await response.json();
        if (response.ok) {
          setAppointments(data);
        } else {
          setError(data.error || 'Failed to load appointment logs');
        }
      } catch {
        setError('Network error while fetching logs');
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="admin-dashboard p-8">
      <h2 className="text-3xl font-bold mb-6">Admin - Appointment Logs</h2>
      {error && <p className="text-red-600">{error}</p>}
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointment logs found.</p>
      ) : (
        <table className="table-auto w-full border-collapse shadow-lg mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Patient</th>
              <th className="px-4 py-2 border">Doctor</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} className="text-center">
                <td className="border px-3 py-2">{app.id}</td>
                <td className="border px-3 py-2">{app.patientName || '-'}</td>
                <td className="border px-3 py-2">{app.doctorName || `#${app.doctorId}`}</td>
                <td className="border px-3 py-2">{app.appointmentDate}</td>
                <td className="border px-3 py-2">{app.appointmentTime}</td>
                <td className="border px-3 py-2">
                  {app.status === 'pending' && 'Scheduled'}
                  {app.status === 'confirmed' && 'Received'}
                  {app.status === 'cancelled' && 'Cancelled'}
                  {app.status === 'completed' && 'Completed'}
                  {['pending','confirmed','cancelled','completed'].indexOf(app.status) === -1 && app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApmtLog;
