import React from 'react';
import { FileText, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { QuickStatsCard } from '@shared/components/QuickStatsCard';

interface BillSummary {
  totalBills: number;
  outstandingBalance: string;
  unpaidBills: number;
  dueSoon: number;
}

interface BillingKPICardsProps {
  billSummary?: BillSummary;
}

export const BillingKPICards: React.FC<BillingKPICardsProps> = ({ 
  billSummary
}) => {
 

  const kpiData = [
    {
      title: "Total Bills",
      count: billSummary?.totalBills,
      displayValue: billSummary?.totalBills,
      icon: <FileText className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Unpaid Bills",
      count: billSummary?.unpaidBills,
      displayValue: billSummary?.unpaidBills,
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    {
      title: "Outstanding Balance",
      count: billSummary?.outstandingBalance,
      displayValue: `$${billSummary?.outstandingBalance}`,
      icon: <DollarSign className="h-6 w-6 text-green-600" />
    },
    {
      title: "Due Soon",
      count: billSummary?.dueSoon,
      displayValue: billSummary?.dueSoon,
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
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};