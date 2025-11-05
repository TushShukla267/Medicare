import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status?: "normal" | "warning" | "danger" | "success";
  subtitle?: string;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status = "normal",
  subtitle,
  className,
}: MetricCardProps) => {
  const statusColors = {
    normal: "text-primary",
    warning: "text-warning",
    danger: "text-destructive",
    success: "text-success",
  };

  const statusBg = {
    normal: "bg-primary/10",
    warning: "bg-warning/10",
    danger: "bg-destructive/10",
    success: "bg-success/10",
  };

  return (
    <Card className={cn("p-6 shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-in", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", statusBg[status])}>
          <Icon className={cn("h-6 w-6", statusColors[status])} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-4xl font-bold tracking-tight", statusColors[status])}>
            {value}
          </span>
          {unit && <span className="text-xl font-medium text-muted-foreground">{unit}</span>}
        </div>
        {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
      </div>
    </Card>
  );
};
