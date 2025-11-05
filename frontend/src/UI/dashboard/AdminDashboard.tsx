import { Stethoscope, Users, Calendar, TrendingUp, Activity, UserPlus, FileText, Shield } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adminData = {
  stats: {
    totalDoctors: 24,
    totalPatients: 1247,
    appointments: 89,
    revenue: 45678
  },
  recentActivity: [
    { type: "registration", user: "Dr. James Wilson", time: "2 hours ago", icon: UserPlus },
    { type: "appointment", user: "Patient #1245", time: "3 hours ago", icon: Calendar },
    { type: "report", user: "Lab Report Generated", time: "5 hours ago", icon: FileText }
  ]
};

interface AdminDashboardProps {
  activeSection: string;
}

export function AdminDashboard({ activeSection }: AdminDashboardProps) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Doctors"
            value={adminData.stats.totalDoctors}
            unit=""
            icon={Stethoscope}
            status="normal"
            subtitle="+2 this week"
          />
          <MetricCard
            title="Total Patients"
            value={adminData.stats.totalPatients}
            unit=""
            icon={Users}
            status="success"
            subtitle="+45 this month"
          />
          <MetricCard
            title="Appointments"
            value={adminData.stats.appointments}
            unit=""
            icon={Calendar}
            status="normal"
            subtitle="Today"
          />
          <MetricCard
            title="Revenue"
            value={`$${(adminData.stats.revenue / 1000).toFixed(1)}k`}
            unit=""
            icon={TrendingUp}
            status="success"
            subtitle="+8.2% vs last month"
          />
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
              <Activity className="text-warning" size={24} />
            </div>
            <div className="space-y-4">
              {adminData.recentActivity.map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-accent/50 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-warning to-warning-glow flex items-center justify-center text-white shadow-glow">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
              <Shield className="text-warning" size={24} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto flex flex-col gap-2 py-4">
                <UserPlus size={24} className="text-warning" />
                <span className="text-sm font-medium">Add Doctor</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col gap-2 py-4">
                <Users size={24} className="text-primary" />
                <span className="text-sm font-medium">Manage Users</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col gap-2 py-4">
                <Calendar size={24} className="text-success" />
                <span className="text-sm font-medium">View Schedule</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col gap-2 py-4">
                <FileText size={24} className="text-danger" />
                <span className="text-sm font-medium">Reports</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-8 shadow-elegant">
      <p className="text-center text-muted-foreground">Content for {activeSection}</p>
    </Card>
  );
}
