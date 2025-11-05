import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { StatusIndicator } from "@/components/StatusIndicator";
import { AlertBanner } from "@/components/AlertBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Heart, AlertTriangle, Wifi, User, Stethoscope, Shield, Users } from "lucide-react";

interface SensorData {
  heartRate: number;
  fingerDetected: boolean;
  fallDetected: boolean;
  accelerationMagnitude: number;
  lastUpdate: Date;
}

const Index = () => {
  const navigate = useNavigate();
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    heartRate: 72,
    fingerDetected: true,
    fallDetected: false,
    accelerationMagnitude: 1.02,
    lastUpdate: new Date(),
  });

  const [alerts, setAlerts] = useState<Array<{ id: string; type: "fall" | "sensor" }>>([]);

  // Simulate real-time sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sensor data (in real implementation, this would come from ESP32)
      const newHeartRate = Math.floor(Math.random() * (85 - 60) + 60);
      const newFingerDetected = Math.random() > 0.1; // 90% chance of finger detected
      const newAcceleration = Math.random() * 3; // 0-3g range
      const newFallDetected = newAcceleration > 2.5;

      setSensorData({
        heartRate: newHeartRate,
        fingerDetected: newFingerDetected,
        fallDetected: newFallDetected,
        accelerationMagnitude: parseFloat(newAcceleration.toFixed(2)),
        lastUpdate: new Date(),
      });

      // Add fall alert
      if (newFallDetected && !alerts.some((a) => a.type === "fall")) {
        setAlerts((prev) => [...prev, { id: Date.now().toString(), type: "fall" }]);
      }

      // Add sensor alert
      if (!newFingerDetected && !alerts.some((a) => a.type === "sensor")) {
        setAlerts((prev) => [...prev, { id: Date.now().toString(), type: "sensor" }]);
      }

      // Clear fall alert when stable
      if (!newFallDetected) {
        setAlerts((prev) => prev.filter((a) => a.type !== "fall"));
      }

      // Clear sensor alert when finger detected
      if (newFingerDetected) {
        setAlerts((prev) => prev.filter((a) => a.type !== "sensor"));
      }
    }, 5000); // Update every 5 seconds (matching ESP32 intervals)

    return () => clearInterval(interval);
  }, [alerts]);

  const getHeartRateStatus = (bpm: number): "normal" | "warning" | "danger" => {
    if (bpm < 60 || bpm > 100) return "warning";
    if (bpm < 40 || bpm > 120) return "danger";
    return "normal";
  };

  const getFallStatus = (
    detected: boolean
  ): "normal" | "warning" | "danger" | "success" => {
    return detected ? "danger" : "success";
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Health Monitor Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time ESP32 sensor monitoring
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StatusIndicator
                status={sensorData.fingerDetected ? "online" : "warning"}
                label={sensorData.fingerDetected ? "Sensor Connected" : "No Signal"}
                pulse={sensorData.fingerDetected}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Alerts */}
        <div className="space-y-4 mb-8">
          {alerts.map((alert) =>
            alert.type === "fall" ? (
              <AlertBanner
                key={alert.id}
                severity="danger"
                title="Fall Detected!"
                description={`High acceleration detected (${sensorData.accelerationMagnitude}g). Please check on the patient immediately.`}
                onDismiss={() => dismissAlert(alert.id)}
              />
            ) : (
              <AlertBanner
                key={alert.id}
                severity="warning"
                title="Sensor Warning"
                description="No finger detected on pulse sensor. Please ensure proper sensor placement."
                onDismiss={() => dismissAlert(alert.id)}
              />
            )
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Heart Rate"
            value={sensorData.fingerDetected ? sensorData.heartRate : "--"}
            unit="BPM"
            icon={Heart}
            status={
              sensorData.fingerDetected
                ? getHeartRateStatus(sensorData.heartRate)
                : "normal"
            }
            subtitle={
              sensorData.fingerDetected
                ? "Normal resting rate"
                : "Waiting for signal"
            }
            className={sensorData.fingerDetected ? "animate-heartbeat" : ""}
          />

          <MetricCard
            title="SpO2 Oxygen"
            value="--"
            unit="%"
            icon={Activity}
            status="normal"
            subtitle="Not available from analog sensor"
          />

          <MetricCard
            title="Fall Detection"
            value={sensorData.accelerationMagnitude}
            unit="g"
            icon={AlertTriangle}
            status={getFallStatus(sensorData.fallDetected)}
            subtitle={
              sensorData.fallDetected ? "Fall detected!" : "Normal activity"
            }
          />
        </div>

        {/* Status Card */}
        <Card className="p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Wifi className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Pulse Sensor
                  </p>
                  <StatusIndicator
                    status={sensorData.fingerDetected ? "online" : "offline"}
                    label={
                      sensorData.fingerDetected
                        ? "Reading pulse"
                        : "No finger detected"
                    }
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Accelerometer
                  </p>
                  <StatusIndicator status="online" label="Active" pulse />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Last Update
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {sensorData.lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Data Interval
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    5 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Monitoring data from ESP32 with PulseSensor and MPU6050
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            BPM range: 35-200 | Fall threshold: &gt;2.5g
          </p>
        </div>

        {/* Access Healthcare Dashboard */}
        <Card className="mt-8 p-6 shadow-elegant">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Access Healthcare Dashboard</h3>
            <p className="text-muted-foreground mb-6">View comprehensive health records and manage appointments</p>
            <Button onClick={() => setShowRoleSelect(!showRoleSelect)} size="lg">
              {showRoleSelect ? "Hide Options" : "Select Your Role"}
            </Button>
          </div>

          {showRoleSelect && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 animate-fade-in">
              <Button
                variant="outline"
                className="h-auto flex flex-col gap-3 py-6 hover:shadow-glow transition-all"
                onClick={() => navigate('/patient')}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center text-white shadow-glow">
                  <User size={24} />
                </div>
                <span className="font-semibold">Patient</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex flex-col gap-3 py-6 hover:shadow-glow transition-all"
                onClick={() => navigate('/doctor')}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-success to-success-glow flex items-center justify-center text-white shadow-glow">
                  <Stethoscope size={24} />
                </div>
                <span className="font-semibold">Doctor</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex flex-col gap-3 py-6 hover:shadow-glow transition-all"
                onClick={() => navigate('/admin')}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-warning to-warning-glow flex items-center justify-center text-white shadow-glow">
                  <Shield size={24} />
                </div>
                <span className="font-semibold">Admin</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex flex-col gap-3 py-6 hover:shadow-glow transition-all"
                onClick={() => navigate('/guardian')}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-danger to-danger-glow flex items-center justify-center text-white shadow-glow">
                  <Users size={24} />
                </div>
                <span className="font-semibold">Guardian</span>
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Index;
