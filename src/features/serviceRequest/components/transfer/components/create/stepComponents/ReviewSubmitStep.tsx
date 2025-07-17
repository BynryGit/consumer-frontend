
// import { useCreateTransferRequest } from "@features/cx/transfer/hooks";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
interface ReviewSubmitStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  fileObjects: File[];
  fileMetadata: FileMetadata[];
  documentsFormData: any;
}
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  needsReupload?: boolean;
}
export function ReviewSubmitStep({
  remoteUtilityId,
  storageKey,
  stepHelpers,
  currentStepIndex = 0,
  onNext,
  onPrevious,
  setValidationError,
  fileObjects,
  fileMetadata,
  documentsFormData,
}: ReviewSubmitStepProps) {
  console.log("fileObjects", fileObjects);
  const [formData, setFormData] = useState<any>({});
  const dataLoadedRef = useRef(false);
  // const createTransferRequestMutation = useCreateTransferRequest();
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
        console.log("Step data saved via stepHelpers:", stepData);
      } catch (error) {
        console.error("Failed to save step data via stepHelpers:", error);
        toast({
          title: "Failed to save progress",
          description: "Your progress may not be saved. Please try again.",
          variant: "destructive",
        });
      }
    },
    [stepHelpers, currentStepIndex]
  );

  // Helper function to get step data using stepHelpers
  const getStepData = useCallback(() => {
    if (!stepHelpers) return null;

    try {
      return stepHelpers.getStepData(currentStepIndex);
    } catch (error) {
      console.error("Failed to get step data via stepHelpers:", error);
      return null;
    }
  }, [stepHelpers, currentStepIndex]);

  // Helper function to get all step data
  const getAllStepData = useCallback(() => {
    if (!stepHelpers) return {};

    try {
      // Assuming we have multiple steps, gather data from all previous steps
      const allStepsData = {
        customer: stepHelpers.getStepData(0) || {},
        transferDetails: stepHelpers.getStepData(1) || {},
        documentation: stepHelpers.getStepData(2) || {},
        review: stepHelpers.getStepData(3) || {},
      };

      return allStepsData;
    } catch (error) {
      console.error("Failed to get all step data via stepHelpers:", error);
      return {};
    }
  }, [stepHelpers]);

  console.log("stepHelpers:", getAllStepData());

  // Load saved data from stepHelpers on component mount
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current) {
      try {
        // Get all step data for review
        const allStepsData = getAllStepData();
        const savedStepData = getStepData();

        console.log("Loaded all step data from stepHelpers:", allStepsData);

        // Combine all data for review
        const combinedData = {
          ...allStepsData,
          reviewData: savedStepData || {},
        };

        setFormData(combinedData);

        // Save the review step initialization
        saveStepData({
          allStepsReviewed: true,
          reviewInitializedAt: new Date().toISOString(),
          isStepComplete: false,
        });

        dataLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load step data from stepHelpers:", error);
        dataLoadedRef.current = true;
      }
    }
  }, [
    stepHelpers,
    currentStepIndex,
    getStepData,
    getAllStepData,
    saveStepData,
  ]);

  // Extract data from the form data
  const customer = formData.customer || {};
  const transferDetails = formData.transferDetails || {};
  const newCustomer = transferDetails?.newCustomer || {};
  const documents = formData.documentation?.documents || [];

  console.log("documents", documents);

  // Debug log for the entire transferDetails object
  console.log("transferDetails:", transferDetails);

  const handleFormSubmit = (data) => {
    // Check if there are files that need re-upload
    const filesNeedingReupload = fileMetadata.filter((f) => f.needsReupload);
    if (filesNeedingReupload.length > 0) {
      toast({
        title: "Warning: Files need re-upload",
        description: `${filesNeedingReupload.length} file(s) need to be re-uploaded before submission.`,
        variant: "destructive",
      });
      return;
    }

    console.log("Form data being processed:", data);

    // Create FormData object for file upload
    const formData = new FormData();

    // Extract data with proper fallbacks and validation
    const allStepData = getAllStepData();
    const selectedCustomer =
      data.customer?.consumerMetadata || {};
    const transferDetails = data.transferDetails || {};
    const newCustomer = transferDetails.newCustomer || {};
    const documents = data.documentation?.documents || [];

    // Debug logs with better structure
    console.log("=== DATA EXTRACTION DEBUG ===");
    console.log("All step data:", allStepData);
    console.log("Selected customer:", selectedCustomer);
    console.log("Transfer details:", transferDetails);
    console.log("New customer:", newCustomer);
    console.log("Documents:", documents);
    console.log("=== END DATA EXTRACTION DEBUG ===");

    // Validate required fields before proceeding
    if (!selectedCustomer.id) {
      toast({
        title: "Error: Missing customer information",
        description: "Customer ID is required for the transfer request.",
        variant: "destructive",
      });
      return;
    }

    if (!transferDetails.transferType) {
      toast({
        title: "Error: Missing transfer type",
        description: "Transfer type is required for the request.",
        variant: "destructive",
      });
      return;
    }

    if (!transferDetails.effectiveDate) {
      toast({
        title: "Error: Missing effective date",
        description: "Effective date is required for the transfer.",
        variant: "destructive",
      });
      return;
    }

    console.log("cosnumer-->", selectedCustomer)

    // Add form fields with proper validation and fallbacks
    formData.append("source", "0");
    formData.append("request_type", "Transfer");
    formData.append("consumer", selectedCustomer.id?.toString() || "");
    formData.append("remote_utility_id", remoteUtilityId?.toString() || "");
    formData.append("account_number", selectedCustomer?.accountNumber || "");
    formData.append("consumer_name", selectedCustomer?.name || "");
    formData.append("phone", selectedCustomer?.phone || "");
    formData.append("email", selectedCustomer?.email),
    formData.append("address", selectedCustomer?.address || "N/A")
    formData.append(
      "utility_support_request",
      transferDetails.transferType || ""
    );
    formData.append("request_date", transferDetails.effectiveDate || "");

    // Get files from multiple possible sources
    const allStepDataFiles = getAllStepData();
    const documentationStepData = stepHelpers?.getStepData?.(2) || {};

    let filesFromStepData = [];

    // Try different possible file locations
    if (
      documentationStepData.files &&
      Array.isArray(documentationStepData.files)
    ) {
      filesFromStepData = documentationStepData.files;
    } else if (
      documentationStepData.fileObjects &&
      Array.isArray(documentationStepData.fileObjects)
    ) {
      filesFromStepData = documentationStepData.fileObjects;
    } else if (
      fileObjects &&
      Array.isArray(fileObjects) &&
      fileObjects.length > 0
    ) {
      filesFromStepData = fileObjects;
    }

    console.log("=== FILE DEBUG INFO ===");
    console.log("Documentation step data:", documentationStepData);
    console.log("Files from step data:", filesFromStepData);
    console.log("fileObjects prop:", fileObjects);
    console.log("Files array length:", filesFromStepData.length);
    console.log("=== END FILE DEBUG ===");

    // Validate files exist
    if (!filesFromStepData || filesFromStepData.length === 0) {
      toast({
        title: "Error: No files found",
        description:
          "No files were found to upload. Please go back and upload the required documents.",
        variant: "destructive",
      });
      return;
    }

    // Build billing_address_data in the required order and types
    const codes = transferDetails.premiseHierarchyCodes || {};
    const unitNumber = transferDetails.unit;
    const billingAddress = transferDetails.streetAddress;
    const zipCode = transferDetails.zipCode;
    const billing_address_data = [
      ...(unitNumber ? [{ territory_type: "UNIT", territory_code: unitNumber }] : []),
      ...(billingAddress ? [{ territory_type: "ADDRESS", territory_code: billingAddress }] : []),
      ...(zipCode ? [{ territory_type: "ZIPCODE", territory_code: zipCode }] : []),
      ...(codes.premise ? [{ territory_type: "PREMISE", territory_code: codes.premise }] : []),
      ...(codes.subArea ? [{ territory_type: "SUBAREA", territory_code: codes.subArea }] : []),
      ...(codes.area ? [{ territory_type: "AREA", territory_code: codes.area }] : []),
      ...(codes.division ? [{ territory_type: "DIVISION", territory_code: codes.division }] : []),
      ...(codes.zone ? [{ territory_type: "ZONE", territory_code: codes.zone }] : []),
      ...(codes.county ? [{ territory_type: "CITY", territory_code: codes.county }] : []),
      ...(codes.state ? [{ territory_type: "STATE", territory_code: codes.state }] : []),
      ...(codes.country ? [{ territory_type: "COUNTRY", territory_code: codes.country }] : []),
      ...(codes.region ? [{ territory_type: "REGION", territory_code: codes.region }] : []),
    ];

    // Create the additional_data structure with proper data extraction
    const additionalData = {
      old_consumer_data: {
        first_name:
          selectedCustomer.name?.split(" ")[0] ||
          selectedCustomer.customerName?.split(" ")[0] ||
          selectedCustomer.first_name ||
          selectedCustomer.firstName ||
          "",
        last_name:
          selectedCustomer.name?.split(" ").slice(1).join(" ") ||
          selectedCustomer.customerName?.split(" ").slice(1).join(" ") ||
          selectedCustomer.last_name ||
          selectedCustomer.lastName ||
          "",
        email:
          selectedCustomer.contactEmail ||
          selectedCustomer.email ||
          selectedCustomer.contact_email ||
          null,
        contact_number:
          selectedCustomer.contactPhone ||
          selectedCustomer.phone ||
          null,
      },
      new_consumer_data: {
        first_name: newCustomer.firstName || "",
        last_name: newCustomer.lastName || "",
        email: newCustomer.email || null,
        contact_number:
          newCustomer.phoneNumber || newCustomer.contactNumber || null,
        document: documents.map((doc, index) => ({
          document_type: doc.categoryCode,
          document_subtype:
            doc.subCategoryCode ,
          file_key: `file${index + 1}`,
          status: 0,
        })),
        billing_address_data: billing_address_data,
      },
      relationship: newCustomer.relationshipId || 1,
      change_billing_address: transferDetails.changeBillingAddress === "yes",
      transfer_outstanding_balance:
        transferDetails.financialResponsibility === "transfer",
      special_instructions: transferDetails.specialInstructions || "",
      utility_support_request_version: transferDetails.version,
    };

    console.log("=== ADDITIONAL DATA DEBUG ===");
    console.log(
      "Final additional_data:",
      JSON.stringify(additionalData, null, 2)
    );
    console.log("=== END ADDITIONAL DATA DEBUG ===");

    // Add the additional_data JSON to FormData
    formData.append("additional_data", JSON.stringify(additionalData));

    // Add files with validation
    filesFromStepData.forEach((file, index) => {
      const fileKey = `file${index + 1}`;

      if (file instanceof File) {
        formData.append(fileKey, file);
        console.log(`✅ Added file with key: ${fileKey}`, {
          name: file.name,
          size: file.size,
          type: file.type,
        });
      } else {
        console.error(`❌ Invalid file object at index ${index}:`, file);
        toast({
          title: "Error: Invalid file",
          description: `File at position ${index + 1} is not valid.`,
          variant: "destructive",
        });
        return;
      }
    });

    // Final validation - check all required FormData fields
    const requiredFields = [
      "source",
      "request_type",
      "consumer",
      "remote_utility_id",
      "utility_support_request",
      "request_date",
    ];
    const missingFields = [];

    for (const field of requiredFields) {
      const value = formData.get(field);
      if (!value || value === "") {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      toast({
        title: "Error: Missing required fields",
        description: `The following fields are missing: ${missingFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    console.log("=== FINAL FORMDATA DEBUG ===");
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log("=== END FORMDATA DEBUG ===");

    // Submit the form
    // createTransferRequestMutation.mutate({ data: formData });

    // Reset step data after successful submission
    stepHelpers?.resetAllData();
  };

  return (
    <div className="space-y-6">
      {/* Header with Overall Status */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            Transfer Request Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {transferDetails.transferTypeLabel}
              </div>
              <p className="text-sm text-muted-foreground">Transfer Type</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {transferDetails.effectiveDate
                  ? new Date(transferDetails.effectiveDate).toLocaleDateString()
                  : "Not Set"}
              </div>
              <p className="text-sm text-muted-foreground">Effective Date</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {documents.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Documents Uploaded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Account Holder */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-orange-500" />
              Current Account Holder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Name</span>
                <span >
                  {customer.customerName || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Account Number
                </span>
                <Badge variant="outline">
                  {customer.accountNumber || "Not specified"}
                </Badge>
              </div>
              <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Service Address
                </span>
                <span className="text-right max-w-xs">
                  {customer.serviceAddress || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-red-600">
                  Outstanding Balance
                </span>
                <span className="font-bold text-red-600">
                  ${customer.outstandingBalance?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Account Holder */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-green-500" />
              New Account Holder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Name</span>
                <span >
                  {newCustomer.firstName} {newCustomer.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Email</span>
                <span >
                  {newCustomer.email || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Phone</span>
                <span >
                  {newCustomer.phoneNumber || "Not specified"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Relationship
                </span>
                <Badge style={{ textTransform: "capitalize" }}>
                  {newCustomer.relationshipLabel || "Not specified"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Configuration */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-purple-500" />
            Transfer Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-blue-50">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Billing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {transferDetails.changeBillingAddress === "yes"
                      ? transferDetails.billingAddress ||
                        "New address"
                      : "Using existing service address"}
                  </p>
                </div>
              </div>
              {/* Only show Address Details if new billing address is set */}
              {transferDetails.changeBillingAddress === "yes" && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2 text-gray-800">Address Details</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">House/Unit Number</span>
                      <span>{transferDetails.unit || "Not specified"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Street Address</span>
                      <span>{transferDetails.streetAddress || "Not specified"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Zip/Postal Code</span>
                      <span>{transferDetails.zipCode || "Not specified"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Billing Address</span>
                      <span className="text-right w-full" style={{maxWidth: '70%'}}>{(() => {
                        const codes = transferDetails.premiseHierarchyNames || {};
                        const codeList = [
                          codes.premise,
                          codes.subArea,
                          codes.area,
                          codes.division,
                          codes.zone,
                          codes.county,
                          codes.state,
                          codes.country,
                          codes.region,
                        ].filter(Boolean);
                        return codeList.length > 0 ? codeList.join(", ") : "Not specified";
                      })()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-orange-50">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-medium">Financial Responsibility</h4>
                  <p className="text-sm text-muted-foreground">
                    {transferDetails.financialResponsibility === "transfer"
                      ? "Transfer outstanding balance to new account holder"
                      : transferDetails.financialResponsibility === "clear"
                      ? "Current account holder must clear balance before transfer"
                      : "Setup payment plan for new account holder"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {transferDetails.specialInstructions && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">
                Special Instructions
              </h4>
              <p className="text-sm text-yellow-700">
                {transferDetails.specialInstructions}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Section */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-indigo-500" />
            Documentation & Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {documents.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc: any, index: number) => (
                  <div
                    key={doc.id || index}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.name}
                        </p>
                        {doc.subCategory && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {doc.subCategory}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Uploaded
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">
                        Terms and Conditions
                      </h4>
                      <p className="text-sm text-green-700">
                        {formData.documentation?.acceptTerms
                          ? "Accepted"
                          : "Not Accepted"}
                      </p>
                    </div>
                  </div>
                  {formData.documentation?.signature && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-800">
                        Digital Signature
                      </p>
                      <p className="text-sm text-green-600">
                        {formData.documentation.signature}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Documents Uploaded
              </h3>
              <p className="text-muted-foreground">
                Documents will be required before the transfer can be processed.
              </p>
              <p className="text-sm text-amber-600 mt-2 font-medium">
                ⚠️ This may delay the transfer process
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Impact Overview */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-red-500" />
            Financial Impact Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customer.balance > 0 ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">
                      Outstanding Balance Alert
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    ${customer.balance?.toFixed(2) || "0.00"}
                  </Badge>
                </div>
                <p className="text-sm text-red-700">
                  {transferDetails.financialResponsibility === "transfer"
                    ? "⚠️ This balance will be transferred to the new account holder."
                    : "⚠️ This balance must be cleared before the transfer can be completed."}
                </p>
              </div>

              {transferDetails.financialResponsibility === "transfer" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Balance Transfer Details
                  </h4>
                  <p className="text-sm text-blue-700">
                    The new account holder will assume responsibility for the
                    outstanding balance of ${customer.balance?.toFixed(2)}
                    starting from the effective date of{" "}
                    {transferDetails.effectiveDate
                      ? new Date(
                          transferDetails.effectiveDate
                        ).toLocaleDateString()
                      : "the transfer"}
                    .
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  No Outstanding Balance
                </span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Account has no outstanding balance to address during the
                transfer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={() => handleFormSubmit(formData)}>
          Submit Request
        </Button>
      </div>
    </div>
  );
}
