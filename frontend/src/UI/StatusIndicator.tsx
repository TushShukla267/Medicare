import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning";
  label: string;
  pulse?: boolean;
}

export const StatusIndicator = ({ status, label, pulse = false }: StatusIndicatorProps) => {
  const statusConfig = {
    online: {
      color: "bg-success",
      text: "text-success",
      ring: "ring-success/20",
    },
    offline: {
      color: "bg-muted-foreground",
      text: "text-muted-foreground",
      ring: "ring-muted-foreground/20",
    },
    warning: {
      color: "bg-warning",
      text: "text-warning",
      ring: "ring-warning/20",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={cn("h-3 w-3 rounded-full", config.color)} />
        {pulse && (
          <div
            className={cn(
              "absolute inset-0 h-3 w-3 rounded-full animate-pulse-slow",
              config.color,
              "opacity-75"
            )}
          />
        )}
      </div>
      <span className={cn("text-sm font-medium", config.text)}>{label}</span>
    </div>
  );
};
