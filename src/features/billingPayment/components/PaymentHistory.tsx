import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Calendar, DollarSign, Eye, Filter, CreditCard, FileText, Wrench, CalendarDays, User, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';

// Enhanced payment data with additional details
const paymentsData = [
  {
    id: 'PAY-2024-001',
    date: '2024-06-10',
    amount: 125.50,
    method: 'Credit Card',
    status: 'Completed',
    billNumber: 'BILL-2024-456',
    serviceId: null,
    installmentNo: null,
    paymentType: 'Bill Payment',
    recordedBy: 'System'
  },
  {
    id: 'PAY-2024-002',
    date: '2024-06-05',
    amount: 500.00,
    method: 'Bank Transfer',
    status: 'Completed',
    billNumber: null,
    serviceId: null,
    installmentNo: 13,
    paymentType: 'Installment Payment',
    recordedBy: 'System'
  },
  {
    id: 'PAY-2024-003',
    date: '2024-05-28',
    amount: 75.00,
    method: 'Credit Card',
    status: 'Completed',
    billNumber: null,
    serviceId: 'SRV-2024-789',
    installmentNo: null,
    paymentType: 'Service Payment',
    recordedBy: 'System'
  },
  {
    id: 'PAY-2024-004',
    date: '2024-05-15',
    amount: 500.00,
    method: 'Bank Transfer',
    status: 'Completed',
    billNumber: null,
    serviceId: null,
    installmentNo: 12,
    paymentType: 'Installment Payment',
    recordedBy: 'System'
  },
  {
    id: 'PAY-2024-005',
    date: '2024-05-10',
    amount: 98.75,
    method: 'Credit Card',
    status: 'Failed',
    billNumber: 'BILL-2024-345',
    serviceId: null,
    installmentNo: null,
    paymentType: 'Bill Payment',
    recordedBy: 'System'
  }
];

const PaymentHistory = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5);
  const [itemsPerLoad] = useState(5);

  const handleViewDetails = (payment: typeof paymentsData[0]) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerLoad, filteredPayments.length));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'Bill Payment':
        return <FileText className="h-4 w-4" />;
      case 'Service Payment':
        return <Wrench className="h-4 w-4" />;
      case 'Installment Payment':
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredPayments = paymentsData.filter(payment => {
    const statusMatch = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    const typeMatch = typeFilter === 'all' || payment.paymentType.toLowerCase().includes(typeFilter);
    return statusMatch && typeMatch;
  });

  const visiblePayments = filteredPayments.slice(0, visibleCount);
  const hasMorePayments = visibleCount < filteredPayments.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle  className="pb-2">Payment History</CardTitle>
              <CardDescription  className="pb-4">
                View all your payment transactions and details
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {visibleCount} of {filteredPayments.length} payments
              </div>
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bill">Bill Payments</SelectItem>
                  <SelectItem value="service">Service Payments</SelectItem>
                  <SelectItem value="installment">Installments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {visiblePayments.map((payment) => (
            <div
              key={payment.id}
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getPaymentTypeIcon(payment.paymentType)}
                      <h3 className="font-semibold">{payment.id}</h3>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    <Badge variant="outline">{payment.paymentType}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-bold text-xl flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        {payment.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {payment.method}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment For</p>
                      <p className="font-medium">
                        {payment.billNumber && `Bill: ${payment.billNumber}`}
                        {payment.serviceId && `Service: ${payment.serviceId}`}
                        {payment.installmentNo && `Installment #${payment.installmentNo}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-end h-full ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(payment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {hasMorePayments && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={handleLoadMore}
                className="flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Load More Payments
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Complete information about payment {selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
                      <p className="text-lg font-semibold">{selectedPayment.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Amount</label>
                      <p className="text-2xl font-bold text-green-600">${selectedPayment.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                      <p className="font-semibold">{new Date(selectedPayment.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                      <p className="font-semibold">{selectedPayment.method}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(selectedPayment.status)}>
                          {selectedPayment.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Type</label>
                      <div className="mt-1">
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          {getPaymentTypeIcon(selectedPayment.paymentType)}
                          {selectedPayment.paymentType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    {selectedPayment.billNumber && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Bill Number</label>
                        <p className="font-semibold text-blue-600">{selectedPayment.billNumber}</p>
                      </div>
                    )}
                    {selectedPayment.serviceId && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Service ID</label>
                        <p className="font-semibold text-blue-600">{selectedPayment.serviceId}</p>
                      </div>
                    )}
                    {selectedPayment.installmentNo && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Installment Number</label>
                        <p className="font-semibold text-blue-600">#{selectedPayment.installmentNo}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Recorded By</label>
                      <p className="font-semibold flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedPayment.recordedBy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;
