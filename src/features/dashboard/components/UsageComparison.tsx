
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Progress } from '@shared/ui/progress';

const UsageComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Comparison</CardTitle>
        <CardDescription>How you compare to others</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Your Usage vs. Past Year</h4>
            <div className="flex items-center gap-4">
              <div className="w-full">
                <div className="flex justify-between mb-1 text-xs">
                  <span>Current: 320 kWh</span>
                  <span>Previous: 380 kWh</span>
                </div>
                <Progress value={84} className="h-2" />
                <p className="text-xs text-green-600 mt-1">16% reduction from last year</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Your Usage vs. Similar Households</h4>
            <div className="flex items-center gap-4">
              <div className="w-full">
                <div className="flex justify-between mb-1 text-xs">
                  <span>You: 320 kWh</span>
                  <span>Average: 350 kWh</span>
                </div>
                <Progress value={91} className="h-2" />
                <p className="text-xs text-green-600 mt-1">9% less than similar households</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Your Usage vs. Neighborhood</h4>
            <div className="flex items-center gap-4">
              <div className="w-full">
                <div className="flex justify-between mb-1 text-xs">
                  <span>You: 320 kWh</span>
                  <span>Neighborhood: 365 kWh</span>
                </div>
                <Progress value={88} className="h-2" />
                <p className="text-xs text-green-600 mt-1">12% less than neighborhood average</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageComparison;
