import { zodResolver } from "@hookform/resolvers/zod";
import { DynamicForm } from "@shared/components/DynamicForm";
import { StepHelpers } from "@shared/components/Stepper";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { FormField } from "@shared/services/FormServices";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Calendar, CreditCard, FileText, Receipt } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { ApiCustomField, CustomFieldConfig, useCustomFieldsForm } from "@shared/utils/customFormMaker";
import { useCreateServiceRequest, usePaymentMethod, useTimeSlotChoices } from "@features/serviceRequest/hooks";

// Import the utility functions



const reviewPaymentSchema = z.object({
  paymentMethod: z.enum(["Pay Now", "Pay Later", "Add to Bill", "Invoice"]),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type ReviewPaymentFormData = z.infer<typeof reviewPaymentSchema>;

interface ReviewPaymentStepProps {
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
export interface PaymentMethod {
  name: string;
  remark?: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  customFields?:
    | ApiCustomField[]
    | {
        tax: string;
        fare: string;
        key?: string;
      };
  code: string;
}
export const ReviewPaymentStep: React.FC<ReviewPaymentStepProps> = ({
  storageKey,
  stepHelpers,
  currentStepIndex = 3, // Default to step 3 for review payment
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating,
}) => {
  const { remoteUtilityId,consumerId} = getLoginDataFromStorage();
  const createServiceRequestMutation = useCreateServiceRequest();
  const [paymentOption, setPaymentOption] = useState("Pay Now");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const { data: timeSlotChoicesData } = useTimeSlotChoices();
  const { data: paymentMethodsData } = usePaymentMethod({
    remote_utility_id:"699",
  });

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
  // Use localStorage to persist payment data
  const [paymentData, setPaymentData] = useLocalStorage(
    `${storageKey}_payment`,
    {
      paymentMethod: "Pay Now",
      acceptTerms: false,
    }
  );

  // Configuration for custom fields - matching your existing styling
  const customFieldConfig: CustomFieldConfig = useMemo(
    () => ({
      namingStrategy: "key-fallback",
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-500",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
      gridColumns: 3,
      responsiveColumns: { sm: 1, md: 3 },
      fullWidth: true,
      enableTooltips: true,
      fieldNameCleaning: true,
    }),
    []
  );

  // Get state from step helpers or localStorage
  const getState = useCallback(() => {
    if (stepHelpers) {
      // Get data from previous steps
      const serviceData = stepHelpers.getStepData(0); // Service selection step
      const serviceDetailsData = stepHelpers.getStepData(1); // Service details step

      return {
        ...paymentData,
        ...serviceData,
        ...serviceDetailsData,
      } as any; // Use any to handle dynamic properties from different steps
    }
    return paymentData as any;
  }, [stepHelpers, paymentData]);

  const state = getState();
  console.log("state", state);

  // Update state function
  const onUpdateState = useCallback(
    (updates: any) => {
      const newData = { ...paymentData, ...updates };
      setPaymentData(newData);

      // Also update step helpers if available
      if (stepHelpers) {
        stepHelpers.setStepData(currentStepIndex, newData);
      }
    },
    [paymentData, setPaymentData, stepHelpers, currentStepIndex]
  );

  const form = useForm<ReviewPaymentFormData>({
    resolver: zodResolver(reviewPaymentSchema),
    defaultValues: {
      paymentMethod: (state.paymentMethod as any) || "Pay Now",
      acceptTerms: state.acceptTerms || false,
    },
  });

  // Create custom fields form
  const customFieldsForm = useForm({
    mode: "onBlur",
  });

  // Memoize the custom fields data to prevent unnecessary re-renders
  const customFieldsData = useMemo(() => {
    return Array.isArray(selectedPaymentMethod?.customFields)
      ? selectedPaymentMethod.customFields
      : undefined;
  }, [selectedPaymentMethod?.customFields]);

  // Use the utility hook for custom fields
  const {
    formFields: customFormFields,
    defaultValues: customFieldDefaults,
    resetFormWithDefaults,
    hasFields,
  } = useCustomFieldsForm(
    customFieldsData,
    customFieldsForm,
    customFieldConfig
  );

  // Reset custom fields form when payment method changes
  useEffect(() => {
    if (
      selectedPaymentMethod &&
      Array.isArray(selectedPaymentMethod.customFields)
    ) {
      resetFormWithDefaults();
    }
  }, [selectedPaymentMethod, resetFormWithDefaults]);

  // Update form when state changes
  useEffect(() => {
    if (state) {
      form.reset({
        paymentMethod: (state.paymentMethod as any) || "Pay Now",
        acceptTerms: state.acceptTerms || false,
      });
    }
  }, [state.paymentMethod, state.acceptTerms, form]);

  const handlePaymentOptionChange = (option: string) => {
    setPaymentOption(
      option as "Pay Now" | "Pay Later" | "Add to Bill" | "Invoice"
    );
    form.setValue("paymentMethod", option as any);
    onUpdateState({
      paymentMethod: option as
        | "Pay Now"
        | "Pay Later"
        | "Add to Bill"
        | "Invoice",
    });
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    onUpdateState({
      selectedPaymentMethodCode: method.code,
      selectedPaymentMethodName: method.name,
    });
  };

  const termsFields: FormField[] = [
    {
      name: "acceptTerms",
      label: "I agree to the terms and conditions",
      type: "checkbox",
      required: true,
      helperText:
        "By submitting this request, you agree to our service terms and privacy policy",
    },
  ];

  const handleFormSubmit = (data: ReviewPaymentFormData) => {
    if (!data.acceptTerms) {
      if (setValidationError) {
        toast.error("Please accept the terms and conditions to continue");
      }
      return;
    }

    // Collect custom fields data if available
    let customFieldsData = {};
    if (hasFields) {
      customFieldsData = customFieldsForm.getValues();
    }

    // Prepare the complete payload structure
    const paymentUpdates: any = {
      // Main request data
      remote_utility_id: remoteUtilityId,
      request_type: "Service",
      source: 1,
      consumer: consumerId,
      consumer_name: consumerDetails.firstName,
      consumer_phone: consumerDetails.contactNumber,
      consumer_email: consumerDetails.email,
      consumer_address: state.serviceAddress,
      account_number: consumerDetails.consumerNo,
      utility_support_request: state.serviceId,
      request_date: state.scheduledDate || "",
      additional_data: {
        transaction_status: 1,
        payment_service_status: 0,
        schedule_date: state.scheduledDate || "",
        preferred_time_slot: state.preferredTimeSlot || 1,
        additional_instruction: state.additionalInstructions || "",
        utility_support_request_version: state.version,
        ...data,
      },
    };

    // Add payment data only if "Pay Now" is selected
    if (paymentOption === "Pay Now" && selectedPaymentMethod) {
      paymentUpdates.payment_data = {
        payment_received_status: 0,
        amount: state.serviceCharge,
        payment_mode: selectedPaymentMethod.code,
        payment_date: new Date().toISOString(),
        remote_utility_id: remoteUtilityId,
        consumer: consumerId,
        status: "CREDIT",
        payment_pay_type: 5,
        source: 0,
        extra_data: {
          ...customFieldsData, // All custom fields go here
        },
      };
    }

    onUpdateState(paymentUpdates);

    // Clear validation errors if any
    if (clearValidationError) {
      clearValidationError();
    }

    delete paymentUpdates.paymentMethod;
    // Use the mutation hook correctly
    createServiceRequestMutation.mutate({
      consumerId: consumerId,
      remoteUtilityId: remoteUtilityId.toString(),
      utilityServices: state.utilityService,
      serviceCharges: state.serviceCharge,
      serviceName: state.serviceName,
      data: paymentUpdates,
    });
    stepHelpers?.resetAllData();
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    onUpdateState({ [fieldName]: value });
  };

  const formatTimeSlot = (timeSlot?: string) => {
    if (!timeSlot) return "Not specified";

    // Find the time slot choice that matches the stored key
    const timeSlotChoice = timeSlotChoicesData?.result?.find(
      (choice) => choice.key.toString() === timeSlot
    );
    return timeSlotChoice ? timeSlotChoice.value : timeSlot;
  };

  // Get active payment methods
  const activePaymentMethods =
    paymentMethodsData?.result?.filter((method) => method.isActive) || [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-600">
          Review your service request details and select payment method.
        </p>
      </div>

      {/* Service Information Review */}
      {state.serviceType && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Service Name
                  </h4>
                  <p className="text-lg font-semibold">{state.serviceName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Service Charge
                  </h4>
                  <p className="text-sm">{state.serviceCharge}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Utility Service
                  </h4>
                  {state.utilityService.split(",").map((service, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="capitalize mr-2"
                    >
                      {service.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Service Type
                  </h4>
                  <div className="text-lg font-semibold text-primary">
                    {state.serviceType}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Preferred Date
                  </h4>
                  <p className="text-sm">
                    {state.scheduledDate || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Preferred Time
                  </h4>
                  <p className="text-sm">
                    {formatTimeSlot(state.preferredTimeSlot)}
                  </p>
                </div>
              </div>
            </div>
            {state.additionalInstructions && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Additional Instructions
                </h4>
                <p className="text-sm bg-white p-3 rounded border">
                  {state.additionalInstructions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card
              className={`cursor-pointer transition-all ${
                paymentOption === "Pay Now"
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-accent"
              }`}
              onClick={() => handlePaymentOptionChange("Pay Now")}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <CreditCard className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-medium mb-1">Pay Now</h4>
                <p className="text-sm text-muted-foreground">
                  Process payment immediately
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                paymentOption === "Pay Later"
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-accent"
              }`}
              onClick={() => handlePaymentOptionChange("Pay Later")}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Calendar className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-medium mb-1">Pay Later</h4>
                <p className="text-sm text-muted-foreground">
                  Pay within 7 days
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                paymentOption === "Add to Bill"
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-accent"
              }`}
              onClick={() => handlePaymentOptionChange("Add to Bill")}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Receipt className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-medium mb-1">Add to First Bill</h4>
                <p className="text-sm text-muted-foreground">
                  Include fees in first invoice
                </p>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                paymentOption === "Invoice"
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:bg-accent"
              }`}
              onClick={() => handlePaymentOptionChange("Invoice")}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-medium mb-1">Send Invoice</h4>
                <p className="text-sm text-muted-foreground">
                  Email invoice to consumer
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Selection - Only show when Pay Now is selected */}
          {paymentOption === "Pay Now" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Select Payment Method
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {activePaymentMethods.map((method) => (
                    <Card
                      key={method.code}
                      className={`cursor-pointer transition-all ${
                        selectedPaymentMethod?.code === method.code
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handlePaymentMethodSelect(method)}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <CreditCard className="h-8 w-8 mb-2 text-primary" />
                        <h4 className="font-medium">{method.name}</h4>
                        {method.remark && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {method.remark}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Custom Fields Form - Simplified using utility */}
                {hasFields && (
                  <Card className="border rounded-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {selectedPaymentMethod?.name} Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DynamicForm
                        fields={customFormFields}
                        form={customFieldsForm}
                        onSubmit={() => {}} // No submit action needed here
                        onFieldChange={handleFieldChange}
                        gridColumns={3}
                        responsiveColumns={{ sm: 1, md: 3 }}
                        config={{
                          showSubmitButton: false,
                          showResetButton: false,
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {selectedPaymentMethod && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-700">
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                      Please fill in all payment details to complete your
                      application.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <DynamicForm
        fields={termsFields}
        form={form}
        onSubmit={handleFormSubmit}
        onFieldChange={handleFieldChange}
        config={{
          showSubmitButton: false,
          showResetButton: false,
        }}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={() => handleFormSubmit(form.getValues())}>
          Submit Request
        </Button>
      </div>
    </div>
  );
};
