import React from "react";
import { Icon, LucideIcon, icons } from "lucide-react";
import { cn } from "@shared/lib/utils";

export type IconButtonProps = {
  label: string;
  icon?: keyof typeof icons;
  className?: string; // Accept full Tailwind class string
  variant?: "primary" | "secondary";
  onClick: () => void;
  disabled?: boolean;
  rightIcon?: keyof typeof icons
};

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  icon,
  className,
  variant = "primary",
  disabled = false,
  rightIcon,
  onClick,
}) => {
      const Icon = icon ? icons[icon] : null;
      const RightIcon = rightIcon ? icons[rightIcon] : null;
      const styles = variant === 'secondary' ? 'bg-background text-foreground border-2' : ''
  return (
    <button
    disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:cursor-not-allowed",
        styles,
        className
      )}
    >
      {Icon && <Icon size={16} />}
      {label}
      {RightIcon && <RightIcon size={16} />}
    </button>
  );
};
