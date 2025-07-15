import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { useToast } from '@shared/hooks/use-toast';
import { Calendar, DollarSign, FileText, User, Eye, AlertTriangle, ArrowUpDown } from 'lucide-react';
import InstallmentPaymentModal from './InstallmentPaymentModal';

// Payment Agreement data
const paymentAgreement = {
  agreementId: 'PA-2023-15847',
  createdDate: '2023-04-15',
  createdBy: 'Sarah Johnson',
  totalAmount: 29000,
  downPayment: 2000,
  monthlyPayment: 500,
  startDate: '2023-04-15',
  endDate: '2026-10-15',
  notes: 'Solar panel installation and HVAC system upgrade payment plan. Customer opted for 36-month payment schedule with no interest for first 12 months.'
};

// Enhanced installments data with installment numbers and specific dates
const installmentsData = [{
  id: 1,
  installmentNumber: 1,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-05-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-05-14'
}, {
  id: 2,
  installmentNumber: 2,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-06-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-06-15'
}, {
  id: 3,
  installmentNumber: 3,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-07-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-07-12'
}, {
  id: 4,
  installmentNumber: 4,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-08-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-08-15'
}, {
  id: 5,
  installmentNumber: 5,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-09-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-09-14'
}, {
  id: 6,
  installmentNumber: 6,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-10-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-10-15'
}, {
  id: 7,
  installmentNumber: 7,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-11-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-11-13'
}, {
  id: 8,
  installmentNumber: 8,
  itemName: 'Solar Panel Installation',
  dueDate: '2023-12-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2023-12-15'
}, {
  id: 9,
  installmentNumber: 9,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-01-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2024-01-12'
}, {
  id: 10,
  installmentNumber: 10,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-02-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2024-02-15'
}, {
  id: 11,
  installmentNumber: 11,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-03-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2024-03-14'
}, {
  id: 12,
  installmentNumber: 12,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-04-15',
  amount: 500,
  status: 'Paid',
  paidDate: '2024-04-15'
}, {
  id: 13,
  installmentNumber: 13,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-05-15',
  amount: 500,
  status: 'Overdue',
  paidDate: null
}, {
  id: 14,
  installmentNumber: 14,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-06-15',
  amount: 500,
  status: 'Pending',
  paidDate: null
}, {
  id: 15,
  installmentNumber: 15,
  itemName: 'Solar Panel Installation',
  dueDate: '2024-07-15',
  amount: 500,
  status: 'Pending',
  paidDate: null
}];
const InstallmentsBilling = () => {
  const {
    toast
  } = useToast();
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('installment-asc');
  const handleViewAgreement = () => {
    toast({
      title: "Opening Agreement",
      description: "Loading payment agreement document..."
    });
  };
  const handlePayment = (installment: typeof installmentsData[0]) => {
    setSelectedInstallment(installment);
    setIsPaymentModalOpen(true);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const sortedInstallments = useMemo(() => {
    const sorted = [...installmentsData];
    switch (sortBy) {
      case 'installment-asc':
        return sorted.sort((a, b) => a.installmentNumber - b.installmentNumber);
      case 'installment-desc':
        return sorted.sort((a, b) => b.installmentNumber - a.installmentNumber);
      case 'due-date-asc':
        return sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      case 'due-date-desc':
        return sorted.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      case 'status-pending-first':
        return sorted.sort((a, b) => {
          if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
          if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
          if (a.status === 'Pending' && b.status === 'Paid') return -1;
          if (b.status === 'Pending' && a.status === 'Paid') return 1;
          return a.installmentNumber - b.installmentNumber;
        });
      case 'amount-asc':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'amount-desc':
        return sorted.sort((a, b) => b.amount - a.amount);
      default:
        return sorted;
    }
  }, [sortBy]);
  return <div className="space-y-6">
      {/* Payment Agreement Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 pb-4">
                <FileText className="h-5 w-5 text-primary" />
                Payment Agreement Information
              </CardTitle>
              <CardDescription className="pb-4">
                Details of your payment agreement and installment plan
              </CardDescription>
            </div>
            <Button onClick={handleViewAgreement} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Agreement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Agreement ID</p>
              <p className="font-semibold">{paymentAgreement.agreementId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-semibold">{new Date(paymentAgreement.createdDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-semibold flex items-center gap-1">
                <User className="h-3 w-3" />
                {paymentAgreement.createdBy}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-semibold">${paymentAgreement.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Down Payment</p>
              <p className="font-semibold">${paymentAgreement.downPayment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="font-semibold">${paymentAgreement.monthlyPayment}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Installments</p>
              <p className="font-semibold">{new Date(paymentAgreement.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-semibold">{new Date(paymentAgreement.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Notes</p>
            <p className="text-sm bg-muted p-3 rounded-md">{paymentAgreement.notes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Installments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Installment Schedule</CardTitle>
              <CardDescription className="pb-4">
                Complete list of your installment payments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="installment-asc">Installment # (Low to High)</SelectItem>
                  <SelectItem value="installment-desc">Installment # (High to Low)</SelectItem>
                  <SelectItem value="due-date-asc">Due Date (Earliest First)</SelectItem>
                  <SelectItem value="due-date-desc">Due Date (Latest First)</SelectItem>
                  <SelectItem value="status-pending-first">Status (Pending First)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedInstallments.map(installment => {
          const daysOverdue = installment.status === 'Overdue' ? getDaysOverdue(installment.dueDate) : 0;
          return <div key={installment.id} className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${installment.status === 'Overdue' ? 'border-red-300 bg-red-50' : ''}`}>
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">Installment #{installment.installmentNumber}</h3>
                      <Badge className={getStatusColor(installment.status)}>
                        {installment.status}
                      </Badge>
                      {installment.status === 'Overdue' && daysOverdue > 0 && <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {daysOverdue} days overdue
                        </Badge>}
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(installment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-xl flex items-center gap-1">
                          <DollarSign className="h-5 w-5" />
                          {installment.amount}
                        </p>
                      </div>
                      {installment.paidDate && <div>
                          <p className="text-sm text-muted-foreground">Paid Date</p>
                          <p className="font-medium text-green-600">
                            {new Date(installment.paidDate).toLocaleDateString()}
                          </p>
                        </div>}
                      {installment.status === 'Overdue' && <div>
                          <p className="text-sm text-muted-foreground">Days Overdue</p>
                          <p className="font-medium text-red-600">{daysOverdue} days</p>
                        </div>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-end h-full ml-4">
                    {(installment.status === 'Pending' || installment.status === 'Overdue') && <Button size="lg" onClick={() => handlePayment(installment)} className={`${installment.status === 'Overdue' ? 'bg-red-600 hover:bg-red-700' : ''} px-6`}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>}
                  </div>
                </div>
              </div>;
        })}
        </CardContent>
      </Card>

      <InstallmentPaymentModal installment={selectedInstallment} isOpen={isPaymentModalOpen} onClose={() => {
      setIsPaymentModalOpen(false);
      setSelectedInstallment(null);
    }} />
    </div>;
};
export default InstallmentsBilling;