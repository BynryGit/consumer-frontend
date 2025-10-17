import { ReactNode } from "react";

export interface QuickStatsCardProps {
    title: string;
    count: any;
    displayValue?: string;
    trend?: number;
    trendSummary?: string;
    trendDirection?: "up" | "down";
    icon: ReactNode;
  }
  