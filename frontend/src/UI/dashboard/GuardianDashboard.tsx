import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guardianData = {
  dependents: [
    { name: "Emma Doe", age: 10, relation: "Daughter", lastVisit: "Oct 15, 2025", nextAppointment: "Nov 10, 2025" },
    { name: "Robert Doe", age: 70, relation: "Father", lastVisit: "Oct 20, 2025", nextAppointment: "Nov 5, 2025" }
  ]
};

interface GuardianDashboardProps {
  activeSection: string;
}

export function GuardianDashboard({ activeSection }: GuardianDashboardProps) {
  if (activeSection === 'overview') {
    return (
      <div className="space-y-6">
        {/* Dependents Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guardianData.dependents.map((dependent, idx) => (
            <Card key={idx} className="p-6 shadow-elegant hover:shadow-glow transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-danger to-danger-glow flex items-center justify-center text-white font-bold text-2xl shadow-glow">
                  {dependent.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{dependent.name}</h3>
                  <p className="text-muted-foreground">{dependent.relation} • {dependent.age} years old</p>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border">
                  <span className="text-muted-foreground">Last Visit</span>
                  <span className="font-semibold text-foreground">{dependent.lastVisit}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border">
                  <span className="text-muted-foreground">Next Appointment</span>
                  <span className="font-semibold text-foreground">{dependent.nextAppointment}</span>
                </div>
              </div>
              <Button className="w-full mt-4">View Full Profile</Button>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        <Card className="p-6 shadow-elegant">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-danger" size={24} />
            <h2 className="text-xl font-bold text-foreground">Health Alerts</h2>
          </div>
          <div className="p-4 bg-danger/10 rounded-xl border-l-4 border-danger">
            <p className="font-semibold text-foreground">Upcoming vaccination for Emma</p>
            <p className="text-sm text-muted-foreground mt-1">Annual flu shot scheduled for Nov 10, 2025</p>
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
