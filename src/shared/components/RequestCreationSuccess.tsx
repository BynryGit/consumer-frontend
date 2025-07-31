import { queryClient } from "@shared/api/queries/queryClient";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { useGlobalUtility } from "@shared/hooks/useGlobalUtility";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import {
  AlertCircle,
  ArrowRightLeft,
  CheckCircle,
  CreditCard,
  Home,
  LucideIcon,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfigurableReceipt from "./ConfigurableReciept";
import { ConfigurableReceiptProps } from "@shared/types/receipt";

// Request type definitions
export type RequestType =
  | "service"
  | "complaint"
  | "disconnection"
  | "reconnection"
  | "transfer"
  | "payment";

// Configuration interface for each request type
interface RequestTypeConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  titleColor: string;
  dashboardRoute: string;
  createRoute: string;
  receiptType: string;
  fieldMappings: {
    typeField: string;
    descriptionField: string;
    statusField?: string;
    dateField?: string;
    additionalFields?: Record<string, string>;
  };
}

// Predefined configurations for each request type
const REQUEST_TYPE_CONFIGS: Record<RequestType, RequestTypeConfig> = {
  
  service: {
    title: "Service Request Created Successfully!",
    description:
      "Your service request has been submitted and is being processed.",
    icon: CheckCircle,
    iconColor: "text-green-500",
    titleColor: "text-green-600",
    dashboardRoute: "/serviceRequest",
    createRoute: "/service/newservice",
    receiptType: "Service Request Receipt",
    fieldMappings: {
      typeField: "serviceType",
      descriptionField: "serviceDescription",
      dateField: "scheduledDate",
    },
  },
  complaint: {
    title: "Complaint Submitted Successfully!",
    description:
      "Your complaint has been registered and will be investigated promptly.",
    icon: AlertCircle,
    iconColor: "text-green-500",
    titleColor: "text-green-600",
    dashboardRoute: "/serviceRequest",
    createRoute: "/service/complaint",
    receiptType: "Complaint Receipt",
    fieldMappings: {
      typeField: "complaintType",
      descriptionField: "complaintDescription",
      additionalFields: {
        priority: "priority",
        category: "category",
      },
    },
  },
  disconnection: {
    title: "Disconnection Request Processed Successfully!",
    description:
      "Your disconnection request has been scheduled and will be processed accordingly.",
    icon: PowerOff,
    iconColor: "text-red-500",
    titleColor: "text-red-600",
    dashboardRoute: "/serviceRequest",
    createRoute: "/service/disconnect",
    receiptType: "Disconnection Request Receipt",
    fieldMappings: {
      typeField: "disconnectionType",
      descriptionField: "disconnectionReason",
      dateField: "effectiveDate",
      additionalFields: {
        finalReadingDate: "finalReadingDate",
      },
    },
  },
  reconnection: {
    title: "Reconnection Request Created Successfully!",
    description:
      "Your reconnection request has been submitted and will be processed shortly.",
    icon: Power,
    iconColor: "text-blue-500",
    titleColor: "text-blue-600",
    dashboardRoute: "/serviceRequest",
    createRoute: "/cx/reconnections/create",
    receiptType: "Reconnection Request Receipt",
    fieldMappings: {
      typeField: "reconnectionType",
      descriptionField: "reconnectionReason",
      dateField: "requestedDate",
      additionalFields: {
        urgency: "urgency",
      },
    },
  },
  transfer: {
    title: "Transfer Request Submitted Successfully!",
    description:
      "Your transfer request has been received and is being reviewed.",
    icon: ArrowRightLeft,
    iconColor: "text-purple-500",
    titleColor: "text-purple-600",
    dashboardRoute: "/serviceRequest",
    createRoute: "/service/transfer",
    receiptType: "Transfer Request Receipt",
    fieldMappings: {
      typeField: "transferType",
      descriptionField: "transferReason",
      dateField: "transferDate",
      additionalFields: {
        newAddress: "newAddress",
        transfereeDetails: "transfereeDetails",
      },
    },
  },
  payment: {
    title: "Payment Recorded Successfully!",
    description: "Your payment has been processed and recorded in our system.",
    icon: CreditCard, // Import: import { CreditCard } from "lucide-react";
    iconColor: "text-green-500",
    titleColor: "text-green-600",
    dashboardRoute: "/cx/payments",
    createRoute: "/cx/payments/create",
    receiptType: "Payment Receipt",
    fieldMappings: {
      typeField: "paymentMode",
      descriptionField: "paymentChannel",
      dateField: "paymentDate",
      additionalFields: {
        amount: "amount",
        transactionId: "transactionId",
        receiptNo: "receiptNo",
        paymentType: "paymentPayType",
        status: "status",
      },
    },
  },
};

