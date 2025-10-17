import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import {
  LineChart,
  BarChart,
  ResponsiveContainer,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";

import { useService, useUsageChart } from "../hooks";

interface UsageTrendsProps {
  usageData?: Array<{
    name: string;
    electricity: number;
    water: number;
    gas: number;
    totalCost: number;
  }>;
  consumerBillData?: any; // Add consumerBillData prop
}

const UsageTrends = ({ usageData, consumerBillData }: UsageTrendsProps) => {
  const { remoteUtilityId, remoteConsumerNumber, consumerId } = getLoginDataFromStorage();

  // API Hooks - service data
  const { data: serviceData } = useService({
    consumer: consumerId,
  });

  const activeServices = useMemo(
    () => serviceData?.result || [],
    [serviceData]
  );

  // Set initial filter to first dropdown value
  const [utilityFilter, setUtilityFilter] = useState("");

  // Set default utility filter when services are loaded
  useEffect(() => {
    if (activeServices.length > 0 && !utilityFilter) {
      setUtilityFilter(activeServices[0]);
    }
  }, [activeServices, utilityFilter]);

  // Usage chart hook - calls API when utility filter changes
  const { data: graphData } = useUsageChart({
    consumer_no: remoteConsumerNumber,
    remote_utility_id: remoteUtilityId,
    fetch_last_six_records: "True",
    utility_service: utilityFilter
  });

  // Transform API data to chart format for usage
  const transformedUsageData = useMemo(() => {
    if (!graphData?.result) return [];
    
    return Object.entries(graphData.result).map(([month, data]: [string, any]) => ({
      name: month,
      consumption: data.consumption,
      // Map to the utility service name for the chart
      [utilityFilter.toLowerCase()]: data.consumption,
    }));
  }, [graphData, utilityFilter]);

  // Transform bill data for cost chart
  const transformedBillData = useMemo(() => {
    if (!consumerBillData?.result?.billData) return [];
    
    return consumerBillData?.result?.billData?.map((bill: any) => ({
      name: bill.billMonth,
      billAmount: bill.billAmount,
      totalAmount: bill.totalAmountPayable,
    }));
  }, [consumerBillData]);

  // Handle utility filter change
  const handleUtilityChange = (value) => {
    setUtilityFilter(value);
  };
console.log("2nd charttttt",transformedBillData)
  return (
    <>
      {/* Usage Trends Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>
                Monitor your consumption over time
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Select value={utilityFilter} onValueChange={handleUtilityChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select utility" />
                </SelectTrigger>
                <SelectContent>
                  {activeServices.map((service, index) => (
                    <SelectItem
                      key={index}
                      value={service}
                    >
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[300px] flex items-center justify-center">
            {transformedUsageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={transformedUsageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="#0099cc"
                    activeDot={{ r: 8 }}
                    name={`${utilityFilter} Consumption`}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground">
                {utilityFilter ? "Loading usage data..." : "Select a utility service to view data"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cost Trends Card */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Over Time</CardTitle>
          <CardDescription>
            Track how your bills have changed over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className="h-[250px] flex items-center justify-center">
            {transformedBillData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transformedBillData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`$${value}`, name]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="billAmount" 
                    name="Bill Amount" 
                    fill="#8884d8" 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground">
                Loading bill data...
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            <p>
              Your bill amounts over the last 6 months.
            </p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default UsageTrends;