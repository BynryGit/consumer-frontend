export interface ServiceRequest {
  id: string;
  requestId: string;
  serviceType: string;
  customerName: string;
  accountNumber: string;
  serviceAddress: string;
  status:
    | "draft"
    | "submitted"
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "cancelled"
    | "in_progress"
    | "on_hold";
  createdDate: string;
  createdBy: string;
  approvalDate?: string;
  approver?: string;
  paymentStatus: "paid" | "unpaid" | "partial";
  estimatedFee: number;

  // Additional properties needed by ServiceRequestMapper
  priority?: "High" | "Medium" | "Low";
  lastUpdatedOn?: string;
  lastUpdatedBy?: string;
  scheduledDate?: string;
  completionDate?: string;
  requestDetails?: string;
  supportRequestType?: string;
  supportRequestSubtype?: string;

  // Customer information
  customer?: {
    phone?: string;
    email?: string;
    category?: string;
    subCategory?: string;
    billingAddress?: string;
    specialConditions?: string;
  };

  // Service details
  serviceDetails?: {
    accessInstructions?: string;
  };

  // SLA information
  sla?: {
    status: string;
    dueDate: string;
    remaining: string;
  };
}

// Payment Extra Data Types
export interface ChequePaymentExtraData {
  cheque_no: number;
  bank_name: string;
  cheque_date: string;
  account_holder_name: string;
  routing_number: string;
  bank_account_number: string;
  bill_amount: number;
  payment_amount: number;
  outstanding_amount: number;
  excess_refund: number;
}

export interface OnlinePaymentExtraData {
  reference_no: string;
  bill_amount: number;
  payment_amount: number;
  outstanding_amount: number;
  excess_refund: number;
}

export interface CashPaymentExtraData {
  bill_amount: number;
  payment_amount: number;
  outstanding_amount: number;
  excess_refund: number;
}

// Payment Data Types
export interface PaymentData {
  amount: number;
  payment_mode: "Cheque#4" | "Online#1" | "Cash#2";
  payment_date: string;
  remote_utility_id: number;
  consumer: number;
  status: "CREDIT" | "DEBIT";
  payment_pay_type: number;
  payment_type: string;
  source: number;
  extra_data:
    | ChequePaymentExtraData
    | OnlinePaymentExtraData
    | CashPaymentExtraData;
}

// Additional Data Types
export interface AdditionalData {
  transaction_status: number;
  payment_service_status: number;
  preferred_time_slot: number;
  additional_instruction: string;
  utility_support_request_version: string;
}

// Main Service Request Payload Type
export interface ServiceRequestPayload {
  remote_utility_id: number;
  request_type: "Service";
  source: number;
  consumer: number;
  utility_support_request: number;
  request_date: string;
  additional_data: AdditionalData;
  payment_data?: PaymentData; // Optional - only when payment is required
}

// Updated ServiceRequestFormData to support all scenarios
export interface ServiceRequestFormData {
  // Customer Information
  accountNumber: string;
  customerName: string;
  serviceAddress: string;
  contactPhone: string;
  contactEmail?: string;

  // Service Details
  serviceCategory: string;
  serviceType: string;
  serviceUtilityService: string;
  serviceName: string;
  serviceId?: string;

  // Additional Options
  additionalInstructions?: string;
  scheduledDate?: string;
  preferredTimeSlot?: string;

  // Payment Information
  paymentMethod: "Pay Now" | "Pay Later" | "Add to Bill" | "Invoice";
  acceptTerms: boolean;

  // Extended fields to support the payload structure
  remote_utility_id?: number;
  request_type?: "Service";
  source?: number;
  consumer?: number;
  utility_support_request?: number;
  request_date?: string;

  // Additional data fields
  transaction_status?: number;
  payment_service_status?: number;
  preferred_time_slot?: number;
  utility_support_request_version?: string;

  // Payment data fields
  payment_amount?: number;
  payment_mode?: "Cheque#4" | "Online#1" | "Cash#2";
  payment_date?: string;
  payment_status?: "CREDIT" | "DEBIT";
  payment_pay_type?: number;
  payment_type?: string;

  // Cheque specific fields
  cheque_no?: number;
  bank_name?: string;
  cheque_date?: string;
  account_holder_name?: string;
  routing_number?: string;
  bank_account_number?: string;

  // Online specific fields
  reference_no?: string;

  // Common payment fields
  bill_amount?: number;
  outstanding_amount?: number;
  excess_refund?: number;
}

export interface SelectedService {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
  category: string;
}

export interface PaymentDetails {
  paymentOption: string;
  paymentMethod: string;
  // Cash details
  cashAmount?: string;
  cashReceived?: string;
  cashDate?: string;
  // Online details
  onlineAmount?: string;
  onlineDate?: string;
  onlineReference?: string;
  // Cheque details
  chequeNumber?: string;
  bankName?: string;
  chequeDate?: string;
  accountHolderName?: string;
  bankAccountNumber?: string;
  routingNumber?: string;
  chequeAmount?: string;
}

