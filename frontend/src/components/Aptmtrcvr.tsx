import React, { useEffect, useState } from 'react';

type Appointment = {
  id: number;
  patientName: string;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  // add other fields as necessary
};

export default function AppointmentReceiver({ doctorId }: { doctorId: number }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState('');

  // Fetch appointments for the doctor on component mount
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments?doctorId=${doctorId}`);
        const data = await response.json();
        if (response.ok) {
          setAppointments(data);
        } else {
          setError(data.error || 'Failed to load appointments');
        }
      } catch {
        setError('Network error while fetching appointments');
      }
    }
    fetchAppointments();
  }, [doctorId]);

  // Handle accept or reject response
  async function handleResponse(appointmentId: number, action: 'accept' | 'reject') {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action === 'accept' ? 'confirmed' : 'cancelled'
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setAppointments(appointments.map(app => (
          app.id === appointmentId ? { ...app, status: result.status } : app
        )));
      } else {
        setError(result.error || 'Failed to update appointment status');
      }
    } catch {
      setError('Network error while updating appointment status');
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn py-8">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">Appointments for Doctor</h2>
      {error && (
        <p className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300 dark:bg-red-900 dark:text-red-400 text-center">
          {error}
        </p>
      )}
      {appointments.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 py-16 text-base">No appointments found.</p>
      ) : (
        <ul className="space-y-6">
          {appointments.map(app => (
            <li
              key={app.id}
              className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl shadow-xl
                transition-transform hover:scale-105 duration-300 bg-white dark:bg-gray-800 border
                ${
                  app.status === 'pending'
                    ? 'border-yellow-400'
                    : app.status === 'confirmed'
                    ? 'border-emerald-500'
                    : app.status === 'cancelled'
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
            >
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                  Patient: <span className="font-normal">{app.patientName}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: <span className="font-medium">{app.appointmentDate}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Time: <span className="font-medium">{app.appointmentTime}</span>
                </p>
                <p
                  className={`inline-block mt-2 px-3 py-1 rounded-full font-semibold text-xs
                  ${
                    app.status === 'pending'
                      ? 'bg-yellow-300 text-yellow-800'
                      : app.status === 'confirmed'
                      ? 'bg-emerald-300 text-emerald-800'
                      : app.status === 'cancelled'
                      ? 'bg-red-300 text-red-800'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-700'
                  }`}
                >
                  Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </p>
              </div>
              {app.status === 'pending' && (
                <div className="flex gap-3 mt-5 md:mt-0">
                  <button
                    onClick={() => handleResponse(app.id, 'accept')}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleResponse(app.id, 'reject')}
                    className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
