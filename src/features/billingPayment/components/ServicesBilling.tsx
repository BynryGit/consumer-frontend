import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useToast } from '@shared/hooks/use-toast';
import { Wrench, Calendar, User, MapPin, Eye, ChevronDown } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { ServicesKPICards } from './ServiceKpiCard';



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

// Sample services data
const servicesData: Service[] = [
  {
    id: 1,
    requestNumber: 'SR-2024-001',
    serviceType: 'Electrical Repair',
    requestDate: '2024-03-15',
    technician: 'John Smith',
    status: 'Completed',
    amount: 125.00,
    description: 'Fixed faulty wiring in kitchen outlet',
    address: '123 Main St, Apt 4B',
    completionDate: '2024-03-16'
  },
  {
    id: 2,
    requestNumber: 'SR-2024-002',
    serviceType: 'Plumbing Service',
    requestDate: '2024-03-10',
    technician: 'Sarah Johnson',
    status: 'Pending Payment',
    amount: 89.50,
    description: 'Unclogged bathroom drain and replaced faucet',
    address: '123 Main St, Apt 4B',
    completionDate: '2024-03-12'
  },
  {
    id: 3,
    requestNumber: 'SR-2024-003',
    serviceType: 'HVAC Maintenance',
    requestDate: '2024-02-28',
    technician: 'Mike Davis',
    status: 'Paid',
    amount: 200.00,
    description: 'Annual maintenance and filter replacement',
    address: '123 Main St, Apt 4B',
    completionDate: '2024-03-01'
  },
  {
    id: 4,
    requestNumber: 'SR-2024-004',
    serviceType: 'Appliance Repair',
    requestDate: '2024-03-20',
    technician: 'Lisa Wilson',
    status: 'Pending Payment',
    amount: 75.00,
    description: 'Repaired dishwasher motor',
    address: '123 Main St, Apt 4B',
    completionDate: '2024-03-21'
  },
  {
    id: 5,
    requestNumber: 'SR-2024-005',
    serviceType: 'Electrical Maintenance',
    requestDate: '2024-03-18',
    technician: 'Robert Brown',
    status: 'Completed',
    amount: 150.00,
    description: 'Installed new electrical panel',
    address: '123 Main St, Apt 4B',
    completionDate: '2024-03-19'
  },
  {
    id: 6,
    requestNumber: 'SR-2024-006',
    serviceType: 'Plumbing Repair',
    requestDate: '2024-03-22',
    technician: 'Emma Davis',
    status: 'Pending Payment',
    amount: 95.00,
    description: 'Fixed water leak in basement',
    address: '123 Main St, Apt 4B',
    completionDate: '2024-03-23'
  }
];

const ServicesBilling = () => {
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedServiceForPayment, setSelectedServiceForPayment] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [itemsPerLoad] = useState(3);

  const handleServiceSelection = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const handlePayment = (service: Service) => {
    // Convert service to bill format for the modal
    const billData = {
      id: service.requestNumber,
      date: service.requestDate,
      amount: service.amount,
      type: service.serviceType,
      status: service.status,
      dueDate: service.completionDate
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

  const handleBulkPayment = () => {
    const selectedServicesList = servicesData.filter(s => selectedServices.includes(s.id));
    const totalAmount = selectedServicesList.reduce((sum, service) => sum + service.amount, 0);
    
    toast({
      title: "Bulk Payment Processing",
      description: `Processing payment of $${totalAmount.toFixed(2)} for ${selectedServices.length} services...`
    });
    
    setTimeout(() => {
      toast({
        title: "Bulk Payment Successful",
        description: `All selected service payments completed successfully.`
      });
      setSelectedServices([]);
    }, 2000);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, servicesData.length));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending Payment':
        return 'bg-red-100 text-red-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const visibleServices = servicesData.slice(0, visibleCount);
  const hasMoreServices = visibleCount < servicesData.length;

  return (
    <div className="space-y-6">
      {/* KPI Cards - Now using shared component */}
      <ServicesKPICards services={servicesData} />

      {/* Bulk Payment Section */}
      {selectedServices.length > 0 && (
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Selected Services Payment</CardTitle>
            <CardDescription>
              {selectedServices.length} service(s) selected for payment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">
                  Total Amount: ${servicesData
                    .filter(s => selectedServices.includes(s.id))
                    .reduce((sum, service) => sum + service.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <Button onClick={handleBulkPayment} className="bg-primary hover:bg-primary/90">
                Pay Selected Services
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                    {service.status === 'Pending Payment' && (
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceSelection(service.id)}
                        className="mt-1"
                      />
                    )}
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
                      <div className="grid grid-cols-2 gap-2 text-sm">
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
                          <span>Technician: {service.technician}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{service.address}</span>
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
                    {service.status === 'Pending Payment' && (
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
      />
    </div>
  );
};

export default ServicesBilling;