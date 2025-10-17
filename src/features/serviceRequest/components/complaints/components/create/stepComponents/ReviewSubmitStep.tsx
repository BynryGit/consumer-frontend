import { useCreateComplaint } from "@features/serviceRequest/hooks";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  File,
  FileText,
  Image,
  Info,
  Mail,
  User,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";

interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  needsReupload?: boolean;
}

interface ReviewSubmitStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  clearValidationError?: () => void;
  isValidating?: boolean;
  fileObjects?: File[];
  fileMetadata?: FileMetadata[];
  evidenceFormData?: any;
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

export function ReviewSubmitStep({
  remoteUtilityId,
  stepHelpers,
  onPrevious,
  isValidating,
  fileObjects = [],
  fileMetadata = [],
  evidenceFormData = {},
}: ReviewSubmitStepProps) {
  const createComplaintMutation = useCreateComplaint();

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

  // Memoized form data
  const formData = useMemo(() => {
    const complaintData = getStepData(0);
    const evidenceData = getStepData(1);
    
    const mergedEvidenceData = {
      ...evidenceData,
      ...evidenceFormData,
      attachments: fileMetadata,
    };

    return {
      complaint: {
        id: complaintData.selectedComplaint?.id || "",
        category: complaintData.selectedComplaint?.supportRequestTypeDisplay || "",
        subCategory: complaintData.selectedComplaint?.supportRequestSubtypeDisplay || "",
        severityLevel: complaintData.selectedComplaint?.severityLevel || "",
        description: complaintData.selectedComplaint?.description || "",
      },
      evidence: {
        notes: evidenceData.notes || "",
        attachments: mergedEvidenceData.attachments || [],
        incidentDate: evidenceData.incidentDate || "",
        expectedResolution: evidenceData.expectedResolution || "",
      },
      version: complaintData.version,
    };
  }, [getStepData, evidenceFormData, fileMetadata]);

  // Helper functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return <FileText className="h-4 w-4 text-blue-600" />;
    } else if (type.startsWith("image/")) {
      return <Image className="h-4 w-4 text-green-600" />;
    }
    return <File className="h-4 w-4 text-gray-600" />;
  };

  const formatServiceAddress = (territoryData: any) => {
    if (!territoryData?.service) return "Not provided";
    
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
    
    return addressParts.join(", ") || "Not provided";
  };

  const handleFormSubmit = useCallback((data: typeof formData) => {
    // Check for files that need re-upload
    const filesNeedingReupload = fileMetadata.filter((f) => f.needsReupload);
    if (filesNeedingReupload.length > 0) {
      toast({
        title: "Warning: Files need re-upload",
        description: `${filesNeedingReupload.length} file(s) need to be re-uploaded before submission.`,
        variant: "destructive",
      });
      return;
    }

    const { remoteUtilityId: loginRemoteUtilityId } = getLoginDataFromStorage();

    // Create FormData object for submission
    const formDataObj = new FormData();
    
    // Customer information
    const customerName = consumerDetails.firstName
      ? `${consumerDetails.firstName} ${consumerDetails.lastName || ""}`.trim()
      : "";
    
    formDataObj.append("utilitySupportName", customerName);
    formDataObj.append("source", "1");
    formDataObj.append("request_type", "Complaint");
    formDataObj.append("remote_utility_id", loginRemoteUtilityId || remoteUtilityId.toString());
    formDataObj.append("utility_support_request", data.complaint.id);
    formDataObj.append("severityLevel", data.complaint.severityLevel);
    formDataObj.append("request_date", data.evidence.incidentDate);
    formDataObj.append("consumer_phone", consumerDetails.contactNumber || "");
    formDataObj.append("consumer_email", consumerDetails.email || "");
    formDataObj.append("consumer", consumerDetails.id?.toString() || "");
    formDataObj.append("account_number", consumerDetails.consumerNo || "");
    formDataObj.append("consumer_address", consumerDetails.addressMap?.addressLine || "");

    // Additional data as JSON
    const additionalData = {
      description: data.complaint.description,
      expected_resolution: data.evidence.expectedResolution,
      additional_notes: data.evidence.notes,
      utility_support_request_version: data.version,
    };
    formDataObj.append("additional_data", JSON.stringify(additionalData));

    // Add files
    fileObjects.forEach((file) => {
      formDataObj.append("file", file);
    });

    createComplaintMutation.mutate(
      { data: formDataObj },
      {
        onSuccess: async () => {
          stepHelpers?.resetAllData();
          localStorage.removeItem("stepper-progress");
        },
      }
    );
  }, [fileMetadata, consumerDetails, remoteUtilityId, fileObjects, createComplaintMutation, stepHelpers]);

  const hasFilesNeedingReupload = fileMetadata.some((f) => f.needsReupload);

  return (
    <div className="space-y-6">
      {/* Complaint Summary Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Complaint Summary</h3>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600 mb-1">
              {formData.complaint.category || "Not Selected"}
            </div>
            <div className="text-sm text-gray-500">Complaint Type</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600 mb-1">
              {formData.evidence.incidentDate || "Not Set"}
            </div>
            <div className="text-sm text-gray-500">Incident Date</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-600 mb-1">
              {fileMetadata.length}
            </div>
            <div className="text-sm text-gray-500">Documents Uploaded</div>
          </div>
        </div>
      </div>

      {/* Customer and Complaint Information Row */}
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
                {formatServiceAddress(consumerDetails.territoryData)}
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Information */}
        <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Complaint Information</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Category</div>
              <div className="text-gray-700">
                {formData.complaint.category || "Not specified"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Subcategory</div>
              <div className="text-gray-700">
                {formData.complaint.subCategory || "Not specified"}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">Severity Level</div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    formData.complaint.severityLevel === "Critical" && "bg-red-500",
                    formData.complaint.severityLevel === "High" && "bg-orange-500",
                    formData.complaint.severityLevel === "Medium" && "bg-yellow-500",
                    formData.complaint.severityLevel === "Low" && "bg-green-500",
                    !formData.complaint.severityLevel && "bg-gray-400"
                  )}
                />
                <span className="text-gray-700">
                  {formData.complaint.severityLevel || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Configuration */}
      <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-600" />
          <h4 className="font-medium text-gray-900">Evidence Configuration</h4>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Incident Date</div>
              <div className="text-gray-700">
                {formData.evidence.incidentDate || "Not provided"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <FileText className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Expected Resolution</div>
              <div className="text-gray-700 truncate">
                {formData.evidence.expectedResolution || "Not provided"}
              </div>
            </div>
          </div>
        </div>

        {formData.evidence.notes && (
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Additional Notes</div>
            <div className="text-gray-700 bg-white p-3 rounded border">
              {formData.evidence.notes}
            </div>
          </div>
        )}
      </div>

      {/* Documentation & Verification */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-slate-600" />
          <h4 className="font-medium text-gray-900">Documentation & Verification</h4>
        </div>

        {fileMetadata.length > 0 ? (
          <div className="space-y-3">
            {fileMetadata.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  file.needsReupload
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    {file.needsReupload && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        Needs re-upload
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex-shrink-0">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      file.needsReupload ? "bg-orange-500" : "bg-green-500"
                    }`}
                  />
                </div>
              </div>
            ))}

            {/* File Upload Summary */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">File Upload Summary</span>
              </div>
              <div className="mt-1 text-sm text-blue-700">
                Ready for submission: {fileObjects.length} file{fileObjects.length !== 1 ? "s" : ""}
                {hasFilesNeedingReupload && (
                  <span className="ml-2 text-orange-700">
                    • Need re-upload: {fileMetadata.filter((f) => f.needsReupload).length}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center bg-orange-50">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-3" />
            <div className="text-lg font-medium text-gray-900 mb-1">No Documents Uploaded</div>
            <div className="text-gray-600 mb-3">
              Documents will be required before the complaint can be processed.
            </div>
            <div className="flex items-center justify-center gap-1 text-orange-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">This may delay the complaint process</span>
            </div>
          </div>
        )}
      </div>

      {/* Complaint Impact Overview */}
      <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h4 className="font-medium text-gray-900">Complaint Impact Overview</h4>
        </div>

        <div className="flex items-center justify-between p-4 bg-red-100 border border-red-200 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">Severity Level Alert</span>
          </div>
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {formData.complaint.severityLevel || "Not Set"}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Complaint Processing Details
          </div>
          <div className="text-sm text-blue-800">
            The complaint will be processed according to the{" "}
            {formData.complaint.severityLevel || "standard"} priority level starting from the
            incident date of {formData.evidence.incidentDate || "the submission date"}.
          </div>
        </div>
      </div>

      {/* Notification Options */}
      <div className="flex items-center space-x-3">
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
          variant="outline"
          onClick={onPrevious}
          disabled={isValidating}
          className="flex items-center gap-2"
        >
          <span>←</span>
          Previous
        </Button>

        <Button
          onClick={() => handleFormSubmit(formData)}
          disabled={isValidating || hasFilesNeedingReupload}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Validating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </div>
  );
}