
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { AlertCircle, ArrowRight, Activity, BellRing } from 'lucide-react';

interface AlertsNotificationsProps {
  daysUntilDue: number;
  billAmount: number;
}

const AlertsNotifications = ({ daysUntilDue, billAmount }: AlertsNotificationsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Important updates about your utilities</CardDescription>
        </div>
        <BellRing className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Bill Due Soon</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Your bill of ₹{billAmount.toLocaleString()} is due in {daysUntilDue} days. Set up auto-pay to avoid late fees.
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                Set up auto-pay
              </Button>
            </div>
          </div>

          <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Scheduled Maintenance</h4>
              <p className="text-xs text-neutral-500 mt-1">
                There will be a scheduled water outage in your area on May 15, 2025 from 10:00 AM to 2:00 PM.
              </p>
            </div>
          </div>

          <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-md">
            <Activity className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Usage Threshold</h4>
              <p className="text-xs text-neutral-500 mt-1">
                You've used 90% of your monthly average water consumption. Consider reducing usage to save money.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="text-xs w-full">
          View all alerts
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlertsNotifications;