export interface ServiceRequestState {
  formData: Partial<ServiceRequestFormData>;
  selectedService: SelectedService | null;
  paymentDetails: PaymentDetails;
  isAccountLoaded: boolean;
}

// // Utility functions to transform form data to payload
// export const createServiceRequestPayload = (
//   formData: ServiceRequestFormData,
//   utilitySupportRequestId: number,
//   remoteUtilityId: number
// ): any => {
//   const basePayload = {
//     remoteUtilityId: remoteUtilityId,
//     requestType: "Service",
//     source: 0, // Default source
//     consumer: formData.consumer || 0, // Use consumer ID from form data
//     utilitySupportRequest: utilitySupportRequestId,
//     requestDate:
//       formData.request_date || new Date().toISOString().split("T")[0],
//     additionalData: {
//       transactionStatus: formData.transaction_status || 0,
//       paymentServiceStatus: formData.payment_service_status || 0,
//       preferredTimeSlot: formData.preferred_time_slot || 0,
//       additionalInstruction: formData.additionalInstructions || "",
//       utilitySupportRequestVersion:
//         formData.utility_support_request_version || "Version-1",
//     },
//   };

//   // Add payment data if payment is required
//   if (formData.paymentMethod === "Pay Now" && formData.payment_mode) {
//     const paymentData = {
//       amount: formData.payment_amount || 0,
//       paymentMode: formData.payment_mode,
//       paymentDate: formData.payment_date || new Date().toISOString(),
//       remoteUtilityId: remoteUtilityId,
//       consumer: formData.consumer || 0, // Use consumer ID from form data
//       status: "CREDIT",
//       paymentPayType: formData.payment_pay_type || 5,
//       paymentType: formData.payment_type || "Service#4",
//       source: 0,
//       extraData: createPaymentExtraData(formData),
//     };

//     return {
//       ...basePayload,
//       paymentData,
//     };
//   }

//   return basePayload;
// };

const createPaymentExtraData = (formData: ServiceRequestFormData): any => {
  const commonFields = {
    billAmount: formData.bill_amount || 0,
    paymentAmount: formData.payment_amount || 0,
    outstandingAmount: formData.outstanding_amount || 0,
    excessRefund: formData.excess_refund || 0,
  };

  switch (formData.payment_mode) {
    case "Cheque#4":
      return {
        ...commonFields,
        chequeNo: formData.cheque_no || 0,
        bankName: formData.bank_name || "",
        chequeDate: formData.cheque_date || new Date().toISOString(),
        accountHolderName: formData.account_holder_name || "",
        routingNumber: formData.routing_number || "",
        bankAccountNumber: formData.bank_account_number || "",
      };

    case "Online#1":
      return {
        ...commonFields,
        referenceNo: formData.reference_no || "",
      };

    case "Cash#2":
      return commonFields;

    default:
      return commonFields;
  }
};

// Helper function to determine if payment data should be included
export const shouldIncludePaymentData = (
  formData: ServiceRequestFormData
): boolean => {
  return formData.paymentMethod === "Pay Now" && !!formData.payment_mode;
};

