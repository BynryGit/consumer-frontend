
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { PieChart, ResponsiveContainer, Pie, Cell, Tooltip } from 'recharts';

interface BillBreakdownProps {
  breakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  total: number;
}

const BillBreakdown = ({
  breakdown,
  total
}: BillBreakdownProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Breakdown</CardTitle>
        <CardDescription>Current billing period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={breakdown} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                {breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3 mt-2">
          {breakdown.map(item => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-medium">₹{item.value.toLocaleString()}</span>
            </div>
          ))}
          
          <div className="pt-2 mt-2 border-t border-neutral-200 flex items-center justify-between font-medium">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm" className="w-full">
          Pay Bill
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BillBreakdown;
