// TransferDetailsStep.tsx

import { useConsumerRelation, usePremise, useUtilityRequestConfiguration } from "@features/serviceRequest/hooks";
import { DynamicForm } from "@shared/components/DynamicForm";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { FormField, FormService } from "@shared/services/FormServices";
import { Button } from "@shared/ui/button";
import { useCallback, useEffect, useRef } from "react";
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

interface TransferDetailsStepProps {
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

export function TransferDetailsStep({

  storageKey,
  stepHelpers,
  currentStepIndex = 0,
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating,
}: TransferDetailsStepProps) {
     const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();
  const dataLoadedRef = useRef(false);

  // Get transfer type configurations from API
  const { data: transferConfigurations, isLoading: isLoadingTransferTypes } =
    useUtilityRequestConfiguration({
      remoteUtilityId,
      requestType: "Transfer",
      disablePagination: true,
    });

  // Transform transfer configurations to form options
  const transferTypeOptions =
    transferConfigurations?.result?.map((config) => ({
      value: config.id,
      label: config.name,
      version:config.version
    })) || [];

  const { data: relationData } = useConsumerRelation();
  const relationOptions =
    relationData?.result?.map((config) => ({
      value: config.key,
      label: config.value,
    })) || [];
  console.log("Relation dataaaa", relationData);
  console.log("Relation dataaaa", relationOptions);
  console.log("transferConfigurations", transferConfigurations);

  // Fetch premises using hooks (for dynamic premise dropdown)
  const { data: premisesData, isLoading: isLoadingPremises } = usePremise({
    remote_utility_id: remoteUtilityId,
    config_level: "premise",
  });

  // Transform premises to options
  const premiseOptions = (premisesData?.result || []).map((premise: any) => ({
    value: premise.code,
    label: premise.name,
    data: premise,
  }));

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

  // Helper to get premise by code
  const getPremiseByCode = (premiseCode) => {
    return premiseOptions.find((p) => p.value === premiseCode)?.data || null;
  };

  // Create form fields
  const transferFields: FormField[] = [
    {
      name: "transferType",
      label: "Transfer Type",
      type: "select",
      required: true,
      options: transferTypeOptions,
      helperText:
        "Select the appropriate transfer type based on your situation",
      showHelperTooltip: true,
      tooltipText:
        "Full ownership transfers all account responsibilities, business transfers are for commercial entities, and deceased transfers handle estate situations.",
      fullWidth: true,
      group: "Transfer Type & Schedule",
    //   groupColor: "border-l-blue-500",
      groupOrder: 1,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "effectiveDate",
      label: "Effective Date",
      type: "datepicker",
      required: true,
      helperText: "The date when the transfer will take effect",
      showHelperTooltip: true,
      tooltipText:
        "The date when the transfer will take effect. This cannot be in the past. Allow 3-5 business days for processing.",
      group: "Transfer Type & Schedule",
    //   groupColor: "border-l-blue-500",
      groupOrder: 1,
      fullWidth: true,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "newCustomerFirstName",
      label: "New Customer First Name",
      type: "text",
      required: true,
      placeholder: "Enter first name",
      helperText: "Legal first name as it appears on identification",
      showHelperTooltip: true,
      tooltipText:
        "Enter the legal first name as it appears on government-issued identification.",
      fullWidth: true,
      group: "New Customer Information",
    //   groupColor: "border-l-green-500",
      groupOrder: 2,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "newCustomerLastName",
      label: "New Customer Last Name",
      type: "text",
      required: true,
      placeholder: "Enter last name",
      helperText: "Legal last name as it appears on identification",
      showHelperTooltip: true,
      tooltipText:
        "Enter the legal last name as it appears on government-issued identification.",
      fullWidth: true,
      group: "New Customer Information",
    //   groupColor: "border-l-green-500",
      groupOrder: 2,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "newCustomerEmail",
      label: "New Customer Email",
      type: "email",
      required: true,
      placeholder: "Enter email address",
      helperText: "Primary email for account communications",
      showHelperTooltip: true,
      tooltipText:
        "This email will be used for all account communications, bills, and notifications.",
      fullWidth: true,
      group: "New Customer Information",
    //   groupColor: "border-l-green-500",
      groupOrder: 2,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "newCustomerPhone",
      label: "New Customer Phone",
      type: "phone",
      required: true,
      placeholder: "(000) 000-0000",
      helperText: "Primary contact phone number",
      showHelperTooltip: true,
      tooltipText:
        "Provide the best phone number to reach the new account holder.",
      fullWidth: true,
      group: "New Customer Information",
    //   groupColor: "border-l-green-500",
      groupOrder: 2,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "relationship",
      label: "Relationship to Current Customer",
      type: "select",
      required: true,
      options: relationOptions,
      group: "New Customer Information",
    //   groupColor: "border-l-green-500",
      groupOrder: 2,
      helperText: "Relationship between current and new account holder",
      showHelperTooltip: true,
      tooltipText:
        "Select the relationship between the current account holder and the new account holder.",
      fullWidth: true,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "changeBillingAddress",
      label: "Change Billing Address?",
      type: "select",
      required: true,
      options: [
        { value: "yes", label: "Yes, update address" },
        { value: "no", label: "No, keep existing address" },
      ],
      helperText: "Choose whether to update the billing address",
      showHelperTooltip: true,
      tooltipText:
        "You can choose to keep the existing billing address or update it.",
      fullWidth: true,
      group: "Billing Address",
    //   groupColor: "border-l-purple-500",
      groupOrder: 3,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        error: "text-red-600 text-sm mt-1",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "premiseType",
      label: "Premise",
      type: "select",
      required: true,
      searchable: true,
      placeholder: "Select premise",
      options: premiseOptions,
      helperText: "Select the premise for the new billing address",
      showWhen: (formValues: any) => formValues.changeBillingAddress === "yes",
      group: "Billing Address",
    //   groupColor: "border-l-purple-500",
      groupOrder: 3,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "unit",
      label: "House/Unit Number",
      type: "text",
      required: true,
      placeholder: "e.g 123,Apt 4B",
      showWhen: (formValues: any) => formValues.changeBillingAddress === "yes",
      group: "Billing Address",
    //   groupColor: "border-l-purple-500",
      groupOrder: 3,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "streetAddress",
      label: "Street Address",
      type: "text",
      required: true,
      placeholder: "e.g 123 Main Street",
      showWhen: (formValues: any) => formValues.changeBillingAddress === "yes",
      group: "Billing Address",
    //   groupColor: "border-l-purple-500",
      groupOrder: 3,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "zipCode",
      label: "Zip/Postal Code",
      type: "text",
      required: true,
      placeholder: "e.g. 12345",
      showWhen: (formValues: any) => formValues.changeBillingAddress === "yes",
      group: "Billing Address",
    //   groupColor: "border-l-purple-500",
      groupOrder: 3,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-12 px-4 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "financialResponsibility",
      label: "Financial Responsibility",
      type: "select",
      required: true,
      options: [
        {
          value: "transfer",
          label:
            "Transfer outstanding balance - Outstanding balance will be transferred to the new account holder",
        },
        {
          value: "clear",
          label:
            "Clear balance before transfer - Current account holder must pay outstanding balance first",
        },
      ],
      helperText: "Choose how to handle outstanding balance",
      showHelperTooltip: true,
      tooltipText:
        "Transfer: New account holder assumes responsibility for existing balance. Clear: Current balance must be paid before transfer.",
      fullWidth: true,
      group: "Financial Responsibility",
    //   groupColor: "border-l-red-500",
      groupOrder: 4,
      classes: {
        container: "w-full mb-6 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        error: "text-red-600 text-sm mt-1",
        select:
          "w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "specialInstructions",
      label: "Special Instructions",
      type: "textarea",
      placeholder:
        "Add any special instructions, notes, or requirements for this transfer",
      helperText: "Additional information for processing",
      showHelperTooltip: true,
      tooltipText:
        "Include any special circumstances, specific timing requirements, or additional information that may be relevant to processing this transfer request.",
      fullWidth: true,
      group: "Financial Responsibility",
    //   groupColor: "border-l-red-500",
      groupOrder: 4,
      classes: {
        container: "w-full mb-4 col-span-2",
        label: "block text-sm font-medium text-gray-700 mb-1",
        textarea:
          "w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-white resize-none",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-gray-500 text-xs mt-1",
      },
    },
  ];

  // Create Form Instance
  const transferForm = FormService.createForm({
    fields: transferFields,
    mode: "onChange",
    validateOnMount: false,
    defaultValues: {
      transferType:
        transferTypeOptions.length > 0 ? transferTypeOptions[0].value : "",
      effectiveDate: "",
      newCustomerFirstName: "",
      newCustomerLastName: "",
      newCustomerEmail: "",
      newCustomerPhone: "",
      relationship: "",
      changeBillingAddress: "no",
      billingAddress: "",
      financialResponsibility: "transfer",
      specialInstructions: "",
    },
  });

  // Update form when transfer types are loaded
  // useEffect(() => {
  //   if (transferTypeOptions.length > 0 && transferForm) {
  //     const currentValue = transferForm.getValues("transferType");
  //     if (
  //       !currentValue ||
  //       !transferTypeOptions.find((option) => option.value === currentValue)
  //     ) {
  //       transferForm.setValue("transferType", transferTypeOptions[0].value);
  //     }
  //   }
  // }, [transferTypeOptions, transferForm]);

  // Load saved data from stepHelpers on component mount
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current && !isLoadingTransferTypes) {
      try {
        const savedStepData = getStepData();
        if (savedStepData) {
          console.log("Loaded step data from stepHelpers:", savedStepData);

          // Populate form with saved data
          FormService.populateForm(transferForm, savedStepData, transferFields);
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
    transferForm,
    getStepData,
    isLoadingTransferTypes,
  ]);

  // Show error state if no transfer types are available
  if (!isLoadingTransferTypes && transferTypeOptions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            No transfer types are currently available.
          </p>
          <p className="text-gray-600">
            Please contact support or try again later.
          </p>
        </div>
      </div>
    );
  }

// Fix the version retrieval logic in handleFormSubmit
const handleFormSubmit = (data: any) => {
  // Clear any previous validation errors
  if (clearValidationError) {
    clearValidationError();
  }

  // Validate required fields before proceeding
  const requiredFields = [
    "transferType",
    "effectiveDate",
    "newCustomerFirstName",
    "newCustomerLastName",
    "newCustomerEmail",
    "newCustomerPhone",
    "relationship",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    const errorMessage = `Please fill in all required fields: ${missingFields.join(
      ", "
    )}`;
    toast({
      title: errorMessage,
      variant: "destructive",
    });

    // Set validation error in stepper
    if (setValidationError) {
      setValidationError(errorMessage);
    }
    return;
  }

  // FIX: Convert data.transferType to number for comparison and add debugging
  console.log("data.transferType:", data.transferType, "type:", typeof data.transferType);
  console.log("transferConfigurations:", transferConfigurations?.result);

  const selectedTransfer = transferConfigurations?.result?.find((option) => {
    // Convert both to numbers for comparison
    const optionId = Number(option.id);
    const transferTypeId = Number(data.transferType);
    console.log("Comparing:", optionId, "with", transferTypeId);
    return optionId === transferTypeId;
  });

  console.log("selectedTransfer:", selectedTransfer);
  const transferTypeVersion = selectedTransfer?.version || "";
  console.log("transferTypeVersion:", transferTypeVersion);

  // Find the selected premise object
  const selectedPremise = premiseOptions.find(
    (p) => p.value === data.premiseType
  )?.data;
  const hierarchyCodes = selectedPremise?.hierarchyCodes || {};
  const hierarchyNames = selectedPremise?.hierarchyNames || {};
  console.log("Codesssss", hierarchyCodes);
  console.log("Namessss", hierarchyNames);

console.log("data.relationship:", data.relationship);
console.log("relationOptions:", relationOptions);
  // Transform data to match original structure
  const formData = {
    transferType: data.transferType,
    transferTypeLabel:
      transferTypeOptions.find((option) => Number(option.value) === Number(data.transferType))
        ?.label || "",
        
  newCustomer: {
  firstName: data.newCustomerFirstName,
  lastName: data.newCustomerLastName,
  email: data.newCustomerEmail,
  phoneNumber: data.newCustomerPhone,
  relationship: data.relationship,
  relationshipLabel: relationOptions.find((option) => Number(option.value) === Number(data.relationship))?.label || "",
},
    changeBillingAddress: data.changeBillingAddress,
    billingAddress: data.billingAddress,
    effectiveDate: data.effectiveDate,
    financialResponsibility: data.financialResponsibility,
    specialInstructions: data.specialInstructions,
    isStepComplete: true,
    completedAt: new Date().toISOString(),
    version: transferTypeVersion,
    premiseType: data.premiseType,
    premiseHierarchyCodes: hierarchyCodes,
    premiseHierarchyNames: hierarchyNames,
  };

  // Save to stepHelpers
  saveStepData(formData);

  if (onNext) {
    onNext();
  }
};
  const handleFieldChange = (fieldName: string, value: any) => {
    // Get current step data and update the specific field
    const currentData = getStepData() || {};
    const updatedData = {
      ...currentData,
      [fieldName]: value,
      lastUpdated: new Date().toISOString(),
    };

    // Auto-populate area, subarea, city when premiseType changes
    if (fieldName === "premiseType" && value) {
      const premise = getPremiseByCode(value);
      console.log("premise dataaaaaaaaaaaa", premise.hierarchyCodes);
      if (premise && premise.hierarchyNames) {
        console.log("Selected premise hierarchyNames:", premise.hierarchyNames);
        transferForm.setValue("city", premise.hierarchyNames.state || "");
        transferForm.setValue("area", premise.hierarchyNames.area || "");
        transferForm.setValue(
          "subarea",
          premise.hierarchyNames.subArea || premise.hierarchyNames.subarea || ""
        );
      }
    }

    // Save updated data using stepHelpers
    saveStepData(updatedData);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">
          Complete the transfer details form below. All required fields must be
          filled to proceed.
        </p>
      </div>

      <DynamicForm
        fields={transferFields}
        form={transferForm}
        onSubmit={handleFormSubmit}
        onFieldChange={handleFieldChange}
        config={{
          showSubmitButton: false,
          showResetButton: false,
        }}
        gridColumns={2}
        responsiveColumns={{ sm: 1, md: 2 }}
      />
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button
          onClick={() => handleFormSubmit(transferForm.getValues())}
          disabled={
            isValidating ||
            isLoadingTransferTypes ||
            transferTypeOptions.length === 0
          }
          className="min-w-[200px]"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </>
          ) : isLoadingTransferTypes ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </>
          ) : (
            "Continue to Documentation"
          )}
        </Button>
      </div>
    </div>
  );
}
