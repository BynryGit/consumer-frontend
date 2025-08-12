import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Separator } from '@shared/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible';
import { Calendar, ChevronDown, Lightbulb, Droplet, Flame, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import ReadingsTable from './ReadingsTable';
import { useMeterList } from '../hooks';
import { logEvent } from '@shared/analytics/analytics';

interface Reading {
  date: string;
  reading: string;
  status: string;
}

interface Connection {
  utility: string;
  id: any;
  icon: LucideIcon;
  color: string;
  meterNo: string;
  deviceNo: string;
  meterType: string;
  lastReading: string;
  lastReadingDate: string;
  bgColor: string;
  borderColor: string;
  readings: Reading[];
}

interface ConnectionTabProps {
  consumerDetailsData: any;
}

const ConnectionTab: React.FC<ConnectionTabProps> = ({ consumerDetailsData }) => {
  const [activeUtilityReadings, setActiveUtilityReadings] = useState<{[key: string]: Reading[]}>({});
  const [currentFetchingUtility, setCurrentFetchingUtility] = useState<string | null>(null);

  const connectionMappings = consumerDetailsData?.result?.consumerMappingData || [];
  
  // Find the currently fetching utility mapping
  const currentMapping = connectionMappings.find((mapping: any) => 
    mapping.remoteMeterId === currentFetchingUtility
  );

  // Single hook call - only fetch for the currently selected utility
  const meterListQuery = useMeterList({
    remote_utility_id: currentMapping ? consumerDetailsData?.result?.remoteUtilityId : null,
    consumer_id: currentMapping ? consumerDetailsData?.result?.id : null,
    remote_meter_id: currentMapping ? currentMapping.remoteMeterId : null,
    is_status: false,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
  logEvent("Connection Tab Viewed");
}, []);

  // Function to get utility icon and colors based on service type
  const getUtilityConfig = (utilityService: string) => {
    switch (utilityService) {
      case 'Electricity':
        return {
          icon: Lightbulb,
          color: "text-yellow-600",
          borderColor: "border-yellow-200"
        };
      case 'Water':
        return {
          icon: Droplet,
          color: "text-blue-600",
          borderColor: "border-blue-200"
        };
      case 'Hot Water':
        return {
          icon: Zap,
          color: "text-red-600",
          borderColor: "border-red-200"
        };
      case 'Gas':
        return {
          icon: Flame,
          color: "text-orange-600",
          borderColor: "border-orange-200"
        };
      default:
        return {
          icon: Lightbulb,
          color: "text-gray-600",
          borderColor: "border-gray-200"
        };
    }
  };

  // Transform API data to Reading format
  const transformApiDataToReadings = (apiResults: any[], utilityService: string): Reading[] => {
    const unit = utilityService === 'Electricity' ? 'kWh' : 
                utilityService === 'Water' ? 'L' : 
                utilityService === 'Hot Water' ? 'L' : 'm³';

    return apiResults.map(result => ({
      date: result.meter?.currentReadingDate || result.createdDate || result.updatedOn || '1222',
      reading: result.meter?.currentReading ? `${result.meter.currentReading} ${unit}` : (result.meterReading ? `${result.meter_reading} ${unit}` : 'N/A'),
      status: result.meter?.status || 'N/A'
    }));
  };

  // Function to trigger meter readings fetch for specific utility
  const fetchUtilityReadings = (utilityId: string) => {
    if (activeUtilityReadings[utilityId]) {
      // Already fetched, don't fetch again
      return;
    }

    setCurrentFetchingUtility(utilityId);
  };

  // Handle the meter list query response
  useEffect(() => {
    if (currentFetchingUtility && meterListQuery.data) {
      const mapping = connectionMappings.find((m: any) => m.remoteMeterId === currentFetchingUtility);
      
      if (mapping && meterListQuery.data.results) {
        const transformedReadings = transformApiDataToReadings(
          meterListQuery.data.results, 
          mapping.utilityService
        );
        
        setActiveUtilityReadings(prev => ({
          ...prev,
          [currentFetchingUtility]: transformedReadings
        }));
      }

      setCurrentFetchingUtility(null);
    }
  }, [meterListQuery.data, currentFetchingUtility, connectionMappings]);

  // Map API data to connection format
  const connectionData: Connection[] = connectionMappings.map((mapping: any) => {
    const config = getUtilityConfig(mapping.utilityService);
   
    return {
      utility: mapping.utilityService || 'N/A',
      id: mapping.remoteMeterId,
      icon: config.icon,
      color: config.color,
      meterNo: mapping.meterDetails?.meterNumber || 'N/A',
      deviceNo: mapping.meterDetails?.deviceNo || 'N/A',
      meterType: mapping.meterDetails?.meterTypeDisplay || 'N/A',
      lastReading: mapping.meterDetails?.lastReading || 'N/A',
      lastReadingDate: mapping.meterDetails?.lastReadingDate || 'N/A',
      borderColor: config.borderColor,
      bgColor: '', // You might want to add bgColor to getUtilityConfig
      readings: activeUtilityReadings[mapping.remoteMeterId] || []
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {connectionData.length > 0 ? (
          connectionData.map((connection, index) => (
            <Card key={connection.id} className={`border-l-4 ${connection.borderColor}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <connection.icon className={`h-5 w-5 ${connection.color}`} />
                  {connection.utility} Connection
                </CardTitle>
              </CardHeader>
              <CardContent className='p-2'>
                <div className={`p-4 ${connection.bgColor} rounded-lg space-y-4`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Meter Number</label>
                      <p className="text-sm mt-1 font-mono font-semibold">{connection.meterNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Device Number</label>
                      <p className="text-sm mt-1 font-mono font-semibold">{connection.deviceNo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Meter Type</label>
                      <p className="text-sm mt-1 font-semibold">{connection.meterType}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Reading</label>
                      <p className="text-lg font-semibold mt-1">{connection.lastReading}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Reading Date</label>
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-semibold">
                          {connection.lastReadingDate !== "N/A" 
                            ? new Date(connection.lastReadingDate).toLocaleDateString() 
                            : "N/A"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Collapsible Meter Readings */}
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="flex items-center justify-between w-full p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => fetchUtilityReadings(connection.id)}
                    >
                      <span className="text-sm font-medium">View Reading History</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      {connection.readings.length > 0 ? (
                        <ReadingsTable readings={connection.readings} />
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">
                            Click "View Reading History" to load data
                          </p>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>    
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-l-4 border-gray-200">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No connection data available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConnectionTab;