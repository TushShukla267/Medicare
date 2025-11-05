import { Users, FileText, TrendingUp, Clock } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";

const doctorData = {
  stats: {
    todayPatients: 8,
    pendingReports: 5,
    totalPatients: 156,
    rating: 4.8
  },
  appointments: [
    { id: 1, patient: "John Doe", time: "10:30 AM", condition: "Hypertension Follow-up", status: "upcoming" },
    { id: 2, patient: "Emma Wilson", time: "11:15 AM", condition: "Chest Pain", status: "upcoming" },
    { id: 3, patient: "Michael Brown", time: "2:00 PM", condition: "Annual Checkup", status: "completed" }
  ]
};

interface DoctorDashboardProps {
  activeSection: string;
}

export function DoctorDashboard({ activeSection }: DoctorDashboardProps) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Patients"
            value={doctorData.stats.todayPatients}
            unit=""
            icon={Users}
            status="success"
            subtitle="+3 from yesterday"
          />
          <MetricCard
            title="Pending Reports"
            value={doctorData.stats.pendingReports}
            unit=""
            icon={FileText}
            status="warning"
            subtitle="2 urgent"
          />
          <MetricCard
            title="Total Patients"
            value={doctorData.stats.totalPatients}
            unit=""
            icon={Users}
            status="normal"
            subtitle="+12 this month"
          />
          <MetricCard
            title="Rating"
            value={doctorData.stats.rating}
            unit="/5.0"
            icon={TrendingUp}
            status="success"
            subtitle="Excellent"
          />
        </div>

        {/* Today's Schedule */}
        <Card className="p-6 shadow-elegant">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Today's Schedule</h2>
            <Clock className="text-success" size={24} />
          </div>
          <div className="space-y-3">
            {doctorData.appointments.map((apt) => (
              <div key={apt.id} className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-soft border ${
                apt.status === 'upcoming' ? 'bg-accent/50 border-success/20' : 'bg-muted/30 border-border'
              }`}>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-glow ${
                  apt.status === 'upcoming' ? 'bg-gradient-to-r from-success to-success-glow' : 'bg-muted-foreground/50'
                }`}>
                  {apt.time.split(':')[0]}:{apt.time.split(':')[1].split(' ')[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{apt.patient}</h3>
                  <p className="text-sm text-muted-foreground">{apt.condition}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  apt.status === 'upcoming' 
                    ? 'bg-success/20 text-success' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-8 shadow-elegant">
      <p className="text-center text-muted-foreground">Content for {activeSection}</p>
    </Card>
  );
}
