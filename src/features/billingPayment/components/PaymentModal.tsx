import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { Label } from "@shared/ui/label";
import { useToast } from "@shared/hooks/use-toast";
import {
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  X,
  AlertTriangle,
} from "lucide-react";
import { useConnectPaymentMethod, usePayBill } from "../hooks";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useGlobalUserProfile } from "@shared/hooks/useGlobalUser";

interface Bill {
  id: string;
  date: string;
  amount: number;
  outstandingAmount: number;
  type: string;
  status: string;
  dueDate: string;
  serviceRequestId?: number; // Added to link to service request
  billId: any;
}

interface PaymentModalProps {
  bill: any | null;
  isOpen: boolean;
  onClose: () => void;
  status?: string;
  activePspId?: number;
  activePspName?: string;
  onPaymentSuccess?: () => void; // Callback to refetch data
  paymentType: "bill" | "service" | "installment"; // New prop to distinguish payment type
}

const PaymentModal = ({
  bill,
  isOpen,
  onClose,
  status,
  activePspId,
  activePspName,
  onPaymentSuccess,
  paymentType,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);
  const { toast } = useToast();
  const { remoteUtilityId, consumerId, firstName, lastName } =
    getLoginDataFromStorage();

  const { mutate: payBill, isPending: isProcessing } = usePayBill();
  const { mutate: connectPaymentMethod } = useConnectPaymentMethod();
  const { data: user } = useGlobalUserProfile();
  const consumerDetails = localStorage.getItem("consumerDetails");
  const parsed = JSON.parse(consumerDetails);
  useEffect(() => {
    if (status === "success" || status === "failed") {
      setPaymentComplete(true);
      setPaymentStatus(status);
    }
  }, [status]);

  const baseUrl = import.meta.env.VITE_PLATFORM_URL;

  const paymentTypeMap: Record<string, string> = {
    bill: "BILLING",
    service: "SERVICE",
    installment: "INSTALLMENT",
  };

  const tabNameMap: Record<string, string> = {
    bill: "bills",
    service: "services",
    installment: "installments",
  };
  const tabName = tabNameMap[paymentType];
  const paymentTypeLabel = paymentTypeMap[paymentType] || "UNKNOWN";
  const handlePayment = async () => {
    console.log("debug bill captured", bill);
    if (!bill || !activePspId) {
      toast({
        title: "Error",
        description: "Payment Method is not set from the utility yet.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("billForPayment", JSON.stringify(bill));

    // Determine amount
    const amount =
      paymentType === "bill"
        ? Number(bill?.outstandingAmount)
        : Number(bill?.amount);

    // Shared base payload
    const basePayload = {
      amount,
      remote_consumer_id: parsed?.result?.id,
      psp_mapping_id: activePspId,
      remote_utility_id: remoteUtilityId,
      description: "It is a billing payment",
      payment_type: paymentTypeLabel,
      remote_reference_entity_id:
      paymentType === "bill" ? bill?.billId : bill?.id,
      source: 1,
    };

    let payload: Record<string, any> = {};

    // PSP-specific payload building
    switch (activePspName.toLowerCase()) {
      case "stripe":
        payload = {
          ...basePayload,
          redirect_url: `${baseUrl}billing?tab=${tabName}&page=1&status=success`,
          // redirect_url: `http://localhost:5175/billing?tab=${tabName}&page=1&status=success`,
          cancel_url: `${baseUrl}billing?tab=${tabName}&page=1&status=failed`,
          payment_method: "Card",
        };
        break;

      case "doku":
        payload = {
          ...basePayload,
          success_url: `${baseUrl}billing?tab=${tabName}&page=1&status=success`,
          // success_url: `http://localhost:5175/billing?tab=${tabName}&page=1&status=success`,
          cancel_url: `${baseUrl}billing?tab=${tabName}&page=1&status=failed`,
          invoice_number: `INV-${Date.now()}-${parsed?.result?.id}`,
          name: `${parsed?.result?.firstName} ${parsed?.result?.lastName}`,
          email: parsed?.result?.email?.trim(),
          phone: parsed?.result?.contactNumber,
        };
        break;

      default:
        toast({
          title: "Unsupported PSP",
          description: `Payment provider "${activePspName}" is not supported.`,
          variant: "destructive",
        });
        return;
    }

    console.log("debug", payload);

    connectPaymentMethod(payload, {
      onSuccess: (response) => {
        const redirectionUrl = response?.url;
        if (redirectionUrl) {
          window.open(redirectionUrl, "_blank", "noopener,noreferrer");
        } else {
          console.error("Redirection link not found in response.");
        }
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      }
    });
  };

  const handleClose = () => {
    setPaymentComplete(false);
    setPaymentMethod("online");
    setPaymentStatus(null);
    onClose();
  };
  const getStatusDisplay = () => {
    switch (status) {
      case "success":
        return {
          icon: "✓",
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          descriptionColor: "text-green-600",
        };
      case "failed":
        return {
          icon: <AlertTriangle className="h-8 w-8" />,
          title: "Payment Failed",
          description:
            "There was an issue processing your payment. Please try again.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          descriptionColor: "text-red-600",
        };
      default:
        return null;
    }
  };

  if (!bill) return null;

  const statusDisplay = getStatusDisplay();
  const displayAmount =
    paymentType === "bill" ? bill.outstandingAmount : bill.amount;
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {paymentComplete
              ? statusDisplay?.title || "Payment Complete"
              : `Pay ${paymentType === "service" ? "Service" : "Bill"}`}
          </DialogTitle>
          <DialogDescription>
            {paymentComplete
              ? statusDisplay?.description || "Payment processing complete."
              : `Complete your ${paymentType} payment securely.`}
          </DialogDescription>
        </DialogHeader>

        {paymentComplete ? (
          <div className="space-y-4">
            {statusDisplay && (
              <div
                className={`text-center p-6 ${statusDisplay.bgColor} rounded-lg border ${statusDisplay.borderColor}`}
              >
                <div
                  className={`${statusDisplay.iconColor} text-4xl mb-2 flex justify-center`}
                >
                  {statusDisplay.icon}
                </div>
                <h3
                  className={`text-lg font-semibold ${statusDisplay.titleColor} mb-1`}
                >
                  {statusDisplay.title}
                </h3>
                <p className={statusDisplay.descriptionColor}>
                  {statusDisplay.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {paymentType === "service" ? "Service Request #:" : "Bill #:"}
                </span>
                <span className="font-medium">{bill.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${displayAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {paymentType === "service" ? "Service Type:" : "Bill Type:"}
                </span>
                <span className="font-medium">{bill.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">Online Payment</span>
              </div>
              {paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">
                    {paymentStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Bill/Service Information */}
            <div className="space-y-3">
              <h4 className="font-semibold">
                {paymentType === "service" ? "Service" : "Bill"} Information
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {paymentType === "service"
                      ? "Request Number"
                      : "Bill Number"}
                  </span>
                  <span className="font-medium">{bill.id}</span>
                </div>
                {paymentType !== "service" && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Service Type
                    </span>
                    <Badge variant="outline">{bill.type}</Badge>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {paymentType === "service" ? "Request Date" : "Issue Date"}
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    {new Date(bill.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {paymentType === "service" ? "Completion Date" : "Due Date"}
                  </span>
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
                    {displayAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <h4 className="font-semibold">Payment Method</h4>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="online" id="online" />
                  <Label
                    htmlFor="online"
                    className="flex items-center gap-2 cursor-pointer"
                  >
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
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Processing..." : `Pay $${displayAmount}`}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
