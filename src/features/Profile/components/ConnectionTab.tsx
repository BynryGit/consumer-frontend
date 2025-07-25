import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Separator } from '@shared/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible';
import { Calendar, ChevronDown, Lightbulb, Droplet, Flame, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import ReadingsTable from './ReadingsTable';
import { useMeterList } from '../hooks';


interface Reading {
  date: string;
  reading: string;
  status: string;
}

interface Connection {
  utility: string;
  id:any
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
  const [loadingUtilityId, setLoadingUtilityId] = useState<string | null>(null);
  const [fetchingUtilities, setFetchingUtilities] = useState<{[key: string]: boolean}>({});

  const mapping = consumerDetailsData?.result?.consumerMappingData?.[0];

  // Create conditional hook calls for each utility
  const connectionMappings = consumerDetailsData?.result?.consumerMappingData || [];
  const meterListQueries = connectionMappings.map((mapping: any) => {
    const shouldFetch = fetchingUtilities[mapping.remoteMeterId];
    return useMeterList({
      remote_utility_id: shouldFetch ? consumerDetailsData?.result?.remoteUtilityId : null,
      consumer_id: shouldFetch ? consumerDetailsData?.result?.id : null,
      remote_meter_id: shouldFetch ? mapping.remoteMeterId : null,
      is_status: false,
      page: 1,
      limit: 10,
    });
  });

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
      status: result.meter?.status|| 'N/A'
    }));
  };

  // Function to trigger meter readings fetch for specific utility
  const fetchUtilityReadings = (utilityId: string) => {
    if (activeUtilityReadings[utilityId] || fetchingUtilities[utilityId]) {
      // Already fetched or currently fetching, don't fetch again
      return;
    }

    setFetchingUtilities(prev => ({
      ...prev,
      [utilityId]: true
    }));
  };

  // Process the query results
  React.useEffect(() => {
    connectionMappings.forEach((mapping: any, index: number) => {
      const query = meterListQueries[index];
      const utilityId = mapping.remoteMeterId;
      
      if (fetchingUtilities[utilityId] && query.data && !activeUtilityReadings[utilityId]) {
        if (query.data.results) {
          const transformedReadings = transformApiDataToReadings(query.data.results, mapping.utilityService);
          setActiveUtilityReadings(prev => ({
            ...prev,
            [utilityId]: transformedReadings
          }));
        }
      }
    });
  }, [meterListQueries.map(q => q.data), fetchingUtilities, activeUtilityReadings, connectionMappings]);

  // Map API data to connection format
  const connectionData: Connection[] = consumerDetailsData?.result?.consumerMappingData 
    ? consumerDetailsData.result.consumerMappingData.map(mapping => {
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
          readings: activeUtilityReadings[mapping.remoteMeterId]
        };
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {connectionData.length > 0 ? (
          connectionData.map((connection, index) => (
            <Card key={index} className={`border-l-4 ${connection.borderColor}`}>
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
                        <p className="text-sm font-semibold">{connection.lastReadingDate !== "N/A" ? new Date(connection.lastReadingDate).toLocaleDateString() : "N/A"}</p>
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
                      <ReadingsTable readings={connection.readings} />
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