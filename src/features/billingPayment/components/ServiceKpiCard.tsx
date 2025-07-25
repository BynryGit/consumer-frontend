import React from 'react';
import { Wrench, AlertTriangle, DollarSign } from 'lucide-react';
import { QuickStatsCard } from '@shared/components/QuickStatsCard';

interface ServicesSummary {
  totalServices: number;
  pendingPayments: number;
  outstandingAmount: string;
}

interface ServicesKPICardsProps {
  summary: ServicesSummary;
}

export const ServicesKPICards: React.FC<ServicesKPICardsProps> = ({ summary }) => {
  const kpiData = [
    {
      title: "Total Services",
      count: summary.totalServices,
      trendSummary: "Requested this year",
      icon: <Wrench className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Pending Payments",
      count: summary.pendingPayments,
      trendSummary: "Services awaiting payment",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    {
      title: "Outstanding Amount",
      count:summary.outstandingAmount,
      trendSummary: "Total pending payments",
      icon: <DollarSign className="h-6 w-6 text-green-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpiData.map((kpi, index) => (
        <QuickStatsCard
          key={index}
          title={kpi.title}
          count={kpi.count}
          trendSummary={kpi.trendSummary}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};