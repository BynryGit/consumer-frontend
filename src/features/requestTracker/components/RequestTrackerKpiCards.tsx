import React from 'react';

import { DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { QuickStatsCard } from '@shared/components/QuickStatsCard';

interface Request {
  id: string;
  subject: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
  lastUpdated: string;
}

interface RequestTrackerKPICardsProps {
  // No props needed - component manages its own data
}

export const RequestTrackerKPICards: React.FC = () => {
  // Get data from table component or use default mock data
  const [requests, setRequests] = React.useState<Request[]>([]);

  React.useEffect(() => {
    // In a real app, this would come from a shared state management solution
    // For now, we'll use the same mock data as the table
    const mockRequests: Request[] = [
      {
        id: 'SR-345621',
        subject: 'Power outage on Main Street',
        type: 'service',
        status: 'open',
        priority: 'high',
        createdAt: '2025-04-08T14:30:00',
        lastUpdated: '2025-04-08T14:30:00'
      },
      {
        id: 'SR-346892',
        subject: 'Installation of new electrical meter',
        type: 'service',
        status: 'rejected',
        priority: 'medium',
        createdAt: '2025-04-07T10:15:00',
        lastUpdated: '2025-04-07T16:30:00'
      },
      {
        id: 'CR-342189',
        subject: 'Billing dispute for March statement',
        type: 'complaint',
        status: 'in_progress',
        priority: 'medium',
        createdAt: '2025-04-06T09:15:00',
        lastUpdated: '2025-04-07T11:30:00'
      },
      {
        id: 'DR-341007',
        subject: 'Request disconnection due to relocation',
        type: 'disconnection',
        status: 'waiting',
        priority: 'low',
        createdAt: '2025-04-05T16:45:00',
        lastUpdated: '2025-04-06T10:20:00'
      },
      {
        id: 'RR-339654',
        subject: 'Reconnect service after payment',
        type: 'reconnection',
        status: 'resolved',
        priority: 'medium',
        createdAt: '2025-04-03T11:30:00',
        lastUpdated: '2025-04-04T15:45:00'
      },
      {
        id: 'TR-337201',
        subject: 'Transfer service to new apartment',
        type: 'transfer',
        status: 'closed',
        priority: 'high',
        createdAt: '2025-04-01T08:20:00',
        lastUpdated: '2025-04-03T09:10:00'
      },
      {
        id: 'SR-344123',
        subject: 'Water pressure issue in apartment building',
        type: 'service',
        status: 'in_progress',
        priority: 'high',
        createdAt: '2025-04-02T09:15:00',
        lastUpdated: '2025-04-08T10:30:00'
      },
      {
        id: 'CR-343456',
        subject: 'Overcharged for gas usage in February',
        type: 'complaint',
        status: 'waiting',
        priority: 'low',
        createdAt: '2025-03-28T14:20:00',
        lastUpdated: '2025-04-01T16:45:00'
      }
    ];
    setRequests(mockRequests);
  }, []);
  // Calculate KPI metrics
  const activeRequests = requests.filter(req => 
    req.status === 'open' || req.status === 'in_progress' || req.status === 'waiting'
  );
  
  const completedThisMonth = requests.filter(req => {
    const requestDate = new Date(req.createdAt);
    const currentDate = new Date();
    return req.status === 'resolved' && 
           requestDate.getMonth() === currentDate.getMonth() &&
           requestDate.getFullYear() === currentDate.getFullYear();
  });

  const overdueRequests = requests.filter(req => {
    const requestDate = new Date(req.createdAt);
    const daysSinceCreated = Math.floor((Date.now() - requestDate.getTime()) / (1000 * 3600 * 24));
    return req.status !== 'resolved' && req.status !== 'closed' && daysSinceCreated > 7;
  });

  // Mock calculation for total outstanding - in real app this would come from API
  const totalOutstanding = activeRequests.length * 625; // Simplified calculation

  // Mock trend data - in real implementation, this would come from comparing with previous period
  const getTrendData = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Mock previous period data for trend calculation
  const previousTotalOutstanding = 2000;
  const previousActiveRequests = 4;
  const previousCompletedRequests = 8;
  const previousOverdueRequests = 2;

  const kpiData = [
    {
      title: "Total Outstanding",
      count: totalOutstanding,
      displayValue: `$${totalOutstanding.toLocaleString()}`,
      trend: getTrendData(totalOutstanding, previousTotalOutstanding),
      trendSummary: "Pending service charges",
      icon: <DollarSign className="h-6 w-6 text-red-600" />
    },
    {
      title: "Active Requests",
      count: activeRequests.length,
      displayValue: activeRequests.length.toString(),
      trend: getTrendData(activeRequests.length, previousActiveRequests),
      trendSummary: "Currently in progress",
      icon: <Clock className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Completed This Month",
      count: completedThisMonth.length,
      displayValue: completedThisMonth.length.toString(),
      trend: getTrendData(completedThisMonth.length, previousCompletedRequests),
      trendSummary: "Successfully resolved",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />
    },
    {
      title: "Overdue Requests",
      count: overdueRequests.length,
      displayValue: overdueRequests.length.toString(),
      trend: getTrendData(overdueRequests.length, previousOverdueRequests),
      trendSummary: "Requires immediate attention",
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
          trend={kpi.trend}
          trendSummary={kpi.trendSummary}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};