import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Badge } from "@shared/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Info,
  Loader2,
} from "lucide-react";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useComparison } from "../hooks";
import { logEvent } from "@shared/analytics/analytics";

const UsageComparison = () => {
  const [utilityType, setUtilityType] = useState("total");
  const [comparisonPeriod, setComparisonPeriod] = useState("6months");
  const [view, setView] = useState("chart");

  // Get consumer data from storage
  const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();

  // Map period to API parameter
  const getPeriodValue = (period: string) => {
    switch (period) {
      case "3months":
        return 3;
      case "6months":
        return 6;
      case "12months":
        return 12;
      default:
        return 6;
    }
  };

  // Fetch data using your existing hook
  const { data: apiData } = useComparison({
    consumer_no: remoteConsumerNumber,
    remote_utility_id: remoteUtilityId,
    period: getPeriodValue(comparisonPeriod),
  });
  useEffect(() => {
    logEvent("Comparison Viewed");
  }, []);
  // Transform API data to component format
  const transformedData = React.useMemo(() => {
    if (!apiData?.result?.monthWiseBillAmount) return [];

    return apiData.result.monthWiseBillAmount.map((item) => ({
      period: item.month,
      electricity: item.billAmount * 0.4, // Mock breakdown for UI
      water: item.billAmount * 0.3,
      gas: item.billAmount * 0.3,
      total: item.billAmount,
      created_date: item.createdDate,
    }));
  }, [apiData]);

  const getUnitLabel = (type: string) => {
    switch (type) {
      case "electricity":
        return "kWh";
      case "water":
        return "L";
      case "gas":
        return "therms";
      case "total":
        return "₹";
      default:
        return "";
    }
  };
  // No data state
  if (!apiData?.result || transformedData.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">No Data Available</h4>
              <p className="text-sm text-yellow-700 mt-1">
                No bill comparison data is available for the selected period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const result = apiData.result;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">
                Bill Comparison Scope
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Analyzing {result.totalBillsAnalyzed} bills over the last{" "}
                {result.periodMonths} months.
                {result.trend === "insufficient_data" &&
                  " More data needed for accurate trend analysis."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Period:</p>
            <Select
              value={comparisonPeriod}
              onValueChange={setComparisonPeriod}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="12months">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">View:</p>
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Bill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{result.currentBillAmount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Latest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Period Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`text-2xl font-bold ${
                  result.trendPercentage > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.trendPercentage > 0 ? "+" : ""}
                {result.trendPercentage}%
              </div>
              {result.trendPercentage > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {result.trend === "insufficient_data"
                ? "Need more data"
                : `vs previous period`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{result.averageBillAmount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Over {result.totalBillsAnalyzed} bills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  result.trend === "increasing"
                    ? "success"
                    : result.trend === "decreasing"
                    ? "default"
                    : "secondary"
                }
              >
                {result.trend === "increasing"
                  ? "Increasing"
                  : result.trend === "decreasing"
                  ? "Decreasing"
                  : "Stable"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {result.trend === "insufficient_data"
                ? "Need more bills for analysis"
                : `Bills trending ${result.trend}`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)}{" "}
              Comparison
            </CardTitle>
            <CardDescription>
              Comparing your last {result.totalBillsAnalyzed} bills over{" "}
              {result.periodMonths} months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {view === "chart" ? (
                <LineChart
                  data={transformedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={utilityType}
                    stroke="#8884d8"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    name={`${
                      utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
                    } (${getUnitLabel(utilityType)})`}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={transformedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey={utilityType}
                    fill="#8884d8"
                    name={`${
                      utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
                    } (${getUnitLabel(utilityType)})`}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bill Analysis</CardTitle>
            <CardDescription>Key insights from your bills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Highest Bill</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">
                      {result.highestBillAmount.month}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      ₹{result.highestBillAmount?.amount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Lowest Bill</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">
                      {result.lowestBillAmount.month}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      ₹{result.lowestBillAmount?.amount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Data</h4>
                <div className="text-xs text-muted-foreground">
                  <p>✓ {result.totalBillsAnalyzed} bills analyzed</p>
                  <p>✓ Period: {result.periodMonths} months</p>
                  <p>ℹ️ Historical data beyond 12 bills is not stored</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageComparison;
