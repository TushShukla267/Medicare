import React, { useState } from "react";


const doctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology" },
  { id: 2, name: "Dr. Michael Chen", specialty: "General Practice" },
];


const availableTimes = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];


export default function AppointmentScheduler({ onBook }: { onBook?: (data: any) => void }) {
  const [doctor, setDoctor] = useState<{ id: number, name: string, specialty: string } | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");


  const resetForm = () => {
    setDoctor(null);
    setDate("");
    setTime("");
    setError("");
  };


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctor || !date || !time) {
      setError("Please select doctor, date, and time.");
      return;
    }
    onBook && onBook({ doctor, date, time });
    alert("Appointment successfully scheduled!");
    resetForm();
  }


  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule an Appointment</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Choose Doctor</label>
        <select className="w-full border rounded-lg py-2 px-3"
          value={doctor?.id || ""}
          onChange={e => setDoctor(doctors.find(d => d.id === Number(e.target.value)) || null)}>
          <option value="">Select a doctor</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.name} – {doc.specialty}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Date</label>
        <input
          type="date"
          className="w-full border rounded-lg py-2 px-3"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>


      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Time Slot</label>
        <select className="w-full border rounded-lg py-2 px-3"
          value={time}
          onChange={e => setTime(e.target.value)}>
          <option value="">Select time slot</option>
          {availableTimes.map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>


      {error && <p className="text-red-600">{error}</p>}


      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-bold hover:shadow-lg transition"
      >
        Book Appointment
      </button>
    </form>
  );
}