// Helper function to validate payment data based on payment mode
export const validatePaymentData = (
  formData: ServiceRequestFormData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (formData.paymentMethod === "Pay Now") {
    if (!formData.payment_mode) {
      errors.push("Payment mode is required when paying now");
    }

    if (!formData.payment_amount || formData.payment_amount <= 0) {
      errors.push("Payment amount is required and must be greater than 0");
    }

    // Validate payment mode specific fields
    switch (formData.payment_mode) {
      case "Cheque#4":
        if (!formData.cheque_no) errors.push("Cheque number is required");
        if (!formData.bank_name) errors.push("Bank name is required");
        if (!formData.account_holder_name)
          errors.push("Account holder name is required");
        if (!formData.bank_account_number)
          errors.push("Bank account number is required");
        break;

      case "Online#1":
        if (!formData.reference_no) errors.push("Reference number is required");
        break;

      case "Cash#2":
        // No additional validation needed for cash
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Types

export interface UtilityRequestConfiguration {
  id: number;
  requestType: string;
  requestTypeDisplay: string;
  remoteUtilityId: number;
  productCode: string[];
  name: string;
  configurationCode: string | null;
  supportRequestType: string;
  supportRequestSubtype: string;
  extraData: {
    estTotalCost: number;
    serviceCharge: number;
    needServiceOrder: string;
    paymentServiceStatus: number;
    priorityLevel: number;
    severityLevel: number;
  };
  isActive: boolean;
  longDescription: string | null;
  version: string;
  createdDate: string;
  supportRequestTypeDisplay: string;
  supportRequestSubtypeDisplay: string;
}

export interface TransactionStatusChoice {
  key: number;
  value: string;
}

export interface NoteTypeChoice {
  key: number;
  value: string;
}

export interface ServiceRequestItem {
  id: number;
  consumer: number;
  remoteUtilityId: number;
  utilitySupportRequest: any;
  requestNo: string;
  status: number;
  statusDisplay: string;
  requestType: string;
  createdDate: string;
  createdUserRemoteName: string;
  requestDate: string;
  consumerNo: string;
  firstName: string;
  lastName: string;
  supportRequestType?: string;
  supportRequestSubtype?: string;
  serviceAddress: {
    service: {
      hierarchyNames: {
        region: string;
        country: string;
        state: string;
        county: string;
        zone: string;
        division: string;
        area: string;
        subArea: string;
        premise: string;
      };
      premise: string;
      zipcode: string;
      unit: string;
    };
    billing: {
      hierarchyNames: {
        region: string;
        country: string;
        state: string;
        county: string;
        zone: string;
        division: string;
        area: string;
        subArea: string;
        premise: string;
      };
      premise: string;
      zipcode: string;
      unit: string;
    };
  };
  utilitySupportName: string;
}

export interface ServiceRequestListResponse {
  pageNumber: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceRequestItem[];
}

export interface ServiceRequestDetail {
  assignedTo: string;
  id: number;
  consumer: {
    id: number;
    consumerNo: string;
    email: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    isVip: boolean;
    category: string | null;
    subCategory: string | null;
    categoryDisplay: string | null;
    subCategoryDisplay: string | null;
    consumerAddress: {
      service: {
        hierarchyNames: {
          region: string;
          country: string;
          state: string;
          county: string;
          zone: string;
          division: string;
          area: string;
          subArea: string;
          premise: string;
        };
        premise: string;
        zipcode: string;
        unit: string;
      };
      billing: {
        hierarchyNames: {
          region: string;
          country: string;
          state: string;
          county: string;
          zone: string;
          division: string;
          area: string;
          subArea: string;
          premise: string;
        };
        premise: string;
        zipcode: string;
        unit: string;
      };
    };
  };
  remoteUtilityId: number;
  utilitySupportRequest: UtilityRequestConfiguration;
  requestNo: string;
  status: number;
  statusDisplay: string;
  requestType: string;
  additionalData: {
    estTotalCost: number;
    transactionStatus: number;
    transactionStatusDisplay: string;
    requiresApproval: boolean;
    scheduleDate: string;
    preferredTimeSlot: string;
    additionalInstruction: string;
    closureRequirements?: {
      documentationUpload?: boolean;
      customerNotification?: boolean;
      qualityCheckPending?: boolean;
      serviceCompletionVerification?: boolean;
    };
  };
  categoryDisplay: string;
  subCategoryDisplay: string;
  createdDate: string;
  createdUserRemoteName: string;
  lastModifiedDate: string;
  lastModifiedUserRemoteName: string;
  slaSummary: {
    slaDueDate: string | null;
    timeRemaining: string;
    slaStatus: string;
  };
  priorityLevelDisplay: string;
}

export interface ServiceRequestSummary {
  totalPending: number;
  totalCompletedToday: number;
  totalRejectedToday: number;
  totalCompleted: number;
  percentChange: {
    pending: number;
    completedToday: number;
    rejectedToday: number;
    totalCompleted: number;
  };
}

export interface ServiceRequestNote {
  note: string;
  noteType: number;
  createdDate: string;
  isActive: boolean;
  createdBy: string;
}

export interface CreateServiceRequestPayload {
  remoteUtilityId: number;
  requestType: string;
  source: number;
  consumer: number;
  utilitySupportRequest: number;
  requestDate: string;
  additionalData: {
    transactionStatus: number;
    paymentServiceStatus: number;
    preferredTimeSlot: number;
    additionalInstruction: string;
    utilitySupportRequestVersion: string;
  };
  paymentData: {
    amount: number;
    paymentMode: string;
    paymentDate: string;
    remoteUtilityId: number;
    consumer: number;
    status: string;
    paymentPayType: number;
    paymentType: string;
    source: number;
    extraData: {
      chequeNo: number;
      bankName: string;
      chequeDate: string;
      accountHolderName: string;
      routingNumber: string;
      bankAccountNumber: string;
      billAmount: number;
      paymentAmount: number;
      outstandingAmount: number;
      excessRefund: number;
    };
  };
}

export interface UpdateServiceRequestPayload {
  status: number;
  closeDate?: string;
  closureRemark?: string;
  additionalData?: {
    closureRequirements?: {
      [key: string]: boolean;
    };
  };
}

export interface ServiceRequestFilters {
  remoteUtilityId?: number;
  requestType?: string;
  activeTab?: "Current" | "History";
  page?: number;
  limit?: number;
  searchData?: string;
  status?: string;
  name?: string;
}

export interface NoteFilters {
  remoteUtilityId?: number;
  requestId?: string;
  noteType?: "INTERNAL" | "CUSTOMER";
}

export interface UtilityConfigFilters {
  remoteUtilityId?: number;
  requestType?: string;
  disablePagination?: boolean;
  productCode?: string[];
  searchData?: string;
}
