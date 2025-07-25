import { DynamicForm } from "@shared/components/DynamicForm";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { FormField, FormService } from "@shared/services/FormServices";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import React, { useEffect, useMemo, useRef } from "react";

import { useGlobalUserProfile } from "@shared/hooks/useGlobalUser";
import { useTimeSlotChoices } from "@features/serviceRequest/hooks";

interface ServiceDetailsStepProps {
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

export const ServiceDetailsStep: React.FC<ServiceDetailsStepProps> = ({
  remoteUtilityId,
  storageKey,
  stepHelpers,
  currentStepIndex = 2, // Default to step 2 for service details
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating,
}) => {
  const { data: timeSlotChoicesData, isLoading: isLoadingTimeSlots } =
    useTimeSlotChoices();
  const dataLoadedRef = useRef(false);

  const preferredTimeSlotOptions =
    timeSlotChoicesData?.result?.map((choice) => ({
      value: choice.key.toString(),
      label: choice.value,
    })) || [];

  const serviceDetailsFields: FormField[] = useMemo(
    () => [
      {
        name: "scheduledDate",
        label: "Preferred Date (Optional)",
        type: "datepicker",
        helperText: "Leave blank for earliest available date",
        showHelperTooltip: true,
        classes: {
          container: "w-full mb-6",
          label: "block text-sm font-medium text-gray-700 mb-2",
          input:
            "w-full h-12 px-4 border border-gray-300 rounded-lg text-gray-500",
          error: "text-red-600 text-sm mt-1",
          helperText: "text-xs text-gray-500 mt-1",
        },
        tooltipText:
          "Select your preferred date for the service. If left blank, we will schedule for the earliest available date.",
      },
      {
        name: "preferredTimeSlot",
        label: "Preferred Time Slot (Optional)",
        type: "select",
        options: preferredTimeSlotOptions,
        placeholder: "Select preferred time",
        helperText:
          "We will try to accommodate your preference based on availability",
        showHelperTooltip: true,
        tooltipText:
          "Choose your preferred time slot for the service visit. We will try to accommodate your preference based on availability.",
        classes: {
          container: "w-full mb-4",
          label: "block text-sm font-medium text-gray-700 mb-2",
          select: `w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors cursor-pointer ${
            preferredTimeSlotOptions.length === 0
              ? "bg-gray-50 cursor-not-allowed"
              : "bg-white"
          }`,
          error: "text-red-600 text-sm mt-1",
          helperText: "text-xs text-gray-500 mt-1", // muted, small
        },
      },
      {
        name: "additionalInstructions",
        label: "Additional Instructions (Optional)",
        type: "textarea",
        placeholder:
          "Enter any special instructions or requirements for the service team...",
        rows: 4,
        helperText:
          "Include any special requirements, access instructions, or specific requests",
        showHelperTooltip: true,
        classes: {
          container: "w-full mb-6 col-span-2",
          label: "block text-sm font-medium text-gray-700 mb-2",
          textarea:
            "w-full border-2 border-gray-400 rounded-lg bg-white text-gray-900 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          error: "text-red-600 text-sm mt-1",
          helperText: "text-xs text-gray-500 mt-1",
        },
        tooltipText:
          "Provide any special instructions or requirements for the service team. This could include access information, special conditions, or specific requests.",
        fullWidth: true,
      },
    ],
    [preferredTimeSlotOptions]
  );

  // Move form creation to component top level - outside of useMemo
  const form = FormService.createForm({
    fields: serviceDetailsFields,
    mode: "onChange",
    validateOnMount: false,
    defaultValues: {
      scheduledDate: "",
      preferredTimeSlot: "",
      additionalInstructions: "",
    },
  });

  // Load saved data from step helpers on component mount
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current && !isLoadingTimeSlots) {
      try {
        // Try to get data from step helpers first
        const savedStepData = stepHelpers.getStepData(currentStepIndex);
        if (savedStepData) {
          console.log("Loaded step data from stepHelpers:", savedStepData);
          FormService.populateForm(form, savedStepData, serviceDetailsFields);
        }
        dataLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load step data from stepHelpers:", error);
        dataLoadedRef.current = true;
      }
    }
  }, [
    stepHelpers,
    currentStepIndex,
    form,
    serviceDetailsFields,
    isLoadingTimeSlots,
  ]);

  const { data: userProfile } = useGlobalUserProfile();
      const currency = userProfile?.utility?.tenant?.currency?.toString() ?? null;

  // Get service data from previous steps
  const getServiceData = () => {
    if (!stepHelpers) return null;

    // Get service selection data from step 1
    const serviceSelectionData = stepHelpers.getStepData(1);
    console.log('debug service data selected', serviceSelectionData);
    // Get customer data from step 0
    const customerData = stepHelpers.getStepData(0);

    return {
      serviceSelection: serviceSelectionData,
      customer: customerData,
    };
  };

  const serviceData = getServiceData();
  console.log(serviceData);

  const handleFormSubmit = async (data: any) => {
    // Clear any previous validation errors
    if (clearValidationError) {
      clearValidationError();
    }

    try {
      // Validate form using FormService
      const isValid = await FormService.validateForm(form);

      if (!isValid) {
        const errorMessage =
          "Please fix the validation errors before proceeding.";
        toast({
          title: errorMessage,
          variant: "destructive",
        });

        if (setValidationError) {
          setValidationError(errorMessage);
        }
        return;
      }

      // Create payload using FormService
      const payload = FormService.createPayload(data, serviceDetailsFields);

      // Save data using step helpers
      if (stepHelpers) {
        const stepData = {
          ...payload,
          timestamp: new Date().toISOString(),
        };
        stepHelpers.setStepData(currentStepIndex, stepData);

        // Also save to storage key for backup
        try {
          const existingData = localStorage.getItem(storageKey);
          const allStepData = existingData ? JSON.parse(existingData) : {};
          allStepData[currentStepIndex] = {
            ...allStepData[currentStepIndex],
            ...stepData,
            stepIndex: currentStepIndex,
          };
          localStorage.setItem(storageKey, JSON.stringify(allStepData));
          console.log("Step data saved to storage:", stepData);
        } catch (error) {
          console.error("Failed to save to storage:", error);
        }
      }

      // Proceed to next step
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error("Form validation failed:", error);
      const errorMessage = "Please check your form data and try again.";
      toast({
        title: errorMessage,
        variant: "destructive",
      });

      if (setValidationError) {
        setValidationError(errorMessage);
      }
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    // Save individual field changes using step helpers
    if (stepHelpers) {
      const currentData = stepHelpers.getStepData(currentStepIndex) || {};
      const updatedData = { ...currentData, [fieldName]: value };
      stepHelpers.setStepData(currentStepIndex, updatedData);

      // Also update storage
      try {
        const existingData = localStorage.getItem(storageKey);
        const allStepData = existingData ? JSON.parse(existingData) : {};
        allStepData[currentStepIndex] = {
          ...allStepData[currentStepIndex],
          [fieldName]: value,
          timestamp: new Date().toISOString(),
          stepIndex: currentStepIndex,
        };
        localStorage.setItem(storageKey, JSON.stringify(allStepData));
      } catch (error) {
        console.error("Failed to save field change to storage:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div> </div>

      {/* Selected Service Display */}
      {serviceData?.serviceSelection?.selectedService && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Selected Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Service Name
                  </h4>
                  <p className="text-lg font-semibold">
                    {serviceData.serviceSelection.selectedService.name}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.serviceSelection.selectedService.description}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Utility Service
                  </h4>
                  {serviceData.serviceSelection.selectedService.utilityService
                    .split(",")
                    .map((service, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="capitalize mr-2"
                      >
                        {service.trim()}
                      </Badge>
                    ))}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Service charges
                  </h4>
                  <div className="text-lg font-semibold text-primary">
                    {currency} {
                      serviceData.serviceSelection.selectedService.extraData
                        .serviceCharge
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Details Form */}
      <DynamicForm
        fields={serviceDetailsFields}
        form={form}
        onSubmit={handleFormSubmit}
        onFieldChange={handleFieldChange}
        config={{
          showSubmitButton: false,
          showResetButton: false,
        }}
        gridColumns={2}
        responsiveColumns={{ sm: 1, md: 2 }}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button
          onClick={() => handleFormSubmit(form.getValues())}
          disabled={isValidating}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};
