import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Lightbulb, Droplet, Flame, Building, Link2 } from 'lucide-react';

const AccountOverview = ({ consumerDetail }) => {
  // Extract consumer data from props, with fallback to empty object
  const consumerData = consumerDetail?.result || {};
  const consumerMappingData = consumerData?.consumerMappingData || [];
  const territoryData = consumerData?.territoryData;

  // Get meter numbers from consumer_mapping_data
  const getMeterNumbers = () => {
    const meters = [];
    
    consumerMappingData.forEach(mapping => {
      const serviceName = mapping.utilityService;
      const meterNumber = mapping.meterDetails?.meterNumber;
      
      if (serviceName === 'Electricity') {
        meters.push({
          icon: Lightbulb,
          color: 'text-[#ffcc00]',
          number: meterNumber
        });
      } else if (serviceName === 'Water') {
        meters.push({
          icon: Droplet,
          color: 'text-[#0099cc]',
          number: meterNumber
        });
      } else if (serviceName === 'Hot Water') {
        meters.push({
          icon: Flame,
          color: 'text-[#ff6633]',
          number: meterNumber
        });
      } else if (serviceName === 'Gas') {
        meters.push({
          icon: Flame,
          color: 'text-[#ff6633]',
          number: meterNumber
        });
      }
    });
    
    return meters;
  };

  // Get linked services from consumer_mapping_data
  const getLinkedServices = () => {
    const services = [];
    
    consumerMappingData.forEach(mapping => {
      const serviceName = mapping.utilityService;
      const meterType = mapping.meterDetails?.meterTypeDisplay;
      
      if (serviceName && meterType) {
        services.push({
          name: serviceName,
          plan: meterType
        });
      }
    });
    
    return services;
  };

  const meterNumbers = getMeterNumbers();
  const linkedServices = getLinkedServices();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Meter Numbers</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {meterNumbers.map((meter, index) => (
              <div key={index} className="flex items-center gap-1">
                <meter.icon className={`h-3 w-3 ${meter.color}`} />
                <span>{meter.number}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Address</h3>
          <div className="flex items-start gap-1">
            <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">
              {territoryData?.service?.area} {territoryData?.service?.subArea} {territoryData?.service?.premise}
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Linked Services</h3>
          <div className="space-y-1">
            {linkedServices.map((service, index) => (
              <div key={index} className="flex items-center gap-1">
                <Link2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Plan Details</h3>
          <div className="text-sm">
            <p>Consumer Number: {consumerData?.consumerNo}</p>
            <p>Status: {consumerData?.statusDisplay}</p>
            <p>Plan: {consumerData?.planDetails?.planName}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountOverview;