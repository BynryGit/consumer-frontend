import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Info } from 'lucide-react';

// Last 12 bills data only
const last12BillsData = [{
  period: 'Jun 2024',
  electricity: 220,
  water: 115,
  gas: 80,
  total: 415
}, {
  period: 'Jul 2024',
  electricity: 240,
  water: 125,
  gas: 90,
  total: 455
}, {
  period: 'Aug 2024',
  electricity: 275,
  water: 140,
  gas: 105,
  total: 520
}, {
  period: 'Sep 2024',
  electricity: 300,
  water: 155,
  gas: 115,
  total: 570
}, {
  period: 'Oct 2024',
  electricity: 340,
  water: 170,
  gas: 135,
  total: 645
}, {
  period: 'Nov 2024',
  electricity: 400,
  water: 195,
  gas: 175,
  total: 770
}, {
  period: 'Dec 2024',
  electricity: 440,
  water: 220,
  gas: 205,
  total: 865
}, {
  period: 'Jan 2025',
  electricity: 415,
  water: 210,
  gas: 185,
  total: 810
}, {
  period: 'Feb 2025',
  electricity: 380,
  water: 185,
  gas: 160,
  total: 725
}, {
  period: 'Mar 2025',
  electricity: 335,
  water: 170,
  gas: 140,
  total: 645
}, {
  period: 'Apr 2025',
  electricity: 280,
  water: 150,
  gas: 115,
  total: 545
}, {
  period: 'May 2025',
  electricity: 230,
  water: 130,
  gas: 85,
  total: 445
}];

// Calculate percent change between two values
const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return "100";
  const change = (current - previous) / previous * 100;
  return change.toFixed(1);
};
const UsageComparison = () => {
  const [utilityType, setUtilityType] = useState('total');
  const [comparisonPeriod, setComparisonPeriod] = useState('6months');
  const [view, setView] = useState('chart');

  // Filter data based on comparison period
  const getFilteredData = () => {
    if (comparisonPeriod === '3months') {
      return last12BillsData.slice(-3);
    } else if (comparisonPeriod === '6months') {
      return last12BillsData.slice(-6);
    }
    return last12BillsData; // 12 months
  };
  const filteredData = getFilteredData();

  // Calculate summary statistics
  const currentPeriod = filteredData[filteredData.length - 1];
  const previousPeriod = filteredData[0];
  const currentValue = currentPeriod[utilityType as keyof typeof currentPeriod] as number;
  const previousValue = previousPeriod[utilityType as keyof typeof previousPeriod] as number;
  const percentChange = calculateChange(currentValue, previousValue);
  const isIncrease = parseFloat(percentChange) > 0;

  // Calculate averages
  const avgCurrent = filteredData.reduce((sum, item) => sum + (item[utilityType as keyof typeof item] as number), 0) / filteredData.length;

  // Find highest and lowest
  const highest = filteredData.reduce((prev, current) => current[utilityType as keyof typeof current] as number > (prev[utilityType as keyof typeof prev] as number) ? current : prev);
  const lowest = filteredData.reduce((prev, current) => current[utilityType as keyof typeof current] as number < (prev[utilityType as keyof typeof prev] as number) ? current : prev);
  const getUnitLabel = (type: string) => {
    switch (type) {
      case 'electricity':
        return 'kWh';
      case 'water':
        return 'L';
      case 'gas':
        return 'therms';
      case 'total':
        return '₹';
      default:
        return '';
    }
  };
  return <div className="space-y-6">
      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Bill Comparison Scope</h4>
              <p className="text-sm text-blue-700 mt-1">
                You can compare data from your last 12 bills only. Historical data beyond this period is not available for comparison.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">  
        </div>
        
        <div className="flex gap-2">
         <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Period:</p>
            <Select value={comparisonPeriod} onValueChange={value => setComparisonPeriod(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 Bills</SelectItem>
                <SelectItem value="6months">Last 6 Bills</SelectItem>
                <SelectItem value="12months">Last 12 Bills</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentValue.toLocaleString()} {getUnitLabel(utilityType)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{currentPeriod.period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Period Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                {isIncrease ? '+' : ''}{percentChange}%
              </div>
              {isIncrease ? <TrendingUp className="h-4 w-4 text-red-500" /> : <TrendingDown className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs {previousPeriod.period}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgCurrent.toFixed(0)} {getUnitLabel(utilityType)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Over {filteredData.length} bills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={isIncrease ? "destructive" : "default"}>
                {isIncrease ? "Increasing" : "Decreasing"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isIncrease ? "Usage trending upward" : "Usage trending downward"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} Comparison
            </CardTitle>
            <CardDescription>
              Comparing your last {filteredData.length} bills ({utilityType} usage)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {view === 'chart' ? <LineChart data={filteredData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={utilityType} stroke="#8884d8" strokeWidth={2} activeDot={{
                r: 8
              }} name={`${utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} (${getUnitLabel(utilityType)})`} />
                </LineChart> : <BarChart data={filteredData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={utilityType} fill="#8884d8" name={`${utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} (${getUnitLabel(utilityType)})`} />
                </BarChart>}
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bill Analysis</CardTitle>
            <CardDescription>
              Key insights from your bills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Highest Usage</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">{highest.period}</span>
                    <p className="text-xs text-muted-foreground">
                      {(highest[utilityType as keyof typeof highest] as number).toLocaleString()} {getUnitLabel(utilityType)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Lowest Usage</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold">{lowest.period}</span>
                    <p className="text-xs text-muted-foreground">
                      {(lowest[utilityType as keyof typeof lowest] as number).toLocaleString()} {getUnitLabel(utilityType)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-md p-4 bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Analysis Summary</h4>
                <div className="text-sm text-gray-600">
                  {isIncrease ? <p>Your {utilityType} usage has increased by {percentChange}% over the selected period. Consider reviewing your consumption patterns.</p> : <p>Great job! Your {utilityType} usage has decreased by {Math.abs(parseFloat(percentChange))}% over the selected period.</p>}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Data</h4>
                <div className="text-xs text-muted-foreground">
                  <p>✓ Last 12 bills available</p>
                  <p>✓ Period: {last12BillsData[0].period} to {last12BillsData[last12BillsData.length - 1].period}</p>
                  <p>ℹ️ Historical data beyond 12 bills is not stored</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default UsageComparison;