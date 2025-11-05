import { Alert, AlertDescription, AlertTitle } from "../UI/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../UI/ui/button";
import { cn } from "../UI/lib/utils";

interface AlertBannerProps {
  title: string;
  description: string;
  severity: "warning" | "danger";
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner = ({
  title,
  description,
  severity,
  onDismiss,
  className,
}: AlertBannerProps) => {
  const severityStyles = {
    warning: "border-warning bg-warning/10 text-warning-foreground",
    danger: "border-destructive bg-destructive/10 text-destructive-foreground",
  };

  return (
    <Alert className={cn(severityStyles[severity], "animate-fade-in", className)}>
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription className="mt-1">{description}</AlertDescription>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
};
