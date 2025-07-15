import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Separator } from '@shared/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible';
import { Calendar, ChevronDown, Lightbulb, Droplet, Flame } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import ReadingsTable from './ReadingsTable';


interface Reading {
  date: string;
  reading: string;
  status: string;
}

interface Connection {
  utility: string;
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

interface ConnectionTabProps {}

const ConnectionTab: React.FC<ConnectionTabProps> = () => {
  const connectionData = [
    {
      utility: "Electricity",
      icon: Lightbulb,
      color: "text-yellow-600",
      meterNo: "EL-38429175",
      deviceNo: "DEV-EL-001",
      meterType: "Digital Smart Meter",
      lastReading: "1,245 kWh",
      lastReadingDate: "2024-12-05",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      readings: [
        { date: "2024-12-05", reading: "1,245 kWh", status: "Verified" },
        { date: "2024-11-05", reading: "1,189 kWh", status: "Verified" },
        { date: "2024-10-05", reading: "1,134 kWh", status: "Verified" },
        { date: "2024-09-05", reading: "1,078 kWh", status: "Pending" }
      ]
    },
    {
      utility: "Water",
      icon: Droplet,
      color: "text-blue-600",
      meterNo: "WT-74526813",
      deviceNo: "DEV-WT-002",
      meterType: "Digital Flow Meter",
      lastReading: "2,890 L",
      lastReadingDate: "2024-12-05",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      readings: [
        { date: "2024-12-05", reading: "2,890 L", status: "Verified" },
        { date: "2024-11-05", reading: "2,834 L", status: "Verified" },
        { date: "2024-10-05", reading: "2,778 L", status: "Verified" },
        { date: "2024-09-05", reading: "2,722 L", status: "Verified" }
      ]
    },
    {
      utility: "Gas",
      icon: Flame,
      color: "text-orange-600",
      meterNo: "GS-91527364",
      deviceNo: "DEV-GS-003",
      meterType: "Digital Gas Meter",
      lastReading: "156 m³",
      lastReadingDate: "2024-12-04",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      readings: [
        { date: "2024-12-04", reading: "156 m³", status: "Verified" },
        { date: "2024-11-04", reading: "142 m³", status: "Verified" },
        { date: "2024-10-04", reading: "128 m³", status: "Verified" },
        { date: "2024-09-04", reading: "114 m³", status: "Under Review" }
      ]
    }
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {connectionData.map((connection, index) => (
          <Card key={index} className={`border-l-4 ${connection.borderColor}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <connection.icon className={`h-5 w-5 ${connection.color}`} />
                {connection.utility} Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      <p className="text-sm font-semibold">{connection.lastReadingDate}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Collapsible Meter Readings */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
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
        ))}
      </div>
    </div>
  );
};

export default ConnectionTab;