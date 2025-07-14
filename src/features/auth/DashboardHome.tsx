


import React from 'react';
import { Button } from '../../shared/ui/button';

import UsageTrends from './components/UsageTrends';
import TipsInsights from './components/TipsInsights';
import QuickActions from './components/QuickActions';
import AccountOverview from './components/AccountOverview';
import { RefreshCw } from 'lucide-react';
import DashboardCards from './components/Dashboard';

// Sample data for charts - updated to include total cost for each month
const usageData = [ 
  { name: 'Jan', electricity: 120, water: 85, gas: 45, totalCost: 1150 },
  { name: 'Feb', electricity: 110, water: 80, gas: 60, totalCost: 1280 },
  { name: 'Mar', electricity: 105, water: 75, gas: 55, totalCost: 1245 },
  { name: 'Apr', electricity: 115, water: 90, gas: 50, totalCost: 1320 },
  { name: 'May', electricity: 130, water: 100, gas: 65, totalCost: 1450 },
  { name: 'Jun', electricity: 140, water: 110, gas: 70, totalCost: 1580 },
];

const billData = {
  currentTotal: 1245,
  previousMonth: 1387,
  dueDate: '2025-05-15',
  paymentStatus: 'Pending',
  nextEstimatedBill: 1320,
  currentMonth: 'March',
  breakdown: [
    { name: 'Electricity', value: 685, color: '#ffcc00' },
    { name: 'Water', value: 320, color: '#0099cc' },
    { name: 'Gas', value: 185, color: '#ff6633' },
    { name: 'Service Charges', value: 55, color: '#9333ea' },
  ],
};

const DashboardHome = () => {
  // Usage thresholds
  const electricityUsage = 320; // kWh
  const electricityAvg = 350; // kWh
  const waterUsage = 15000; // Liters
  const waterAvg = 16500; // Liters
  const gasUsage = 56; // therms
  const gasAvg = 65; // therms
  
  return (
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex</h1>
              <p className="text-muted-foreground mt-1">Your utility overview for {billData.currentMonth} 2025</p>
            </div>
          </div>
          {/* Key Metrics */}
          <DashboardCards billData={undefined} electricityUsage={0} electricityAvg={0} waterUsage={0} waterAvg={0} gasUsage={0} gasAvg={0}           
          />
        </section>
        {/* Main Dashboard Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
          {/* Primary Content Area - Full width for usage trends */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Usage Trends - Extended horizontally */}
            <UsageTrends usageData={usageData} />
            {/* Tips and Insights */}
            <TipsInsights />
          </div>
          {/* Sidebar - Secondary actions and info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <QuickActions />
            {/* Account Status */}
            <AccountOverview />
          </div>
        </div>
      </div>
  );
};

export default DashboardHome;
