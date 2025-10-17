import { icons } from "lucide-react";

export interface DashboardSummary {
  title: string;
  value: any;
  subtitle?: any;
  color?: string;
  iconName: keyof typeof icons;
  tooltipText?: string;
  progressPercentage?: number;
  progressColorClass?: string;
}