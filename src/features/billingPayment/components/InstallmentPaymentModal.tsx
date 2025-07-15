
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Separator } from '@shared/ui/separator';
import { RadioGroup, RadioGroupItem } from '@shared/ui/radio-group';
import { Label } from '@shared/ui/label';
import { useToast } from '@shared/hooks/use-toast';
import { CreditCard, Calendar, DollarSign, FileText, AlertTriangle } from 'lucide-react';

interface Installment {
  id: number;
  installmentNumber: number;
  itemName: string;
  dueDate: string;
  amount: number;
  status: string;
  paidDate: string | null;
}

interface InstallmentPaymentModalProps {
  installment: Installment | null;
  isOpen: boolean;
  onClose: () => void;
}

const InstallmentPaymentModal = ({ installment, isOpen, onClose }: InstallmentPaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!installment) return;

    setIsProcessing(true);
    
    toast({
      title: "Processing Payment",
      description: `Processing installment #${installment.installmentNumber} payment...`,
    });

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      toast({
        title: "Payment Successful!",
        description: `Installment #${installment.installmentNumber} payment of $${installment.amount} has been processed successfully.`,
      });
    }, 2000);
  };

  const handleClose = () => {
    setPaymentComplete(false);
    setIsProcessing(false);
    setPaymentMethod('online');
    onClose();
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (!installment) return null;

  const daysOverdue = installment.status === 'Overdue' ? getDaysOverdue(installment.dueDate) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {paymentComplete ? 'Payment Successful' : `Pay Installment #${installment.installmentNumber}`}
          </DialogTitle>
          <DialogDescription>
            {paymentComplete 
              ? 'Your installment payment has been processed successfully.'
              : 'Complete your installment payment securely.'
            }
          </DialogDescription>
        </DialogHeader>

        {paymentComplete ? (
          <div className="space-y-4">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">Payment Successful!</h3>
              <p className="text-green-600">Your installment payment has been processed successfully.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Installment #:</span>
                <span className="font-medium">{installment.installmentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">${installment.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{installment.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">Online Payment</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Installment Information */}
            <div className="space-y-3">
              <h4 className="font-semibold">Installment Information</h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Installment Number</span>
                  <span className="font-medium">#{installment.installmentNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Service</span>
                  <Badge variant="outline">{installment.itemName}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(installment.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <Badge className={installment.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                      {installment.status}
                    </Badge>
                    {installment.status === 'Overdue' && daysOverdue > 0 && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {daysOverdue} days overdue
                      </Badge>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Amount Due</span>
                  <span className="font-bold text-lg flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {installment.amount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold">Payment Method</h4>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Online Payment
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Secure payment processing with 256-bit SSL encryption
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {paymentComplete ? (
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className={`flex-1 ${installment.status === 'Overdue' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                {isProcessing ? 'Processing...' : `Pay $${installment.amount}`}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );    
};

export default InstallmentPaymentModal;
