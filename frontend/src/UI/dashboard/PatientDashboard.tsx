import { Heart, Activity, Calendar, Pill, Thermometer, Droplet } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const patientData = {
  vitals: {
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygen: 98
  },
  appointments: [
    { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "Nov 5, 2025", time: "10:30 AM", status: "upcoming" },
    { id: 2, doctor: "Dr. Michael Chen", specialty: "General Practice", date: "Nov 12, 2025", time: "2:00 PM", status: "upcoming" }
  ],
  medications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescribed: "Dr. Sarah Johnson" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribed: "Dr. Michael Chen" }
  ]
};

interface PatientDashboardProps {
  activeSection: string;
}

export function PatientDashboard({ activeSection }: PatientDashboardProps) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Vital Signs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Heart Rate"
            value={patientData.vitals.heartRate}
            unit="BPM"
            icon={Heart}
            status="normal"
            subtitle="Normal resting rate"
            className="animate-heartbeat"
          />
          <MetricCard
            title="Blood Pressure"
            value={patientData.vitals.bloodPressure}
            unit=""
            icon={Activity}
            status="success"
            subtitle="Optimal range"
          />
          <MetricCard
            title="Temperature"
            value={patientData.vitals.temperature}
            unit="°F"
            icon={Thermometer}
            status="normal"
            subtitle="Normal body temp"
          />
          <MetricCard
            title="Oxygen Level"
            value={patientData.vitals.oxygen}
            unit="%"
            icon={Droplet}
            status="success"
            subtitle="Healthy oxygen"
          />
        </div>

        {/* Appointments & Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Upcoming Appointments</h2>
              <Calendar className="text-primary" size={24} />
            </div>
            <div className="space-y-4">
              {patientData.appointments.map((apt) => (
                <div key={apt.id} className="p-4 bg-accent/50 rounded-xl hover:shadow-soft transition-all border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center text-white font-bold shadow-glow">
                      {apt.doctor.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{apt.doctor}</h3>
                      <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{apt.date}</p>
                      <p className="text-sm text-muted-foreground">{apt.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">Book New Appointment</Button>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Current Medications</h2>
              <Pill className="text-warning" size={24} />
            </div>
            <div className="space-y-4">
              {patientData.medications.map((med, idx) => (
                <div key={idx} className="p-4 bg-accent/50 rounded-xl hover:shadow-soft transition-all border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{med.name}</h3>
                    <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-sm font-medium">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{med.frequency}</p>
                  <p className="text-xs text-muted-foreground mt-1">Prescribed by {med.prescribed}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (activeSection === 'appointments') {
    return (
      <Card className="p-8 shadow-elegant">
        <h2 className="text-2xl font-bold text-foreground mb-6">Appointment Scheduler</h2>
        <p className="text-muted-foreground">Appointment scheduling feature coming soon...</p>
      </Card>
    );
  }

  if (activeSection === 'medications') {
    return (
      <Card className="p-8 shadow-elegant">
        <h2 className="text-2xl font-bold text-foreground mb-6">Medication Management</h2>
        <p className="text-muted-foreground">Medication tracking feature coming soon...</p>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-elegant">
      <p className="text-center text-muted-foreground">Content for {activeSection}</p>
    </Card>
  );
}
