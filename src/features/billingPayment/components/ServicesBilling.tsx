import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useToast } from '@shared/hooks/use-toast';
import { Wrench, Calendar, User, MapPin, Eye, ChevronDown } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { ServicesKPICards } from './ServiceKpiCard';
import { useServicesData } from '../hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

// Service interface
interface Service {
  id: number;
  requestNumber: string;
  serviceType: string;
  requestDate: string;
  technician: string;
  status: string;
  amount: number;
  description: string;
  address: string;
  completionDate: string;
}

const ServicesBilling = () => {
  const { toast } = useToast();

  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [itemsPerLoad] = useState(3);
  const { remoteUtilityId, consumerId } = getLoginDataFromStorage();
  
  const { data, refetch: refetchServicesData } = useServicesData({
    remote_utility_id: remoteUtilityId,
    consumer_id: consumerId
  });

  // Transform API data to match Service interface
  const servicesData = data?.result?.data?.map(item => ({
    id: item.id,
    requestNumber: item.requestNo,
    serviceType: item.utilitySupportRequest?.name || 'Service',
    requestDate: item.createdDate,
    technician: item.createdUserRemoteName,
    status: item.paymentStatus,
    amount: item.utility_supportRequest?.extraData?.serviceCharge || 0,
    description: item.utilitySupportRequest?.longDescription || item.utilitySupportRequest?.name || 'Service request',
    address: '', // Not available in API response
    completionDate: item.closeDate || "NA"
  })) || [];

  // Get summary data from API
  const summaryData = data?.result?.summary;

  const handlePayment = (service: Service) => {
    // Convert service to bill format for the modal
    const billData = {
      id: service.requestNumber,
      date: service.requestDate,
      amount: service.amount,
      type: service.serviceType,
      status: service.status,
      dueDate: service.completionDate,
      serviceRequestId: service.id // Pass the service request ID for payment
    };
    setSelectedServiceForPayment(billData);
    setIsPaymentModalOpen(true);
  };

  const handleViewService = (service: Service) => {
    console.log('Viewing service details:', service.id);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedServiceForPayment(null);
  };

  const handlePaymentSuccess = () => {
    // Refetch the services data to get updated payment statuses
    refetchServicesData();
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, servicesData.length));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const visibleServices = servicesData?.slice(0, visibleCount);
  const hasMoreServices = visibleCount < servicesData.length;

  return (
    <div className="space-y-6">
      {/* KPI Cards - Using API summary data */}
      {summaryData && <ServicesKPICards summary={summaryData} />}

      {/* Services List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Bills</CardTitle>
              <CardDescription>
                Pay for completed services and maintenance requests
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {visibleCount} of {servicesData.length} services
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleServices.map(service => (
            <div key={service.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{service.serviceType}</h3>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">Request: {service.requestNumber}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Requested: {service.requestDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Completed: {service.completionDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>Created By: {service.technician}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-xl font-bold">${service.amount.toFixed(2)}</div>
                    <Button variant="ghost" size="sm" onClick={() => handleViewService(service)} className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-end pt-2">
                  <div className="flex items-center gap-2">
                    {service.status === 'Unpaid' && (
                      <Button size="sm" onClick={() => handlePayment(service)} className="h-8">
                        Pay Now
                      </Button>
                    )}
                    {service.status === 'Paid' && (
                      <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {hasMoreServices && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                className="flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Load More Services
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentModal 
        bill={selectedServiceForPayment} 
        isOpen={isPaymentModalOpen} 
        onClose={handlePaymentModalClose}
        onPaymentSuccess={handlePaymentSuccess}
        paymentType="service" // Add the payment type prop
      />
    </div>
  );
};

export default ServicesBilling;