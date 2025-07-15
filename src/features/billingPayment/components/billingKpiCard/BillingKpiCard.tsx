import React from 'react';

import { FileText, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { QuickStatsCard } from '@shared/components/QuickStatsCard';

interface Bill {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
}

interface BillingKPICardsProps {
  bills: Bill[];
}

export const BillingKPICards: React.FC<BillingKPICardsProps> = ({ bills }) => {
  // Calculate KPI metrics
  const totalBills = bills.length;
  const unpaidBills = bills.filter(bill => bill.status === 'Unpaid');
  const totalUnpaidAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const dueSoon = bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= 7 && bill.status === 'Unpaid';
  }).length;

  // Mock trend data - in real implementation, this would come from comparing with previous period
  const getTrendData = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Mock previous period data for trend calculation
  const previousTotalBills = 8;
  const previousUnpaidBills = 2;
  const previousUnpaidAmount = 150.50;
  const previousDueSoon = 1;

  const kpiData = [
    {
      title: "Total Bills",
      count: totalBills,
      displayValue: totalBills.toString(),
      trend: getTrendData(totalBills, previousTotalBills),
      icon: <FileText className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Unpaid Bills",
      count: unpaidBills.length,
      displayValue: unpaidBills.length.toString(),
      trend: getTrendData(unpaidBills.length, previousUnpaidBills),
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    {
      title: "Unpaid Amount",
      count: totalUnpaidAmount,
      displayValue: `$${totalUnpaidAmount.toFixed(2)}`,
      trend: getTrendData(totalUnpaidAmount, previousUnpaidAmount),
      icon: <DollarSign className="h-6 w-6 text-green-600" />
    },
    {
      title: "Due Soon",
      count: dueSoon,
      displayValue: dueSoon.toString(),
      trendSummary: "Within 7 days",
      icon: <Calendar className="h-6 w-6 text-orange-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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