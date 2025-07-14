
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { LineChart, BarChart, ResponsiveContainer, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface UsageTrendsProps {
  usageData: Array<{
    name: string;
    electricity: number;
    water: number;
    gas: number;
    totalCost: number;
  }>;
}

const UsageTrends = ({ usageData }: UsageTrendsProps) => {
  const [utilityFilter, setUtilityFilter] = useState("all");
  
  return (
    <>
      {/* Usage Trends Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Monitor your consumption over time</CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Select value={utilityFilter} onValueChange={setUtilityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Utilities</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="gas">Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(utilityFilter === "all" || utilityFilter === "electricity") && 
                  <Line type="monotone" dataKey="electricity" stroke="#ffcc00" activeDot={{ r: 8 }} name="Electricity" />}
                {(utilityFilter === "all" || utilityFilter === "water") && 
                  <Line type="monotone" dataKey="water" stroke="#0099cc" activeDot={{ r: 8 }} name="Water" />}
                {(utilityFilter === "all" || utilityFilter === "gas") && 
                  <Line type="monotone" dataKey="gas" stroke="#ff6633" activeDot={{ r: 8 }} name="Gas" />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Cost Trends Card */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Over Time</CardTitle>
          <CardDescription>Track how your bills have changed over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalCost" name="Total Cost (₹)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            <p>Your bills have decreased by 10% compared to the same period last year.</p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default UsageTrends;
