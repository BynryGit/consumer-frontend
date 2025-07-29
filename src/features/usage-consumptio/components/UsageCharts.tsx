import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Progress } from '@shared/ui/progress';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Lightbulb, Droplet, Flame, Settings, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@shared/hooks/use-toast';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
import { useUsageChart, useThershold, useAddThreshold } from '../hooks';
import { useService } from '@features/dashboard/hooks';

const UsageCharts = () => {
  const [utilityType, setUtilityType] = useState("electricity");
  const [thresholds, setThresholds] = useState<Record<string, number>>({});
  const [showThresholdSettings, setShowThresholdSettings] = useState(false);
  const [tempThresholds, setTempThresholds] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const { remoteUtilityId, remoteConsumerNumber,consumerId } = getLoginDataFromStorage();

  // API Hooks
  const { data: serviceData } = useService({ consumer: consumerId });
  const { data: thresholdData, refetch: refetchThresholds } = useThershold({
    consumer_number: remoteConsumerNumber,
    remote_utility_id: remoteUtilityId,
    fetch_latest: "True",
    bill_data: "True"
  });
  const { data: apiData } = useUsageChart({
    consumer_no: remoteConsumerNumber,
    remote_utility_id: remoteUtilityId,
    fetch_last_six_records: "True",
    utility_service: utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
  });
  const addThresholdMutation = useAddThreshold();

  // Processed data
  const activeServices = useMemo(() => 
    serviceData?.result || [], 
    [serviceData]
  );

  const consumptionDetails = useMemo(() => 
    thresholdData?.result?.billData?.consumptionDetails || [], 
    [thresholdData]
  );

  const apiThresholds = useMemo(() => 
    thresholdData?.result?.additionalData?.thresholds || {}, 
    [thresholdData]
  );

  const transformedData = useMemo(() => {
    if (!apiData?.result) return [];
    return Object.entries(apiData.result).map(([month, data]: [string, any]) => ({
      month,
      consumption: data.consumption,
      [utilityType]: data.consumption
    }));
  }, [apiData, utilityType]);

  // Initialize utility type and thresholds
  useEffect(() => {
    if (activeServices.length > 0) {
      if (!activeServices.find(s => s.toLowerCase() === utilityType)) {
        setUtilityType(activeServices[0].toLowerCase());
      }
      
      if (Object.keys(apiThresholds).length > 0) {
        setThresholds(apiThresholds);
      } else {
        const defaultThresholds: Record<string, number> = {};
        activeServices.forEach(service => {
          // Add any default threshold logic here if needed
        });
        setThresholds(prev => ({ ...prev, ...defaultThresholds }));
      }
    }
  }, [activeServices, utilityType, apiThresholds]);

  const getUnitLabel = (type: string) => {
    // Since we don't have utilityUnit property anymore, use fallback logic
    return type === 'electricity' ? 'kWh' : type === 'water' ? 'L' : 'units';
  };

  const getUtilityIcon = (utility: string) => {
    const serviceName = utility.toLowerCase();
    if (serviceName === 'electricity') return <Lightbulb className="h-4 w-4 text-amber-500" />;
    if (serviceName.includes('water')) return <Droplet className="h-4 w-4 text-blue-500" />;
    if (serviceName === 'gas') return <Flame className="h-4 w-4 text-orange-500" />;
    return <Zap className="h-4 w-4 text-gray-500" />;
  };

  const getUtilityColor = (utility: string) => {
    const serviceName = utility.toLowerCase();
    if (serviceName === 'electricity') return '#ffcc00';
    if (serviceName.includes('water')) return '#0099cc';
    if (serviceName === 'gas') return '#ff6633';
    return '#8884d8';
  };

  const handleSaveThresholds = async () => {
    try {
      await addThresholdMutation.mutateAsync({
        consumer_no: remoteConsumerNumber,
        remote_utility_id: remoteUtilityId,
        thresholds: tempThresholds
      });

      setThresholds(tempThresholds);
      setShowThresholdSettings(false);
      await refetchThresholds();

      toast({
        title: "Thresholds Updated",
        description: "Your consumption thresholds have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save thresholds. Please try again.",
        variant: "destructive"
      });
    }
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {consumptionDetails.map((detail, index) => {
                  const serviceName = Object.keys(detail)[0];
                  const key = serviceName.toLowerCase();
                  return (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`${key}-threshold`}>
                        {serviceName} ({getUnitLabel(key)})
                      </Label>
                      <Input
                        id={`${key}-threshold`}
                        type="number"
                        value={tempThresholds[key] || 0}
                        onChange={(e) => setTempThresholds(prev => ({ 
                          ...prev, 
                          [key]: parseInt(e.target.value) || 0 
                        }))}
                        placeholder={`Enter ${serviceName.toLowerCase()} threshold`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveThresholds} disabled={addThresholdMutation.isPending}>
                  {addThresholdMutation.isPending ? 'Saving...' : 'Save Thresholds'}
                </Button>
                <Button variant="outline" onClick={() => setShowThresholdSettings(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {consumptionDetails.map((detail, index) => {
                const serviceName = Object.keys(detail)[0];
                const utility = serviceName.toLowerCase();
                const data = detail[serviceName];
                const current = data.consumption || 0;
                const percentage = data.thresholdPercentage || 0;
                const threshold = data.limit || 0;
                const status = percentage >= 90 ? 'danger' : percentage >= 75 ? 'warning' : 'safe';
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getUtilityIcon(utility)}
                        <span className="text-sm font-medium">{serviceName}</span>
                      </div>
                      <Badge variant={
                        status === 'danger' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'
                      }>
                        {`${percentage}%`}
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current: {current}</span>
                      <span>Limit: {threshold}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-end">
        <Select value={utilityType} onValueChange={setUtilityType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activeServices.map((service, index) => (
              <SelectItem key={index} value={service.toLowerCase()}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getUtilityIcon(utilityType)}
            {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} Usage Trends
          </CardTitle>
          <CardDescription>
            Monthly consumption patterns for {utilityType} ({getUnitLabel(utilityType)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [
                    `${value} ${getUnitLabel(utilityType)}`, 
                    utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke={getUtilityColor(utilityType)}
                  fill={getUtilityColor(utilityType)}
                  fillOpacity={0.6}
                  name={`${utilityType.charAt(0).toUpperCase() + utilityType.slice(1)} (${getUnitLabel(utilityType)})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageCharts;