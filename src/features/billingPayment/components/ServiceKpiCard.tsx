import React from 'react';

import { Wrench, AlertTriangle, DollarSign } from 'lucide-react';
import { QuickStatsCard } from '@shared/components/QuickStatsCard';

interface Service {
  id: number;
  requestNumber: string;
  serviceType: string;
  requestDate: string;
  technician: string;
  status: string;
  amount: number;
  description: string;
  address: string;
  completionDate: string;
}

interface ServicesKPICardsProps {
  services: Service[];
}

export const ServicesKPICards: React.FC<ServicesKPICardsProps> = ({ services }) => {
  // Calculate KPI metrics
  const totalServices = services.length;
  const pendingPaymentServices = services.filter(service => service.status === 'Pending Payment');
  const totalPendingAmount = pendingPaymentServices.reduce((sum, service) => sum + service.amount, 0);

  // Mock trend data - in real implementation, this would come from comparing with previous period
  const getTrendData = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Mock previous period data for trend calculation
  const previousTotalServices = 8;
  const previousPendingServices = 4;
  const previousPendingAmount = 450.00;

  const kpiData = [
    {
      title: "Total Services",
      count: totalServices,
      displayValue: totalServices.toString(),
      trend: getTrendData(totalServices, previousTotalServices),
      trendSummary: "Requested this year",
      icon: <Wrench className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Pending Payments",
      count: pendingPaymentServices.length,
      displayValue: pendingPaymentServices.length.toString(),
      trend: getTrendData(pendingPaymentServices.length, previousPendingServices),
      trendSummary: "Services awaiting payment",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    {
      title: "Outstanding Amount",
      count: totalPendingAmount,
      displayValue: `$${totalPendingAmount.toFixed(2)}`,
      trend: getTrendData(totalPendingAmount, previousPendingAmount),
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
          displayValue={kpi.displayValue}
          trend={kpi.trend}
          trendSummary={kpi.trendSummary}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};