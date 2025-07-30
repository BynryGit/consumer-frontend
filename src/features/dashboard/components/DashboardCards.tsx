import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import {
  Droplet,
  Flame,
  Lightbulb,
  DollarSign,
  TrendingDown,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRequestData } from '../hooks';
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";

interface DashboardCardsProps {
  consumerBillData?: any; // Accept consumerBillData as prop
}

const DashboardCards = ({ consumerBillData }: DashboardCardsProps) => {
  const { remoteUtilityId, remoteConsumerNumber, consumerId } = getLoginDataFromStorage();
  
  // Only fetch request data here, consumerBillData is passed as prop
  const { data: requestData } = useRequestData({
    remote_utility_id: remoteUtilityId,
    consumer_id: consumerId,
    page: 1,
    limit: 3,
  });

  // Use passed bill data or fallback to empty object
  const billData = consumerBillData?.result?.billData?.[0];
  const dueDate = new Date(billData?.dueDate);
  const today = new Date();
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  console.log("billdattaaaaa",consumerBillData)

  // Calculate monthly savings
  const calculateMonthlySavings = () => {
    const billDataArray = consumerBillData?.result?.billData;
    
    if (!billDataArray || billDataArray.length < 2) {
      return { savings: 'N/A', isPositive: true };
    }
    
    const currentBill = parseFloat(billDataArray[0]?.billAmount || '0');
    const previousBill = parseFloat(billDataArray[1]?.billAmount || '0');
    
    const savings = previousBill - currentBill;
    
    return {
      savings: Math.abs(savings)?.toFixed(0),
      isPositive: savings >= 0
    };
  };

  const { savings, isPositive } = calculateMonthlySavings();

  // Use fetched request data or fallback to sample data
  const recentRequests = requestData?.results?.map(request => ({
    id: request.requestNo,
    type: request.requestType,
    status: request.statusDisplay,
    date: request.createdDate
  })) ;
  
  // Extract usage data from consumerBillData dynamically
  const getUsageFromConsumptionDetails = () => {
    // Correct path based on your JSON structure
    const consumptionDetails = consumerBillData?.result?.billData?.[0]?.consumptionDetails || [];
    
    return consumptionDetails.map(detail => {
      const serviceName = Object.keys(detail)[0];
      const serviceData = detail[serviceName];
      return {
        name: serviceName,
        consumption: serviceData.consumption,
        unit: getUnitForService(serviceName)
      };
    });
  };

  const getUnitForService = (serviceName) => {
    const unitMap = {
      'Electricity': 'kWh',
      'Water': 'L',
      'Hot Water': 'L',
      'Gas': 'therms',
      'Waste Water': 'L'
    };
    return unitMap[serviceName] || 'units';
  };

  const getIconForService = (serviceName) => {
    const iconMap = {
      'Electricity': { icon: Lightbulb, color: 'text-amber-500' },
      'Water': { icon: Droplet, color: 'text-blue-500' },
      'Hot Water': { icon: Flame, color: 'text-orange-500' },
      'Gas': { icon: Flame, color: 'text-orange-500' },
      'Waste Water': { icon: Droplet, color: 'text-blue-400' }
    };
    return iconMap[serviceName] || { icon: Lightbulb, color: 'text-gray-500' };
  };

  const usageData = getUsageFromConsumptionDetails();

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Current Bill */}
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary flex flex-col h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Bill
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">₹{billData?.billAmount || 0}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={
                    daysUntilDue <= 3
                      ? 'destructive'
                      : daysUntilDue <= 7
                      ? 'default'
                      : 'secondary'
                  } 
                  className="text-xs"
                >
                  Due in {isNaN(daysUntilDue) ? 'N/A' : `${daysUntilDue} days`}
                </Badge>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-primary p-1 bg-primary/10 rounded-full" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full" asChild>
            <Link to="/billing">Pay Now</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Usage Summary */}
      <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Month's Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3">
            {usageData && usageData.length > 0 ? (
              usageData.map((service, index) => {
                const { icon: Icon, color } = getIconForService(service.name);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <span className="font-medium">{service.consumption} {service.unit}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No usage data available
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/usage-consumption">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Monthly Savings */}
      <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Savings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {savings === 'N/A' ? 'N/A' : `${isPositive ? '+' : '-'}₹${savings}`}
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
            <div className="flex flex-col items-center">
              <TrendingDown className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/usage-consumption">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Recent Requests */}
      <Card className="hover:shadow-md transition-shadow flex flex-col h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3">
            {recentRequests && recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{request.type}</span>
                    <span className="text-xs text-muted-foreground">{request.id}</span>
                  </div>
                  <Badge
                    variant={
                      request.status === 'RESOLVED'
                        ? 'default'
                        : request.status === 'IN PROGRESS'
                        ? 'secondary'
                        : request.status === 'PENDING'
                        ? 'outline'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {request.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No recent requests
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/request-tracker">View All Requests</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DashboardCards;