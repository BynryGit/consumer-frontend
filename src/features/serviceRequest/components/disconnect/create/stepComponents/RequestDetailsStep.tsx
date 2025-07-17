// import {
//   useTimeSlotChoices,
//   useUtilityRequestConfiguration,
// } from "@features/cx/disconnect/hooks";

import { DynamicForm } from "@shared/components/DynamicForm";
import { StepHelpers } from "@shared/components/Stepper";
import { FormField, FormService } from "@shared/services/FormServices";
import { Button } from "@shared/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface CreateDisconnectionRequestPayload {
  requestDate: string;
  consumerRemark: string;
  requestType: string;
  reason: string;
  reasonLabel: string;
  timeSlotLabel: string;
  priority: string;
  scheduledDate: string;
  timeSlot: string;
  source: number;
  consumer: string;
  remoteUtilityId: number;
  utilitySupportRequest: number;
  additionalData: {
    preferredTimeSlot: number;
  };
  serviceAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  contactId: number;
  contactType: string;
  account_number: string;
  consumer_name: string;
  consumer_email: string;
  consumer_phone: string;
  consumer_address: string;
}
interface RequestDetailsStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  clearValidationError?: () => void;
  isValidating?: boolean;
}

export function RequestDetailsStep({
  remoteUtilityId,
  storageKey,
  stepHelpers,
  currentStepIndex = 1,
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating,
}: RequestDetailsStepProps) {
  const [isStepDataLoaded, setIsStepDataLoaded] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const dataLoadedRef = useRef(false);
  const savedStepDataRef = useRef<any>(null);

  // Fetch utility request configuration for reasons
  // const { data: utilityConfigData, isLoading: isConfigLoading } =
  //   useUtilityRequestConfiguration({
  //     remoteUtilityId,
  //     requestType: "Disconnect Permanent", // For disconnection requests
  //     disablePagination: true,
  //   });

  // // Fetch time slot choices
  // const { data: timeSlotData, isLoading: isTimeSlotLoading } =
  //   useTimeSlotChoices();

  // Helper function to save step data using stepHelpers
  const saveStepData = useCallback(
    (data: Partial<CreateDisconnectionRequestPayload>) => {
      if (!stepHelpers) return;

      try {
        const stepData = {
          ...data,
          timestamp: new Date().toISOString(),
          stepIndex: currentStepIndex,
        };

        stepHelpers.setStepData(currentStepIndex, stepData);
        console.log("Request details step data saved:", stepData);
      } catch (error) {
        console.error("Failed to save request details step data:", error);
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
      console.error("Failed to get request details step data:", error);
      return null;
    }
  }, [stepHelpers, currentStepIndex]);

  // Helper function to get customer data from previous step
  const getCustomerData = useCallback(() => {
    if (!stepHelpers) return null;

    try {
      const customerStepData = stepHelpers.getStepData(0); // Customer info is step 0
      return customerStepData;
    } catch (error) {
      console.error("Failed to get customer data from previous step:", error);
      return null;
    }
  }, [stepHelpers]);

  // Define form fields using FormService pattern
  const requestFields: FormField[] = [
    {
      name: "reason",
      label: "Reason",
      type: "select",
      required: true,
      placeholder: "Select a reason",
      // options:
      //   utilityConfigData?.result?.map((config) => ({
      //     label: config.name,
      //     value: config.id.toString(),
      //   })) || [],
      helperText: "Select the primary reason for this request",
      showHelperTooltip: true,
      tooltipText: "This helps prioritize and route the request appropriately.",
      classes: {
        container: "mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
      group: "Basic Information",
      // groupColor: "border-l-blue-500",
      groupOrder: 2,
    },
    {
      name: "scheduledDate",
      label: "Preferred Date",
      type: "datepicker",
      placeholder: "Select date",
      helperText: "Choose your preferred date for the service visit",
      showHelperTooltip: true,
      tooltipText: "Field staff will attempt to accommodate your preference.",
      classes: {
        container: "mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
      group: "Schedule",
      // groupColor: "border-l-green-500",
      groupOrder: 1,
    },
    {
      name: "timeSlot",
      label: "Preferred Time Slot",
      type: "select",
      placeholder: "Select time slot",
      // options:
      //   timeSlotData?.result?.map((slot) => ({
      //     label: slot.value,
      //     value: slot.key.toString(),
      //   })) || [],
      helperText: "Select your preferred time window",
      classes: {
        container: "mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
      group: "Schedule",
      // groupColor: "border-l-green-500",
      groupOrder: 2,
    },
    {
      name: "consumerRemark",
      label: "Additional Notes",
      type: "textarea",
      placeholder: "Add special instructions or important information...",
      rows: 4,
      helperText: "Provide any additional information for field staff",
      showHelperTooltip: true,
      tooltipText: "Include access instructions or special considerations.",
      classes: {
        container: "mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        textarea:
          "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
      group: "Additional Information",
      // groupColor: "border-l-purple-500",
      groupOrder: 1,
    },
  ];

  // Create form instance using FormService
  const requestForm = FormService.createForm<CreateDisconnectionRequestPayload>(
    {
      fields: requestFields,
      mode: "onChange",
      validateOnMount: false,
      defaultValues: {
        requestType: "disconnection",
        utilitySupportRequest: 0,
        reason: "",
        priority: "medium",
        scheduledDate: null,
        timeSlot: "",
        consumerRemark: "",
        serviceAddress: "",
        consumer: null,
        contactPhone: "",
        contactEmail: "",
        contactName: "",
        contactId: null,
        contactType: "",
      },
    }
  );

  // Load saved data on component mount
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current) {
      try {
        const savedStepData = getStepData();
        const customerStepData = getCustomerData();

        // Store saved data in ref for use in other effects
        savedStepDataRef.current = savedStepData;

        if (savedStepData) {
          console.log("Loaded request details step data:", savedStepData);

          // Populate form with saved data including labels
          const formDataToSet = {
            ...savedStepData,
            // Ensure we have the basic form fields
            requestType: savedStepData.requestType || "disconnection",
            utilitySupportRequest: savedStepData.utilitySupportRequest || 0,
            reason: savedStepData.reason || "",
            priority: savedStepData.priority || "medium",
            scheduledDate: savedStepData.scheduledDate || null,
            timeSlot: savedStepData.timeSlot || "",
            consumerRemark: savedStepData.consumerRemark || "",
            serviceAddress: savedStepData.serviceAddress || "",
            consumer: savedStepData.consumer || null,
            contactPhone: savedStepData.contactPhone || "",
            contactEmail: savedStepData.contactEmail || "",
            contactName: savedStepData.contactName || "",
            contactId: savedStepData.contactId || null,
            contactType: savedStepData.contactType || "",
            reasonLabel: savedStepData.reasonLabel || "",
            timeSlotLabel: savedStepData.timeSlotLabel || "",
          };

          FormService.populateForm(requestForm, formDataToSet, requestFields);

          // Update the field options with labels if they exist in saved data
          if (savedStepData.reasonLabel && savedStepData.reason) {
            const reasonField = requestFields.find(
              (field) => field.name === "reason"
            );
            if (reasonField) {
              // Add the saved option if it doesn't exist
              const optionExists = reasonField.options?.some(
                (option) => option.value === savedStepData.reason
              );
              if (!optionExists) {
                reasonField.options = [
                  ...(reasonField.options || []),
                  {
                    label: savedStepData.reasonLabel,
                    value: savedStepData.reason,
                  },
                ];
              }
            }
          }

          if (savedStepData.timeSlotLabel && savedStepData.timeSlot) {
            const timeSlotField = requestFields.find(
              (field) => field.name === "timeSlot"
            );
            if (timeSlotField) {
              // Add the saved option if it doesn't exist
              const optionExists = timeSlotField.options?.some(
                (option) => option.value === savedStepData.timeSlot
              );
              if (!optionExists) {
                timeSlotField.options = [
                  ...(timeSlotField.options || []),
                  {
                    label: savedStepData.timeSlotLabel,
                    value: savedStepData.timeSlot,
                  },
                ];
              }
            }
          }
        }

        // Load customer data and service address from previous step
        if (customerStepData) {
          console.log(
            "Loaded customer data for request details:",
            customerStepData
          );
          setCustomerData(customerStepData);

          // Update service address from customer data if not already set
          if (!savedStepData?.serviceAddress) {
            requestForm.setValue(
              "serviceAddress",
              customerStepData.serviceAddress?.address || ""
            );
          }

          // If we have consumer metadata, use it
          if (customerStepData.consumerMetadata && !savedStepData?.consumer) {
            const metadata = customerStepData.consumerMetadata;
            requestForm.setValue("consumer", {
              id: customerStepData.selectedConsumerId,
              consumerNo: customerStepData.accountNumber,
              email: customerStepData.contactEmail,
              firstName: metadata.firstName,
              lastName: metadata.lastName,
              consumerName: customerStepData.customerName,
              category: metadata.category,
              subCategory: metadata.subCategory,
              isVip: metadata.isVip || false,
              serviceAddress: metadata.serviceAddress,
            } as any);
          }
        }

        dataLoadedRef.current = true;
        setIsStepDataLoaded(true);
      } catch (error) {
        console.error("Failed to load request details step data:", error);
        dataLoadedRef.current = true;
        setIsStepDataLoaded(true);
      }
    }
  }, [
    stepHelpers,
    currentStepIndex,
    requestForm,
    getStepData,
    getCustomerData,
    requestFields,
  ]);

  // Update form when configuration data is loaded
  // useEffect(() => {
  //   if (utilityConfigData?.result && isStepDataLoaded) {
  //     // Get saved step data to preserve any saved options
  //     const savedStepData = savedStepDataRef.current;

  //     // Update the reason field options when configuration data is available
  //     const reasonField = requestFields.find(
  //       (field) => field.name === "reason"
  //     );
  //     if (reasonField) {
  //       const apiOptions = utilityConfigData.result.map((config) => ({
  //         label: config.name,
  //         value: config.id.toString(),
  //       }));

  //       // If we have saved data with a reason label, preserve it
  //       if (savedStepData?.reasonLabel && savedStepData?.reason) {
  //         const savedOption = {
  //           label: savedStepData.reasonLabel,
  //           value: savedStepData.reason,
  //         };
  //         const optionExists = apiOptions.some(
  //           (option) => option.value === savedStepData.reason
  //         );

  //         if (!optionExists) {
  //           reasonField.options = [...apiOptions, savedOption];
  //         } else {
  //           reasonField.options = apiOptions;
  //         }
  //       } else {
  //         reasonField.options = apiOptions;
  //       }
  //     }
  //   }
  // }, [utilityConfigData, isStepDataLoaded, requestFields]);

  // Update form when time slot data is loaded
  // useEffect(() => {
  //   if (timeSlotData?.result && isStepDataLoaded) {
  //     // Get saved step data to preserve any saved options
  //     const savedStepData = savedStepDataRef.current;

  //     // Update the time slot field options when time slot data is available
  //     const timeSlotField = requestFields.find(
  //       (field) => field.name === "timeSlot"
  //     );
  //     if (timeSlotField) {
  //       const apiOptions = timeSlotData.result.map((slot) => ({
  //         label: slot.value,
  //         value: slot.key.toString(),
  //       }));

  //       // If we have saved data with a time slot label, preserve it
  //       if (savedStepData?.timeSlotLabel && savedStepData?.timeSlot) {
  //         const savedOption = {
  //           label: savedStepData.timeSlotLabel,
  //           value: savedStepData.timeSlot,
  //         };
  //         const optionExists = apiOptions.some(
  //           (option) => option.value === savedStepData.timeSlot
  //         );

  //         if (!optionExists) {
  //           timeSlotField.options = [...apiOptions, savedOption];
  //         } else {
  //           timeSlotField.options = apiOptions;
  //         }
  //       } else {
  //         timeSlotField.options = apiOptions;
  //       }
  //     }
  //   }
  // }, [timeSlotData, isStepDataLoaded, requestFields]);

  // // Re-populate form with saved values after options are loaded
  // useEffect(() => {
  //   if (isStepDataLoaded && !isConfigLoading && !isTimeSlotLoading) {
  //     const savedStepData = savedStepDataRef.current;
  //     if (savedStepData) {
  //       // Re-populate the form with saved values to ensure dropdowns show correct selections
  //       const formDataToSet = {
  //         reason: savedStepData.reason || "",
  //         timeSlot: savedStepData.timeSlot || "",
  //         scheduledDate: savedStepData.scheduledDate || null,
  //         consumerRemark: savedStepData.consumerRemark || "",
  //         // Add other fields as needed
  //       };

  //       // Only set values that exist in saved data
  //       Object.entries(formDataToSet).forEach(([key, value]) => {
  //         if (value !== null && value !== undefined && value !== "") {
  //           requestForm.setValue(key as any, value);
  //         }
  //       });
  //     }
  //   }
  // }, [isStepDataLoaded, isConfigLoading, isTimeSlotLoading, requestForm]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    (data: CreateDisconnectionRequestPayload) => {
      // Validate required fields
      if (!data.reason) {
        if (setValidationError) {
          setValidationError("Please select a reason for the request.");
        }
        return;
      }

      console.log("data", data);

      // Get the current form data to access labels
      const currentFormData = requestForm.getValues();

      // Get labels from the current form state
      const reasonField = requestFields.find(
        (field) => field.name === "reason"
      );

      const timeSlotField = requestFields.find(
        (field) => field.name === "timeSlot"
      );

      const selectedReasonOption = reasonField?.options?.find(
        (option) => option.value === data.reason
      );

      const selectedTimeSlotOption = timeSlotField?.options?.find(
        (option) => option.value === data.timeSlot
      );

      // const selectedReasonObject = utilityConfigData?.result?.find(
      //   (reason) => reason.id?.toString() === data.reason
      // );

      // console.log("selectedReasonObject", selectedReasonObject);

      // Save final step data with completion status
      saveStepData({
        ...data,
        requestDate: new Date().toISOString(),
        consumerRemark: data.consumerRemark,
        requestType: "disconnection",
        scheduledDate: data.scheduledDate,
        timeSlot: data.timeSlot,
        reasonLabel: selectedReasonOption?.label || "",
        timeSlotLabel: selectedTimeSlotOption?.label || "",
        // priority: selectedReasonObject?.extraData?.priorityLevelDisplay || "",
        source: 1,
        remoteUtilityId: remoteUtilityId,
        utilitySupportRequest: Number(data.reason),
        additionalData: {
          preferredTimeSlot: Number(data.timeSlot),
        },
        serviceAddress: data.serviceAddress,
      });

      // Clear any errors and proceed
      if (clearValidationError) {
        clearValidationError();
      }
      if (onNext) {
        onNext();
      }
    },
    [
      saveStepData,
      setValidationError,
      clearValidationError,
      onNext,
      requestForm,
      requestFields,
      remoteUtilityId,
    ]
  );

  // Handle field changes to save data automatically
  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      // Get current form data and update the specific field
      const currentFormData = requestForm.getValues();

      // For dropdown fields, save both value and label
      let updatedData: any = {
        ...currentFormData,
        [fieldName]: value,
        lastUpdated: new Date().toISOString(),
      };

      // Save label for dropdown fields
      if (fieldName === "reason") {
        const reasonField = requestFields.find(
          (field) => field.name === "reason"
        );
        const selectedOption = reasonField?.options?.find(
          (option) => option.value === value
        );
        updatedData = {
          ...updatedData,
          reasonLabel: selectedOption?.label || "",
        };
      }

      if (fieldName === "timeSlot") {
        const timeSlotField = requestFields.find(
          (field) => field.name === "timeSlot"
        );
        const selectedOption = timeSlotField?.options?.find(
          (option) => option.value === value
        );
        updatedData = {
          ...updatedData,
          timeSlotLabel: selectedOption?.label || "",
        };
      }

      // Save updated data using stepHelpers
      saveStepData(updatedData);
    },
    [requestForm, saveStepData, requestFields]
  );

  // Custom render for the form groups with styled sections
  const renderCustomFooter = useCallback(
    () => (
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          onClick={onPrevious}
          variant="outline"
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </Button>

        <Button
          onClick={() => handleFormSubmit(requestForm.getValues())}
          disabled={isValidating}
          className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 transition-colors"
        >
          <span>Next: Review</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    ),
    [onPrevious, handleFormSubmit, requestForm, isValidating]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          {requestForm.watch("requestType") === "disconnection"
            ? "Disconnection"
            : "Reconnection"}{" "}
          Details
        </h3>
      </div>

      {/* Customer Info Summary */}
      {customerData && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-800">Customer Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-1 text-gray-900">
                {customerData.customerName}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Account:</span>
              <span className="ml-1 text-gray-900">
                {customerData.accountNumber}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="ml-1 text-gray-900">
                {customerData.contactPhone}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Form */}
      <DynamicForm
        fields={requestFields}
        form={requestForm}
        onSubmit={handleFormSubmit}
        onFieldChange={handleFieldChange}
        config={{
          showSubmitButton: false,
          showResetButton: false,
          showProgress: false,
        }}
        gridColumns={1}
        responsiveColumns={{ sm: 1, md: 2 }}
        renderCustomFooter={renderCustomFooter}
      />
    </div>
  );
}
