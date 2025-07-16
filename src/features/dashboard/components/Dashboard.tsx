import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Progress } from '@shared/ui/progress';
import { Badge } from '@shared/ui/badge';
import { Droplet, Flame, Lightbulb, Clock, DollarSign, TrendingDown, AlertTriangle, ArrowRight, Bell, TrendingUp, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
interface BillData {
  currentTotal: number;
  previousMonth: number;
  dueDate: string;
  paymentStatus: string;
  nextEstimatedBill: number;  
  currentMonth: string;
  breakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

interface DashboardCardsProps {
  billData: BillData;
  electricityUsage: number;
  electricityAvg: number;
  waterUsage: number;
  waterAvg: number;
  gasUsage: number;
  gasAvg: number;
}

const DashboardCards = ({ 
  billData, 
  electricityUsage, 
  electricityAvg,
  waterUsage,
  waterAvg,
  gasUsage,
  gasAvg
}: DashboardCardsProps) => {
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  
  const dueDate = new Date(billData?.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const electricityPercent = Math.round((electricityUsage / electricityAvg) * 100);
  const waterPercent = Math.round((waterUsage / waterAvg) * 100);
  const gasPercent = Math.round((gasUsage / gasAvg) * 100);
  
  
  // Sample recent requests data
  const recentRequests = [
    { id: 'REQ-001', type: 'Service Call', status: 'In Progress', date: '2025-01-15' },
    { id: 'REQ-002', type: 'Bill Query', status: 'Resolved', date: '2025-01-10' },
    { id: 'REQ-003', type: 'Connection', status: 'Pending', date: '2025-01-08' },
  ];
  
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Current Bill - Most Important */}
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={daysUntilDue <= 3 ? "destructive" : daysUntilDue <= 7 ? "default" : "secondary"} className="text-xs">
                  Due in {daysUntilDue} days
                </Badge>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-primary p-1 bg-primary/10 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full" asChild>
            <Link to="/billing">Pay Now</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Usage Summary */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">This Month's Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Electricity</span>
              </div>
              <span className="font-medium">{electricityUsage} kWh</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Water</span>
              </div>
              <span className="font-medium">{waterUsage.toLocaleString()} L</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Gas</span>
              </div>
              <span className="font-medium">{gasUsage} therms</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/usage-consumption">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Savings Tracker */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingDown className="h-6 w-6 text-green-500" />

            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/usage-consumption">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Recent Requests */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{request.type}</span>
                  <span className="text-xs text-muted-foreground">{request.id}</span>
                </div>
                <Badge 
                  variant={
                    request.status === 'Resolved' ? 'default' : 
                    request.status === 'In Progress' ? 'secondary' : 
                    'outline'
                  }
                  className="text-xs"
                >
                  {request.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/request-tracker">View All Requests</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardCards;
