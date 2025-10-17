import { useCreateDisconnectionRequest } from "@features/serviceRequest/hooks";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { format } from "date-fns";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
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
import { useCallback, useMemo, useState } from "react";

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

interface LocalConsumerDetails {
  id?: number;
  consumerNo?: string;
  remoteUtilityId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  addressMap?: { addressLine?: string };
  territoryData?: {
    service?: {
      region?: string;
      area?: string;
      country?: string;
      county?: string;
      division?: string;
      zone?: string;
      state?: string;
      subArea?: string;
    };
  };
  [key: string]: any;
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
    reasonVersion:string,
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
  stepHelpers,
  currentStepIndex = 2,
  onPrevious,
  setValidationError,
  clearValidationError,
}: ReviewPaymentStepProps) {
  const { remoteUtilityId } = getLoginDataFromStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createDisconnectionRequest } = useCreateDisconnectionRequest();

  // Consolidated function to get consumer details from localStorage
  const getConsumerDetails = useCallback((): LocalConsumerDetails => {
    try {
      const consumerDetailsRaw = localStorage.getItem("consumerDetails");
      if (!consumerDetailsRaw) return {};
      
      const parsed = JSON.parse(consumerDetailsRaw);
      return parsed?.result || {};
    } catch (error) {
      console.error("Failed to parse consumer details:", error);
      return {};
    }
  }, []);

  const consumerDetails = useMemo(() => getConsumerDetails(), [getConsumerDetails]);

  // Helper function to get step data with error handling
  const getStepData = useCallback(
    (stepIndex: number) => {
      if (!stepHelpers) return {};
      
      try {
        return stepHelpers.getStepData(stepIndex) || {};
      } catch (error) {
        console.error(`Failed to get step data for step ${stepIndex}:`, error);
        return {};
      }
    },
    [stepHelpers]
  );

  // Helper function to save step data
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
      } catch (error) {
        toast({
          title: "Failed to save progress",
          description: "Your progress may not be saved. Please try again.",
          variant: "destructive",
        });
      }
    },
    [stepHelpers, currentStepIndex]
  );

  // Helper function to format service address
  const formatServiceAddress = useCallback((territoryData: any) => {
    if (!territoryData?.service) return "";
    
    const { service } = territoryData;
    const addressParts = [
      service.region,
      service.area,
      service.country,
      service.county,
      service.division,
      service.zone,
      service.state,
      service.subArea,
    ].filter(Boolean);
    
    return addressParts.join(", ");
  }, []);

  // Memoized review data
  const reviewData = useMemo((): ReviewData => {
    const requestData = getStepData(0);
    const notificationData = getStepData(1);

    const compiledData: ReviewData = {};

    // Customer data from localStorage
    compiledData.customer = {
      id: consumerDetails.id || 0,
      name: `${consumerDetails.firstName || ""} ${consumerDetails.lastName || ""}`.trim(),
      accountNumber: consumerDetails.consumerNo || "",
      type: "Standard",
      email: consumerDetails.email || "",
      phone: consumerDetails.contactNumber || "",
      address: formatServiceAddress(consumerDetails.territoryData) || consumerDetails.addressMap?.addressLine || "",
    };

    // Request data from step
    if (requestData) {
      compiledData.request = {
        reasonVersion:requestData.reasonVersion,
        requestType: requestData.requestType || "disconnection",
        utilitySupportRequest: requestData.reason || "",
        reason: requestData.reason || "",
        reasonLabel: requestData.reasonLabel || "",
        timeSlotLabel: requestData.timeSlotLabel || "",
        priority: requestData.priority || "medium",
        scheduledDate: requestData.scheduledDate ? new Date(requestData.scheduledDate) : null,
        timeSlot: requestData.timeSlot || "",
        consumerRemark: requestData.consumerRemark || "",
      };
    }

    return compiledData;
  }, [getStepData, consumerDetails, formatServiceAddress]);

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-600";
      default: return "text-blue-600";
    }
  };

  // Helper function to get priority badge styles
  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!consumerDetails.id) {
        toast({
          title: "Error: Missing customer information",
          description: "Customer ID is required for the disconnection request.",
          variant: "destructive",
        });
        return;
      }

      if (!reviewData?.request?.reason) {
        toast({
          title: "Error: Missing reason",
          description: "Disconnection reason is required for the request.",
          variant: "destructive",
        });
        return;
      }

      const serviceAddress = formatServiceAddress(consumerDetails.territoryData) || consumerDetails.addressMap?.addressLine || "";
      const consumerName = `${consumerDetails.firstName || ""} ${consumerDetails.lastName || ""}`.trim();

      // Create payload for submission
      const payload = {
        request_date: new Date().toISOString(),
        consumer_remark: reviewData?.request?.consumerRemark || "",
        request_type: "Disconnect Permanent",
        source: 1,  
        consumer: consumerDetails.id || 0,
        remote_utility_id: remoteUtilityId,
        utility_support_request: reviewData?.request?.reason || "",
        additional_data: {
           utility_support_request_version: reviewData?.request?.reasonVersion,
          preferred_time_slot: reviewData?.request?.timeSlot ? 1 : 0,
        },
      };

      // Save final review data
      saveStepData({
        reviewData,
        reviewed: true,
        submittedAt: new Date().toISOString(),
        isStepComplete: true,
      });

      // Clear any errors
      clearValidationError?.();

      createDisconnectionRequest(payload, {
        onSuccess: () => {
          toast({
            title: "✅ Success",
            description: "Disconnection request submitted successfully",
            variant: "default",
          });
          stepHelpers?.resetAllData();
        },
        onError: (error) => {
          toast({
            title: "❌ Submission Failed",
            description: `Disconnection request failed: ${error.message || 'Unknown error'}`,
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "❌ Submission Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
      setValidationError?.("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    consumerDetails,
    reviewData,
    remoteUtilityId,
    formatServiceAddress,
    saveStepData,
    clearValidationError,
    createDisconnectionRequest,
    stepHelpers,
    setValidationError
  ]);

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
              Disconnection
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
            <div className={`text-2xl font-semibold mb-1 capitalize ${getPriorityColor(reviewData.request?.priority || "medium")}`}>
              {reviewData.request?.priority || "Medium"}
            </div>
            <div className="text-sm text-gray-500">Priority</div>
          </div>
        </div>
      </div>

      {/* Customer and Request Information Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Current Account Holder */}
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-orange-600" />
            <h4 className="font-medium text-gray-900">Current Account Holder</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Name</div>
              <div className="text-gray-700">
                {consumerDetails.firstName} {consumerDetails.lastName || ""}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Account Number</div>
              <div className="text-gray-700">
                {consumerDetails.consumerNo || "Not provided"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Service Address</div>
              <div className="text-gray-700">
                {formatServiceAddress(consumerDetails.territoryData) || consumerDetails.addressMap?.addressLine || "Not provided"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                {consumerDetails.email || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                {consumerDetails.contactNumber || "N/A"}
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
              <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
                {reviewData.request?.requestType || "disconnection"}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Reason</div>
              <div className="text-gray-700">
                {reviewData.request?.reasonLabel || "Not specified"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Priority</div>
              <Badge variant="outline" className={`capitalize ${getPriorityBadgeStyles(reviewData.request?.priority || "medium")}`}>
                {reviewData.request?.priority || "medium"}
              </Badge>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Time Slot</div>
              <div className="text-gray-700">
                {reviewData.request?.timeSlotLabel || "Not set"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {reviewData.request?.consumerRemark && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-slate-600" />
            <h4 className="font-medium text-gray-900">Additional Information</h4>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">Additional Notes</div>
            <div className="text-gray-700 bg-white p-3 rounded border">
              {reviewData.request.consumerRemark}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium text-gray-900">Notifications</h4>
        </div>

        <RadioGroup defaultValue="customer">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="customer" id="notifyCustomer" />
            <Label htmlFor="notifyCustomer" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              Send acknowledgment to customer
            </Label>
          </div>
        </RadioGroup>
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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