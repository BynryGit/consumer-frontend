
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
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
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Lightbulb, Droplet, Flame, Target, Settings, Zap, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@shared/hooks/use-toast';

// Sample data
const monthlyUsageData = [
  { month: 'Jan', electricity: 320, water: 15000, gas: 45, cost: 1250 },
  { month: 'Feb', electricity: 285, water: 14200, gas: 52, cost: 1180 },
  { month: 'Mar', electricity: 310, water: 15800, gas: 48, cost: 1320 },
  { month: 'Apr', electricity: 335, water: 16500, gas: 42, cost: 1385 },
  { month: 'May', electricity: 360, water: 17200, gas: 38, cost: 1420 },
  { month: 'Jun', electricity: 420, water: 19000, gas: 35, cost: 1650 },
];

const dailyUsageData = [
  { day: 'Mon', electricity: 45, water: 2100, gas: 6 },
  { day: 'Tue', electricity: 42, water: 1950, gas: 5 },
  { day: 'Wed', electricity: 48, water: 2200, gas: 7 },
  { day: 'Thu', electricity: 41, water: 1980, gas: 5 },
  { day: 'Fri', electricity: 44, water: 2050, gas: 6 },
  { day: 'Sat', electricity: 52, water: 2400, gas: 8 },
  { day: 'Sun', electricity: 49, water: 2300, gas: 7 },
];


const UsageCharts = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [utilityType, setUtilityType] = useState("all");
  const [thresholds, setThresholds] = useState({
    electricity: 400,
    water: 20000,
    gas: 50
  });
  const [showThresholdSettings, setShowThresholdSettings] = useState(false);
  const [tempThresholds, setTempThresholds] = useState(thresholds);
  const { toast } = useToast();

  const currentData = timeFrame === "monthly" ? monthlyUsageData : dailyUsageData;

  const handleSaveThresholds = () => {
    setThresholds(tempThresholds);
    setShowThresholdSettings(false);
    toast({
      title: "Thresholds Updated",
      description: "Your consumption thresholds have been saved successfully."
    });
  };

  const getCurrentUsage = (utility: string) => {
    const currentMonth = monthlyUsageData[monthlyUsageData.length - 1];
    switch (utility) {
      case 'electricity':
        return currentMonth.electricity;
      case 'water':
        return currentMonth.water;
      case 'gas':
        return currentMonth.gas;
      default:
        return 0;
    }
  };

  const getThresholdStatus = (utility: string) => {
    const current = getCurrentUsage(utility);
    const threshold = thresholds[utility as keyof typeof thresholds];
    const percentage = (current / threshold) * 100;
    
    if (percentage >= 90) return { status: 'danger', color: 'text-red-600' };
    if (percentage >= 75) return { status: 'warning', color: 'text-amber-600' };
    return { status: 'safe', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Threshold Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="pb-4">
              <CardTitle className="pb-2">Consumption Thresholds</CardTitle>
              <CardDescription>Set alerts when usage exceeds these limits</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTempThresholds(thresholds);
                setShowThresholdSettings(!showThresholdSettings);
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showThresholdSettings ? 'Cancel' : 'Configure'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showThresholdSettings ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="electricity-threshold">Electricity (kWh)</Label>
                  <Input
                    id="electricity-threshold"
                    type="number"
                    value={tempThresholds.electricity}
                    onChange={(e) => setTempThresholds(prev => ({ ...prev, electricity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water-threshold">Water (L)</Label>
                  <Input
                    id="water-threshold"
                    type="number"
                    value={tempThresholds.water}
                    onChange={(e) => setTempThresholds(prev => ({ ...prev, water: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gas-threshold">Gas (therms)</Label>
                  <Input
                    id="gas-threshold"
                    type="number"
                    value={tempThresholds.gas}
                    onChange={(e) => setTempThresholds(prev => ({ ...prev, gas: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveThresholds}>Save Thresholds</Button>
                <Button variant="outline" onClick={() => setShowThresholdSettings(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {['electricity', 'water', 'gas'].map((utility) => {
                const current = getCurrentUsage(utility);
                const threshold = thresholds[utility as keyof typeof thresholds];
                const percentage = (current / threshold) * 100;
                const status = getThresholdStatus(utility);
                
                return (
                  <div key={utility} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {utility === 'electricity' && <Lightbulb className="h-4 w-4 text-amber-500" />}
                        {utility === 'water' && <Droplet className="h-4 w-4 text-blue-500" />}
                        {utility === 'gas' && <Flame className="h-4 w-4 text-orange-500" />}
                        <span className="text-sm font-medium capitalize">{utility}</span>
                      </div>
                      <Badge variant={status.status === 'danger' ? 'destructive' : status.status === 'warning' ? 'secondary' : 'default'}>
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {current.toLocaleString()}</span>
                      <span>Limit: {threshold.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={utilityType} onValueChange={setUtilityType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
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

      {/* Usage Trends - Full width now */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
          <CardDescription>
            {timeFrame === "monthly" ? "Monthly" : "Daily"} consumption patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey={timeFrame === "monthly" ? "month" : "day"} />
                <YAxis />
                <Tooltip />
                <Legend />
                {(utilityType === "all" || utilityType === "electricity") && (
                  <Area
                    type="monotone"
                    dataKey="electricity"
                    stackId="1"
                    stroke="#ffcc00"
                    fill="#ffcc00"
                    fillOpacity={0.6}
                    name="Electricity (kWh)"
                  />
                )}
                {(utilityType === "all" || utilityType === "water") && (
                  <Area
                    type="monotone"
                    dataKey="water"
                    stackId="2"
                    stroke="#0099cc"
                    fill="#0099cc"
                    fillOpacity={0.6}
                    name="Water (L)"
                  />
                )}
                {(utilityType === "all" || utilityType === "gas") && (
                  <Area
                    type="monotone"
                    dataKey="gas"
                    stackId="3"
                    stroke="#ff6633"
                    fill="#ff6633"
                    fillOpacity={0.6}
                    name="Gas (therms)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageCharts;
