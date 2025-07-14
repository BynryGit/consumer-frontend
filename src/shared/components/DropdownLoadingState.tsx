import { Loader2 } from "lucide-react";
import { cn } from "@shared/lib/utils";

interface DropdownLoadingStateProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const DropdownLoadingState: React.FC<DropdownLoadingStateProps> = ({
  className,
  size = "md",
  message = "Loading...",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center justify-center p-2", className)}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      {message && <span className="ml-2 text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}; 