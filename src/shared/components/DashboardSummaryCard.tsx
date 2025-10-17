// DashboardSummaryCard.tsx
import React from "react";
import { Card, CardContent } from "@shared/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { LucideIcon, icons } from "lucide-react";
import clsx from "clsx";

interface DashboardSummaryCardProps {
  title?: string;
  value?: string | number;
  subtitle?: string;
  iconName?: keyof typeof icons;
  tooltipText?: string;
  color?: string
  progressPercentage?: number;
  progressColorClass?: string; // e.g. bg-blue-500, default is bg-blue-500
}

export const DashboardSummaryCard: React.FC<DashboardSummaryCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  tooltipText,
  progressPercentage,
  color,
  progressColorClass = "bg-blue-500",
}) => {
  const Icon = iconName ? icons[iconName] : null;
  return (
    <Card className={`flex-1 min-w-[200px] rounded-xl shadow-sm border border-l-4 border-l-${color}-500 p-4 py-6 flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm text-muted-foreground font-medium flex gap-1 items-center">
          {title}
          {tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-xs text-muted-foreground">&#9432;</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {Icon && <Icon className="w-8 h-8 text-muted-foreground bg-muted p-2 rounded-full" />}
      </div>

      <div>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
        {typeof progressPercentage === "number" && (
          <div className="w-full h-2 mt-2 bg-muted rounded-full">
            <div
              className={clsx("h-2 rounded-full transition-all", progressColorClass)}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        )}
      </div>
    </Card>
  );
};
