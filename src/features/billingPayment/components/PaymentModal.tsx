
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
import { CreditCard, Calendar, DollarSign, FileText, X, AlertTriangle } from 'lucide-react';

interface Bill {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
}

interface PaymentModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ bill, isOpen, onClose }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'cancelled' | null>(null);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!bill) return;

    setIsProcessing(true);
    
    // Show redirect message
    toast({
      title: "Redirecting to Payment Gateway",
      description: "Please wait while we redirect you to the secure payment portal...",
    });

    // Simulate payment processing with random outcomes
    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulate different payment outcomes (for demo purposes)
      const outcomes = ['success', 'failed', 'cancelled'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)] as 'success' | 'failed' | 'cancelled';
      
      setPaymentStatus(randomOutcome);
      setPaymentComplete(true);
      
      switch (randomOutcome) {
        case 'success':
          toast({
            title: "Payment Successful!",
            description: `Your payment of $${bill.amount.toFixed(2)} for ${bill.type} has been processed successfully.`,
          });
          break;
        case 'failed':
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again or contact support.",
            variant: "destructive",
          });
          break;
        case 'cancelled':
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by user. No charges were made.",
          });
          break;
      }
    }, 2000);
  };

  const handleClose = () => {
    setPaymentComplete(false);
    setIsProcessing(false);
    setPaymentMethod('online');
    setPaymentStatus(null);
    onClose();
  };

  const getStatusDisplay = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          icon: '✓',
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          descriptionColor: 'text-green-600'
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="h-8 w-8" />,
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          descriptionColor: 'text-red-600'
        };
      case 'cancelled':
        return {
          icon: <X className="h-8 w-8" />,
          title: 'Payment Cancelled',
          description: 'Payment was cancelled. No charges were made to your account.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          descriptionColor: 'text-gray-600'
        };
      default:
        return null;
    }
  };

  if (!bill) return null;

  const statusDisplay = getStatusDisplay();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {paymentComplete ? statusDisplay?.title || 'Payment Complete' : 'Pay Bill'}
          </DialogTitle>
          <DialogDescription>
            {paymentComplete 
              ? statusDisplay?.description || 'Payment processing complete.'
              : 'Complete your bill payment securely.'
            }
          </DialogDescription>
        </DialogHeader>

        {paymentComplete ? (
          <div className="space-y-4">
            {statusDisplay && (
              <div className={`text-center p-6 ${statusDisplay.bgColor} rounded-lg border ${statusDisplay.borderColor}`}>
                <div className={`${statusDisplay.iconColor} text-4xl mb-2 flex justify-center`}>
                  {statusDisplay.icon}
                </div>
                <h3 className={`text-lg font-semibold ${statusDisplay.titleColor} mb-1`}>
                  {statusDisplay.title}
                </h3>
                <p className={statusDisplay.descriptionColor}>
                  {statusDisplay.description}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill #:</span>
                <span className="font-medium">{bill.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${bill.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Type:</span>
                <span className="font-medium">{bill.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">Online Payment</span>
              </div>
              {paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{paymentStatus}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bill Information */}
            <div className="space-y-3">
              <h4 className="font-semibold">Bill Information</h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bill Number</span>
                  <span className="font-medium">{bill.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Service Type</span>
                  <Badge variant="outline">{bill.type}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Issue Date</span>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(bill.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-lg flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {bill.amount.toFixed(2)}
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
                className="flex-1"
              >
                {isProcessing ? 'Processing...' : `Pay $${bill.amount.toFixed(2)}`}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
