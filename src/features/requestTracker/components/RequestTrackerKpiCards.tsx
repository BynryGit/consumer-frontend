import React from 'react';
import { DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { QuickStatsCard } from '@shared/components/QuickStatsCard';
import { useRequestSummary } from '@features/requestTracker/hooks'; // Adjust import path as needed
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

interface RequestTrackerKPICardsProps {
  // No props needed - component manages its own data
}

export const RequestTrackerKPICards: React.FC = () => {
  const { remoteUtilityId, consumerId } = getLoginDataFromStorage();

  const { data: requestSummaryData } = useRequestSummary({
    remote_utility_id: remoteUtilityId,
    consumer_id: consumerId
  });

  const requestSummary = requestSummaryData?.result;

  const kpiData = [
    {
      title: "Services Outstanding",
      count: requestSummary?.totalOutstanding || 0,
      displayValue: `$${(requestSummary?.totalOutstanding || 0)}`,
      icon: <DollarSign className="h-6 w-6 text-red-600" />
    },
    {
      title: "Active Requests",
      count: requestSummary?.activeRequests || 0,
      displayValue: (requestSummary?.activeRequests || 0),
      icon: <Clock className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Completed This Month",
      count: requestSummary?.completedThisMonth || 0,
      displayValue: (requestSummary?.completedThisMonth || 0),
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    },
    {
      title: "Overdue Payments",
      count: requestSummary?.overduePayments || 0,
      displayValue: (requestSummary?.overduePayments || 0),
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />
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
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};