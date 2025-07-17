// import { useCreateDisconnectionRequest } from "@features/cx/disconnect/hooks";
import { StepHelpers } from "@shared/components/Stepper";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { format } from "date-fns";
import {
  Bell,
  Calendar,
  CheckCircle,
  ChevronLeft,
  FileText,
  Mail,
  Phone,
  Send,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ReviewPaymentStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  clearValidationError?: () => void;
}

interface ReviewData {
  customer?: {
    name: string;
    accountNumber: string;
    type: string;
    email: string;
    phone: string;
    address: string;
    id: number;
  };
  request?: {
    requestType: string;
    utilitySupportRequest: string;
    priority: string;
    scheduledDate: Date | null;
    reason: string;
    timeSlot: string;
    reasonLabel: string;
    timeSlotLabel: string;
    consumerRemark: string;
  };
}

export function ReviewPaymentStep({
  remoteUtilityId,
  storageKey,
  stepHelpers,
  currentStepIndex = 2,
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
}: ReviewPaymentStepProps) {
  const [reviewData, setReviewData] = useState<ReviewData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dataLoadedRef = useRef(false);
  // const { mutate: createDisconnectionRequest } =
  //   useCreateDisconnectionRequest();

  // Helper function to save step data using stepHelpers
  const saveStepData = useCallback(
    (data: any) => {
      if (!stepHelpers) return;

      try {
        const stepData = {
          ...data,
          timestamp: new Date().toISOString(),
          stepIndex: currentStepIndex,
        };

        stepHelpers.setStepData(currentStepIndex, stepData);
        console.log("Review step data saved:", stepData);
      } catch (error) {
        console.error("Failed to save review step data:", error);
      }
    },
    [stepHelpers, currentStepIndex]
  );

  // Helper function to get step data using stepHelpers
  const getStepData = useCallback(
    (stepIndex: number) => {
      if (!stepHelpers) return null;

      try {
        return stepHelpers.getStepData(stepIndex);
      } catch (error) {
        console.error(`Failed to get step data for step ${stepIndex}:`, error);
        return null;
      }
    },
    [stepHelpers]
  );

  // Helper function to get all steps data
  const getAllStepsData = useCallback(() => {
    const customerData = getStepData(0); // Customer info step
    const requestData = getStepData(1); // Request details step
    const notificationData = getStepData(2); // Current step or notification step if exists

    return { customerData, requestData, notificationData };
  }, [getStepData]);

  // Load data from all previous steps
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current) {
      try {
        const { customerData, requestData, notificationData } =
          getAllStepsData();

        console.log("Loading review data from all steps:", {
          customerData,
          requestData,
          notificationData,
        });

        const compiledReviewData: ReviewData = {};

        // Load customer data
        if (customerData) {
          compiledReviewData.customer = {
            id: customerData.selectedConsumerId,
            name: customerData.customerName || "",
            accountNumber: customerData.accountNumber || "",
            type:
              customerData.consumerMetadata?.categoryDisplay ||
              customerData.selectedCustomer?.customerType ||
              "Standard",
            email: customerData.contactEmail || "",
            phone: customerData.contactPhone || "",
            address: customerData.serviceAddress || "",
          };
        }

        // Load request details data
        if (requestData) {
          compiledReviewData.request = {
            requestType: requestData.requestType || "disconnection",
            utilitySupportRequest: requestData.reason || "",
            reason: requestData.reason || "",
            reasonLabel: requestData.reasonLabel || "",
            timeSlotLabel: requestData.timeSlotLabel || "",
            priority: requestData.priority || "medium",
            scheduledDate: requestData.scheduledDate
              ? new Date(requestData.scheduledDate)
              : null,
            timeSlot: requestData.timeSlot || "",
            consumerRemark: requestData.consumerRemark || "",
          };
        }

        setReviewData(compiledReviewData);
        dataLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load review data:", error);
        dataLoadedRef.current = true;
      }
    }
  }, [stepHelpers, currentStepIndex, getAllStepsData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        requestDate: new Date().toISOString(),
        consumerRemark: reviewData?.request?.consumerRemark || "",
        requestType: "Disconnect Permanent",
        source: 1, // Default source
        reason: reviewData?.request?.reason || "",
        priority: reviewData?.request?.priority || "medium",
        scheduledDate: reviewData?.request?.scheduledDate || "",
        reasonLabel: reviewData?.request?.reasonLabel || "",
        timeSlotLabel: reviewData?.request?.timeSlotLabel || "",
        timeSlot: reviewData?.request?.timeSlot || "",
        consumer: reviewData?.customer?.id || "",
        remoteUtilityId: remoteUtilityId,
        utilitySupportRequest: reviewData?.request?.utilitySupportRequest || 0, // Will be set by backend
        additionalData: {
          preferredTimeSlot: reviewData?.request?.timeSlot ? 1 : 0, // Convert to number
        },
        serviceAddress: reviewData?.customer?.address || "",
        contactPhone: reviewData?.customer?.phone || "",
        contactEmail: reviewData?.customer?.email || "",
        contactName: reviewData?.customer?.name || "",
        account_number: reviewData?.customer?.accountNumber || "",
        consumer_name: reviewData?.customer?.name || "",
        consumer_email: reviewData?.customer?.email || "",
        consumer_phone: reviewData?.customer?.phone || "",
        consumer_address: reviewData?.customer?.address || "",
      };
      // Save final review data
      saveStepData({
        reviewData,
        reviewed: true,
        submittedAt: new Date().toISOString(),
        isStepComplete: true,
      });
      // Clear any errors
      if (clearValidationError) {
        clearValidationError();
      }
      // Create and submit payload
      console.log("Submitting disconnection request payload:", payload);

      // createDisconnectionRequest(payload);
      stepHelpers?.resetAllData();
    } catch (error) {
      console.error("Failed to submit request:", error);
      if (setValidationError) {
        setValidationError("Failed to submit request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Request Summary Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-gray-900">Review Request Details</h3>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600 mb-1 capitalize">
              {"Disconnection"}
            </div>
            <div className="text-sm text-gray-500">Request Type</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600 mb-1">
              {reviewData.request?.scheduledDate
                ? format(reviewData.request.scheduledDate, "MMM dd, yyyy")
                : "Not Set"}
            </div>
            <div className="text-sm text-gray-500">Scheduled Date</div>
          </div>

          <div className="text-center">
            <div
              className={`text-2xl font-semibold mb-1 capitalize ${
                reviewData.request?.priority === "high"
                  ? "text-red-600"
                  : reviewData.request?.priority === "medium"
                  ? "text-orange-600"
                  : "text-blue-600"
              }`}
            >
              {reviewData.request?.priority || "Medium"}
            </div>
            <div className="text-sm text-gray-500">Priority</div>
          </div>
        </div>
      </div>

      {/* Customer and Request Information Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-orange-600" />
            <h4 className="font-medium text-gray-900">Customer Information</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Name</div>
              <div className="text-gray-700">
                {reviewData.customer?.name || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                Account Number
              </div>
              <div className="text-gray-700">
                {reviewData.customer?.accountNumber || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Type</div>
              <Badge variant="outline" className="text-xs">
                {reviewData.customer?.type || "Standard"}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                {reviewData.customer?.email || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                {reviewData.customer?.phone || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Request Details</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Type</div>
              <Badge
                variant="outline"
                className="capitalize bg-blue-50 text-blue-700 border-blue-200"
              >
                {reviewData.request?.requestType || "disconnection"}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                Reason
              </div>
              <div className="text-gray-700">
                {reviewData.request?.reasonLabel || "Not specified"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                Priority
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${
                  reviewData.request?.priority === "high"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : reviewData.request?.priority === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {reviewData.request?.priority || "medium"}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                Time Slot
              </div>
              <div className="text-gray-700">
                {reviewData.request?.timeSlotLabel || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Address */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-slate-600" />
          <h4 className="font-medium text-gray-900">Service Address</h4>
        </div>

        <div className="text-gray-700 mb-4">
          {reviewData.customer?.address || "N/A"}
        </div>

        {reviewData.request?.consumerRemark && (
          <div className="pt-4 border-t border-slate-200">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Additional Notes
            </div>
            <div className="text-gray-700 bg-white p-3 rounded border">
              {reviewData.request.consumerRemark}
            </div>
          </div>
        )}
      </div>
      {/* Notifications */}
      <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium text-gray-900">Notifications</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <RadioGroup defaultValue="customer">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer" id="notifyCustomer" />
              <Label
                htmlFor="notifyCustomer"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-blue-600" />
                Send acknowledgment to customer
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onPrevious}
          variant="outline"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Submit Request</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
