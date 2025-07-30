import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useToast } from '@shared/hooks/use-toast';
import { Calendar, DollarSign, FileText, User, Eye, AlertTriangle } from 'lucide-react';
import InstallmentPaymentModal from './InstallmentPaymentModal';
import { usePaymentAgreementDetail } from '../hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

const InstallmentsBilling = () => {
  const { remoteUtilityId, remoteConsumerNumber, consumerId } = getLoginDataFromStorage();
  const { toast } = useToast();
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleViewAgreement = () => {
    toast({
      title: "Opening Agreement",
      description: "Loading payment agreement document..."
    });
  };

  const { data: paymentAgreementData, refetch: refetchPaymentAgreement } = usePaymentAgreementDetail({
    remote_utility_id: remoteUtilityId ,
    consumer_id: consumerId 
  });

  const paymentAgreement = paymentAgreementData?.result ? {
    agreementId: paymentAgreementData.result.agreementNo || "NA",
    createdDate: paymentAgreementData.result.createdDate || "NA",
    createdBy: paymentAgreementData.result.createdUserRemoteName || "NA",
    totalAmount: paymentAgreementData.result.totalAgreementAmount || "NA",
    downPayment: paymentAgreementData.result.downPayment || "NA",
    monthlyPayment: paymentAgreementData.result.monthlyPayment || "NA",
  } : null;

  const installmentsData = paymentAgreementData?.result?.installments?.map(installment => ({
    id: installment.id || "NA",
    installmentNumber: installment.installmentNo|| "NA",
    dueDate: 'NA',
    amount: installment.installmentAmount || "NA",
    status: installment.statusDisplay || "NA",
    paidDate: installment.paymentDate || "NA"
  })) || [];

  const handlePayment = (installment: typeof installmentsData[0]) => {
    setSelectedInstallment(installment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refetch the payment agreement data to get updated installment statuses
    refetchPaymentAgreement();
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedInstallment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Unpaid':
        return 'bg-blue-100 text-blue-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
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
              <p className="font-semibold">{paymentAgreement?.agreementId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-semibold">{paymentAgreement?.createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-semibold flex items-center gap-1">
                <User className="h-3 w-3" />
                {paymentAgreement?.createdBy}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-semibold">${paymentAgreement?.totalAmount?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Down Payment</p>
              <p className="font-semibold">${paymentAgreement?.downPayment?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="font-semibold">${paymentAgreement?.monthlyPayment}</p>
            </div>

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
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {installmentsData.map(installment => {
            return (
              <div 
                key={installment.id} 
                className={`border rounded-lg p-4 hover:shadow-sm transition-shadow ${
                  installment.status === 'Overdue' ? 'border-red-300 bg-red-50' : ''
                }`}
              >
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">Installment #{installment.installmentNumber}</h3>
                      <Badge className={getStatusColor(installment.status)}>
                        {installment.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-xl flex items-center gap-1">
                          <DollarSign className="h-5 w-5" />
                          {installment.amount}
                        </p>
                      </div>
                        <div>
                        <p className="text-sm text-muted-foreground">Paid Date</p>
                        <p className="font-bold text-xl flex items-center gap-1">
                          {installment.paidDate}
                        </p>
                      </div>
                      {installment.paidDate && installment.paidDate !== "NA" && (
                        <div>
                          <p className="text-sm text-muted-foreground">Paid Date</p>
                          <p className="font-medium text-green-600">
                            {installment.paidDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-end h-full ml-4">
                    {(installment.status === 'Unpaid' || installment.status === 'Overdue') && (
                      <Button 
                        size="lg" 
                        onClick={() => handlePayment(installment)} 
                        className={`${
                          installment.status === 'Overdue' ? 'bg-red-600 hover:bg-red-700' : ''
                        } px-6`}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <InstallmentPaymentModal 
        installment={selectedInstallment} 
        isOpen={isPaymentModalOpen} 
        onClose={handleCloseModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default InstallmentsBilling;