// features/cx/transfer/types.ts

export interface ConsumerSearchResult {
  id: number;
  consumerNo: string;
  firstName: string;
  lastName: string;
  status: string;
  statusDisplay: string;
}

export interface ServiceAddress {
  region: string;
  country: string;
  state: string;
  county: string;
  zone: string;
  division: string;
  area: string;
  subArea: string;
  premise: string;
  zipcode: string;
  address: string;
  unit: string;
}

export interface ConsumerMetaData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  consumerNo: string;
  category: string;
  subCategory: string;
  categoryDisplay: string;
  subCategoryDisplay: string;
  serviceAddress: ServiceAddress;
  utilityServices: string[];
}

export interface ConsumerRelationChoice {
  key: number;
  value: string;
}

export interface DocumentInfo {
  id?: number;
  documentType: string;
  documentSubtype: string;
  documentTypeDisplay?: string;
  documentSubtypeDisplay?: string;
  fileKey?: string;
  file?: string | null;
  status: number;
}

export interface BillingAddressData {
  territoryType: string;
  territoryCode: string;
}

export interface ConsumerData {
  firstName: string;
  lastName: string;
  email: string | null;
  contactNumber: string | number;
  document?: DocumentInfo[];
  billingAddressData?: BillingAddressData[];
}

export interface TransferAdditionalData {
  oldConsumerData: ConsumerData;
  newConsumerData: ConsumerData;
  relationship: number;
  changeBillingAddress: boolean;
  transferOutstandingBalance: boolean;
  specialInstructions: string;
  utilitySupportRequestVersion: string;
}

export interface CreateTransferRequestPayload {
  requestDate: string;
  utilitySupportRequest: string;
  consumer: string;
  requestType: string;
  source: string;
  remoteUtilityId: string;
  additionalData: string; // JSON string
  file1?: File;
  file2?: File;
  [key: string]: any; // For additional files
}

export interface ConsumerAddress {
  service: Record<string, any>;
  billing: Record<string, any>;
}

export interface Consumer {
  id: number;
  consumerNo: string;
  email: string | null;
  firstName: string;
  lastName: string;
  contactNumber: string;
  isVip: boolean;
  category: string | null;
  subCategory: string | null;
  consumerAddress?: ConsumerAddress;
}

export interface TransferRequest {
  id: number;
  consumer: number | Consumer;
  remoteUtilityId: number;
  utilitySupportRequest: any;
  requestNo: string;
  status: number;
  statusDisplay: string;
  requestType: string;
  createdDate: string;
  createdUserRemoteName: string;
  requestDate: string;
  consumerNo?: string;
  firstName?: string;
  lastName?: string;
  serviceAddress?: {
    service: Record<string, any>;
    billing: Record<string, any>;
  };
  utilitySupportName?: string;
  priorityLevel?: number | null;
  acknowledgementTimeAchieved?: string;
  resolutionTimeAchieved?: string;
  additionalData?: any;
  relation?: string;
  financialDetails?: any;
}

export interface SLASummary {
  slaDueDate: string | null;
  timeRemaining: string | null;
  slaStatus: string | null;
}

export interface FinancialDetails {
  billId: number | null;
  lastPaymentDate: string | null;
  lastPayAmount: string;
  createdDate: string | null;
  dueDate: string | null;
  outstandingBalance: string;
  billMonth: string | null;
}

export interface TransferRequestDetail {
  id: number;
  consumer: Consumer;
  remoteUtilityId: number;
  utilitySupportRequest: Record<string, any>;
  requestNo: string;
  status: number;
  statusDisplay: string;
  requestType: string;
  additionalData: TransferAdditionalData;
  createdDate: string;
  createdUserRemoteName: string;
  lastModifiedDate: string;
  lastModifiedUserRemoteName: string;
  slaSummary: SLASummary;
  consumerRelationshipDisplay: string;
  financialDetails: FinancialDetails;
  acknowledgementTimeAchieved: string | null;
  resolutionTimeAchieved: string | null;
  documents: DocumentInfo[];
  files: Record<string, File>;
  billingAddressData: BillingAddressData[];
  assignedTo: string;
  addtionalData: any;
}

export interface UpdateTransferRequestPayload {
  documentId?: number;
  documentStatus?: number;
  status?: number;
  actualAcknowledgeTime?: string;
  closeDate?: string;
  closureRemark?: string;
}

export interface TransferSummary {
  pendingTransfers: number;
  completedThisMonth: number;
  averageProcessingTimeDays: number;
  successRate: number;
  percentChange: {
    pending: number;
    completed: number;
    averageProcessingTime: number;
    successRate: number;
  
  };
}

export interface TransferFilters {
  remoteUtilityId: number;
  requestType?: string;
  activeTab?: "Current" | "History";
  page?: number;
  limit?: number;
  searchData?: string;
  status?: string;
  name?: string;
  category?: string;
}

export interface ConsumerSearchFilters {
  remoteUtilityId: number;
  requestType: string;
  searchData: string;
}

export interface BulkTransferOperation {
  requestIds: number[];
  action:
    | "approve"
    | "reject"
    | "acknowledge"
    | "hold"
    | "resolve"
    | "complete";
  remarks?: string;
  closeDate?: string;
}

export interface TransferWorkflowData {
  transferRequest: TransferRequestDetail;
  documentsVerified: boolean;
  approvalRequired: boolean;
  billingAddressChanged: boolean;
  outstandingBalanceTransferred: boolean;
  currentStep:
    | "request"
    | "document_verification"
    | "approval"
    | "transfer"
    | "completed";
}

export interface DocumentUpdatePayload {
  documentId: number;
  documentStatus: number; // 0: pending, 1: approved, 2: rejected
}

export interface TransferFormData {
  // Basic request info
  requestDate: string;
  utilitySupportRequest: string;
  consumer: string;
  requestType: string;
  source: string;
  remoteUtilityId: string;

  // Old consumer data
  oldConsumerFirstName: string;
  oldConsumerLastName: string;
  oldConsumerEmail: string;
  oldConsumerContactNumber: string;

  // New consumer data
  newConsumerFirstName: string;
  newConsumerLastName: string;
  newConsumerEmail: string;
  newConsumerContactNumber: string;

  // Transfer options
  relationship: number;
  changeBillingAddress: boolean;
  transferOutstandingBalance: boolean;
  specialInstructions: string;
  utilitySupportRequestVersion: string;

  // Documents
  documents: DocumentInfo[];
  files: Record<string, File>;

  // Billing address (when changeBillingAddress is true)
  billingAddressData: BillingAddressData[];
}

// Define a table-specific interface for the transformed data
export interface TransferTableItem {
  id: string;
  
  transferId: string;
  customerName: string;
  accountNumber: string;
  transferType: string;
  requestedDate: string;
  status: string;
  assignedTo: string;
  financialStatus: string;
  priority: string;
}