interface RequestSuccessProps {
  requestType: RequestType;
  requestData: any;
  onReturnToDashboard?: () => void;
  onAddNewRequest?: () => void;
  // Optional overrides for customization
  customConfig?: Partial<RequestTypeConfig>;
}

export function RequestCreationSuccess({
  requestType,
  requestData,
  onReturnToDashboard,
  onAddNewRequest,
  customConfig,
}: RequestSuccessProps) {
      const { remoteUtilityId, remoteConsumerNumber,consumerId,firstName,lastName } = getLoginDataFromStorage();
  const navigate = useNavigate();
  const { data: utilityData } = useGlobalUtility();
console.log("dattaaaaaaaaaaa",utilityData)
  // Get configuration for the request type
  const baseConfig = REQUEST_TYPE_CONFIGS[requestType];
  const config = { ...baseConfig, ...customConfig };

  // Add defensive check for requestData
  if (!requestData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center">
            <config.icon className={`h-16 w-16 ${config.iconColor}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${config.titleColor}`}>
              {config.title}
            </h1>
            <p className="text-muted-foreground mt-2">{config.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-6 print:hidden">
          <button
            onClick={
              onReturnToDashboard || (() => navigate(config.dashboardRoute))
            }
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </button>
          <button
            // onClick={() => handleReturnToDashboard()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Request
          </button>
        </div>
      </div>
    );
  }

  // Enhanced mapping function with request type specific handling
  const mapToReceiptConfig = (
    data: any
  ): ConfigurableReceiptProps["config"] => {
    console.log(`Mapping ${requestType} data to receipt config:`, data);
    console.log("utility dataaaa", utilityData);
      const utility = Array.isArray(utilityData) && utilityData.length > 0 ? utilityData[0] : null;
      console.log("Extracted utility:", utility);
    // Extract data from API response structure
    const result = data.result || {};
    const paymentResult = data.paymentResult || {};
    const formData = data.formData || {};

    // Get request details with fallbacks
    const requestId =
      result.requestNo ||
      `${requestType.toUpperCase()}-${Date.now().toString().slice(-6)}`;
const serviceAmount = Number(data.serviceCharges) || Number(result.paymentResult?.amount) || 0;

    // Get field values based on request type mapping
    const typeValue =
      formData[config.fieldMappings.typeField] ||
      result.requestTypeDisplay ||
      `${requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request`;

    const descriptionValue =
      formData[config.fieldMappings.descriptionField] ||
      result.consumerRemark ||
      `${
        requestType.charAt(0).toUpperCase() + requestType.slice(1)
      } request submitted`;

    // Create items array for the request
    const items = [
      {
        id: "1",
        name: typeValue,
        description: descriptionValue,
        quantity: 1,
        unit: "request",
        price: serviceAmount,
        total: serviceAmount,
      },
    ];

    const shouldIncludeServiceName = ![
      "transfer",
      "reconnection",
      "disconnection",
      
    ].includes(requestType);

    // Build request details section with type-specific data
    const requestSection = {
      title: `${
        requestType.charAt(0).toUpperCase() + requestType.slice(1)
      } Request Details`,
      layout: "grid" as const,
      content: {
        ...(shouldIncludeServiceName && {
          ServiceName: data.serviceName || "N/A",
        }),
        description: descriptionValue,
        requestNumber: result.requestNo || "Pending assignment",
        requestType: typeValue,
        source: result.sourceDisplay || "Online",
        requestDate:
          result.requestDate ||
          result.createdDate ||
          new Date().toLocaleDateString(),
        consumerID:consumerId|| "N/A",
      } as Record<string, any>,
    };

    console.log("Request Section Content:", requestType);

    // if (!["transfer", "reconnect", "disconnection"].includes(requestType)) {
    //   requestSection.content.utilityService = data.utilityService || "N/A";
    // }

    // Add type-specific fields
    if (config.fieldMappings.dateField) {
      const dateValue = formData[config.fieldMappings.dateField];
      if (dateValue) {
        requestSection.content[config.fieldMappings.dateField] = dateValue;
      }
    }

    // Add additional fields based on request type
    if (config.fieldMappings.additionalFields) {
      Object.entries(config.fieldMappings.additionalFields).forEach(
        ([key, formField]) => {
          const value =
            formData[formField] || result.additionalData?.[formField];
          if (value) {
            requestSection.content[key] = value;
          }
        }
      );
    }

    // Add preferred time slot for applicable request types
    if (
      requestType === "service" ||
      requestType === "reconnection" ||
      requestType === "disconnection"
    ) {
      requestSection.content.preferredTime =
        getTimeSlotDisplay(result.additionalData?.preferredTimeSlot) ||
        formData.preferredTimeSlot ||
        "Flexible";
    }

    // Add service charges
    if (!["transfer", "disconnection", "reconnection"].includes(requestType)) {
  requestSection.content.serviceCharges = 
  data.serviceCharges ? `$${data.serviceCharges}` : 
  (formData.serviceCharge ? `$${formData.serviceCharge}` : "No charge");
    }

    // Add additional instructions if provided
    if (result.additionalData?.additionalInstruction) {
      requestSection.content.additionalInstructions =
        result.additionalData.additionalInstruction;
    }
    
    // Build payment details section
 const paymentSection: any = {
  title: "Payment Information",
  layout: "grid" as const,
  content: {
    paymentStatus:
      result.additionalData?.transactionStatusDisplay || "UnPaid",
  },
};

    // Add payment details if payment was made
    if (paymentResult && Object.keys(paymentResult).length > 0) {
      paymentSection.content = {
        ...paymentSection.content,
        transactionId: paymentResult.transactionId || "Pending",
        receiptNumber: paymentResult.receiptNo || "Pending",
        amount: `$${Number(paymentResult.amount || 0).toFixed(2)}`,
        paymentMode: paymentResult.paymentMode || "Pending",
        paymentDate: paymentResult.paymentDate || "Pending",
      };

      // Add extra payment data if available
      if (paymentResult.extraData) {
        const extraData = paymentResult.extraData;
        if (extraData.amount)
          paymentSection.content.extraAmount = `$${extraData.amount}`;
        if (extraData.paymentAmount)
          paymentSection.content.paymentAmount = `$${extraData.paymentAmount}`;
        if (extraData.paymentDate)
          paymentSection.content.extraPaymentDate = extraData.paymentDate;
      }
    }

    // Build sections array
    const sections = [requestSection, paymentSection];

    // Enhanced customer data with fallbacks
    const customerInfo =
      formData.consumer_name || formData.account_number
        ? {
            accountNumber: formData.account_number || "N/A",
            name: formData.consumer_name || "N/A",
            phone: formData.consumer_phone || "N/A",
            email: formData.consumer_email || undefined,
            address: formData.consumer_address || "N/A",
            customerId: formData.consumer?.toString() || "N/A",
          }
        : {
            customerId: formData.consumer?.toString() || "N/A",
            name: "Customer",
            accountNumber: "N/A",
          };
    if (requestType === "payment") {
      // Enhanced payment-specific mapping
      const paymentAmount = parseFloat(
        result.paymentResult?.amount || result.amount || formData.amount || 0
      );
      const totalPaid = parseFloat(
        result.extra_data?.payment_amount ||
          formData.extraData?.payment_amount ||
          paymentAmount
      );
      const billAmount = parseFloat(
        result.extra_data?.bill_amount ||
          formData.extraData?.bill_amount ||
          paymentAmount
      );
      const excessRefund = parseFloat(
        result.extra_data?.excess_refund ||
          formData.extraData?.excess_refund ||
          0
      );

      // Create payment-specific items
      const items = [
        {
          id: "1",
          name: "Payment Transaction",
          description: `Payment via ${
            formData.paymentMode || result.payment_mode || "N/A"
          }`,
          quantity: 1,
          unit: "payment",
          price: paymentAmount,
          total: paymentAmount,
        },
      ];

      // Payment Details Section
      const paymentDetailsSection = {
        title: "Payment Details",
        layout: "grid" as const,
        content: {
          transactionId: result.transactionId || "Pending",
          receiptNumber: result.receiptNo || "Pending",
          paymentAmount: `$${paymentAmount.toFixed(2)}`,
          totalPaid: `$${totalPaid.toFixed(2)}`,
          paymentMethod: formData.paymentMode || result.paymentMode || "N/A",
          paymentChannel:
            formData.paymentChannel || result.paymentChannel || "N/A",
          paymentType: result.paymentPayTypeDisplay || "Standard Payment",
          paymentDate:
            result.paymentDate ||
            formData.paymentDate ||
            new Date().toLocaleDateString(),
          status: result.status || "Processed",
          additionalNotes:
            result.extraData?.additionalNotes || "No additional notes provided",
        },
      };

      // Balance Information Section
      const balanceSection = {
        title: "Balance Information",
        layout: "grid" as const,
        content: {
          billAmount: `$${billAmount.toFixed(2)}`,
          amountPaid: `$${totalPaid.toFixed(2)}`,
          appliedToAccount: `$${paymentAmount.toFixed(2)}`,
          excessRefund: `$${excessRefund.toFixed(2)}`,
          refundStatus: "Credit applied to account",
        },
      };

      // Add excess refund info if applicable
      if (excessRefund > 0) {
        balanceSection.content.excessRefund = `$${excessRefund.toFixed(2)}`;
        balanceSection.content.refundStatus = "Credit applied to account";
      }

      // Additional Notes Section (if available)
      const additionalNotes =
        result.extra_data?.additional_notes ||
        formData.extraData?.additionalNotes;
      // Add notes to payment details section if available
      if (additionalNotes && additionalNotes.trim()) {
        paymentDetailsSection.content.additionalNotes = additionalNotes.trim();
      }
      // Enhanced customer data for payments
      const customerInfo = {
        customerId:
          result.consumer?.toString() || formData.consumer?.toString() || "N/A",
        accountNumber:
          result.consumer?.toString() || formData.consumer?.toString() || "N/A",
        name: formData.firstName + " " + formData.lastName || "N/A", // This could be enhanced if customer name is available
        paymentReference: result.transaction_id || "N/A",
      };

      return {
         company: {
      name: utility?.name || "Utility Company",
      address: utility?.addressMap?.address || 
               `${utility?.addressMap?.city || ''}, ${utility?.addressMap?.state || ''}`.trim() || 
               "Address not available",
      phone: utility?.contactNumber || "Contact not available",
      email: utility?.email || "Email not available",
    },

        receipt: {
          number: result.receipt_no || `PAY-${Date.now().toString().slice(-6)}`,
          type: config.receiptType,
          date: new Date(
            result.payment_date
              ? convertDateString(result.payment_date)
              : Date.now()
          ),
          status:
            result.status === "CREDIT"
              ? "Completed with Credit"
              : result.status || "Processed",
          statusVariant:
            result.status === "CREDIT"
              ? ("secondary" as const)
              : ("default" as const),
        },
        customer: customerInfo,
        items,
        totals: {
          total: paymentAmount,
          currency: "USD",
        },
        sections,
        nextSteps: [
          `Payment of $${paymentAmount.toFixed(
            2
          )} has been successfully processed`,
          `Transaction ID: ${result.transaction_id || "Pending"}`,
          `Receipt Number: ${result.receipt_no || "Pending"}`,
          excessRefund > 0
            ? `Credit of $${excessRefund.toFixed(
                2
              )} has been applied to your account`
            : "",
          "Payment confirmation has been sent to your registered email",
          "Updated balance will reflect in your next statement",
          "You can view payment history in your account dashboard",
        ].filter(Boolean),
        notifications: {
          email: {
            enabled: true,
            address: "Email confirmation sent",
          },
          sms: {
            enabled: false,
            number: "",
          },
        },
        actions: {
          showBack: false,
          showAddNew: false,
          showEmail: true,
          showCopy: true,
          showDownload: true,
          showPrint: true,
          customActions: [],
        },
      };
    }
    return {
      company: {
      name: utility?.name || "Utility Company",
      address: utility?.addressMap?.address || 
               `${utility?.addressMap?.city || ''}, ${utility?.addressMap?.state || ''}`.trim() || 
               "Address not available",
      phone: utility?.contactNumber || "Contact not available",
      email: utility?.email || "Email not available",
    },

      receipt: {
        number: requestId,
        type: config.receiptType,
        date: new Date(
          result.createdDate
            ? convertDateString(result.createdDate)
            : Date.now()
        ),
        status: result.statusDisplay || "Created Successfully",
        statusVariant:
          result.status === 0 ? ("secondary" as const) : ("default" as const),
      },
      customer: customerInfo,
      items,
      totals: {
        total: serviceAmount,
        currency: "USD",
      },
      sections,
      nextSteps: generateNextSteps(result, requestId, requestType),
      notifications: {
        email: {
          enabled: !!formData.contactEmail,
          address: formData.contactEmail,
        },
        sms: {
          enabled: !!formData.contactPhone,
          number: formData.contactPhone,
        },
      },
      actions: {
        showBack: false,
        showAddNew: false,
        showEmail: true,
        showCopy: true,
        showDownload: true,
        showPrint: true,
        customActions: [],
      },
    };
  };

  // Helper function to convert date string format
  const convertDateString = (dateStr: string): string => {
    try {
      // Handle format like "26/Jun/2025"
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        // Convert month name to number
        const monthMap: Record<string, string> = {
          Jan: "01",
          Feb: "02",
          Mar: "03",
          Apr: "04",
          May: "05",
          Jun: "06",
          Jul: "07",
          Aug: "08",
          Sep: "09",
          Oct: "10",
          Nov: "11",
          Dec: "12",
        };

        const monthNum = monthMap[month] || "01";
        return `${year}-${monthNum}-${day.padStart(2, "0")}`;
      }
      return dateStr;
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  // Helper function for time slot display
  const getTimeSlotDisplay = (slot?: number): string => {
    const timeSlots: Record<number, string> = {
      0: "Morning (8 AM - 12 PM)",
      1: "Afternoon (12 PM - 5 PM)",
      2: "Evening (5 PM - 8 PM)",
    };
    return slot !== undefined ? timeSlots[slot] || "Flexible" : "Flexible";
  };

  // Helper function for payment service status
  const getPaymentServiceStatus = (status?: number): string => {
    return status === 0 ? "Pending" : "Processed";
  };

  // Helper function to generate next steps based on request type
  const generateNextSteps = (
    result: any,
    requestId: string,
    type: RequestType
  ): string[] => {
    const baseSteps = [
      `Your ${type} request has been logged with reference number ${requestId}`,

    ];

    // Add payment-related steps
    if (result.additionalData?.transactionStatus === 0) {
      baseSteps.push(
        "Payment is pending - you will receive payment instructions if required"
      );
    }

    // Type-specific next steps
    const typeSpecificSteps: Record<RequestType, string[]> = {
      service: [
        "A service representative will contact you within 2-3 business days",
        "Expected service completion: 3-5 business days for standard requests",
      ],
      complaint: [
        "Your complaint will be investigated within 24-48 hours",
        "You will be contacted by our resolution team within 3 business days",
        "Expected resolution time: 5-7 business days",
      ],
      disconnection: [
        "Disconnection will be processed on the scheduled date",
        "Final meter reading will be taken before disconnection",
        "Final bill will be generated within 7-10 business days",
      ],
      reconnection: [
        "Reconnection will be processed within 24-48 hours for standard requests",
        "Technical team will verify connection requirements",
        "Service will be restored once all requirements are met",
      ],
      transfer: [
        "Transfer request will be reviewed within 3-5 business days",
        "Property verification will be conducted",
        "Transfer will be completed within 7-10 business days after approval",
      ],
      payment: [
        "Payment has been recorded successfully",
        "You can track your payment status online or by calling customer service",
      ],
    };

    const commonSteps = [
      "You will receive an email confirmation within 24 hours",
      "You can track your request status online or by calling customer service",
    ];

    return [...baseSteps, ...commonSteps, ...typeSpecificSteps[type]];
  };

  const receiptConfig = mapToReceiptConfig(requestData);
  console.log("Receipt Config:", receiptConfig);

  // Success header component
  const SuccessHeader = () => (
    <div className="text-center space-y-4 mb-6">
      <div className="flex justify-center">
        <config.icon className={`h-16 w-16 ${config.iconColor}`} />
      </div>
      <div>
        <h1 className={`text-2xl font-bold ${config.titleColor}`}>
          {config.title}
        </h1>
        <p className="text-muted-foreground mt-2">{config.description}</p>
        {requestData.result?.requestNo && (
          <p className="text-lg font-semibold text-blue-600 mt-2">
            Request Number: {requestData.result.requestNo}
          </p>
        )}
      </div>
    </div>
  );
  // Custom action buttons component
  const ActionButtons = () => (
    <div className="flex flex-wrap justify-center gap-3 mb-6 print:hidden">
      <button
        onClick={() => navigate("/serviceRequest")}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Home className="mr-2 h-4 w-4" />
        Return to Dashboard
      </button>
      <button
        onClick={onAddNewRequest || (() => navigate(config.createRoute))}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Another Request
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SuccessHeader />
      <ActionButtons />
      <ConfigurableReceipt config={receiptConfig} />
    </div>
  );
}
