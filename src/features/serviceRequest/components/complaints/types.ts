export interface UtilitySupportRequest {
  id: number;
  remoteUtilityId: number;
  configurationCode: string;
  name: string;
  supportRequestType: string;
  supportRequestSubtype: string;
  extraData: {
    responseTime: number;
    severityLevel: number;
    resolutionTime: number;
    requiredApproval: boolean;
    acknowlegmentTime: number;
  };
}
export interface Consumer {
  id: number;
  consumerNo: string;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  isVip: boolean;
  category: string | null;
  subCategory: string | null;
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
      zipcode: string | null;
      premise: string;
      address: string;
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
      zipcode: string | null;
      premise: string;
      address: string;
      unit: string;
    };
  };
}

// Types
export interface Complaint {
  id: string;
  consumer: Consumer;
  remoteUtilityId: number;
  utilitySupportRequest: UtilitySupportRequest;
  requestNo: string;
  status: number;
  statusDisplay: string;
  requestType: string;
  requestDate: string;
  createdDate: string;
  createdUserRemoteName: string;
  consumerNo: string;
  firstName: string;
  lastName: string;
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
      zipcode: string;
      premise: string;
      address: string;
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
      zipcode: string;
      premise: string;
      address: string;
      unit: string;
    };
  };
  contactNumber: string;
  email: string;
  utilitySupportName: string;
  severityLevel: string;
  slaDueDate: string;
  timeRemaining: string;
  slaStatus: string;
  category: string;
  categoryDisplay?: string;
  subCategoryDisplay?: string;
  subCategory: string;
  supportRequestType?: string;
  supportRequestSubtype?: string;
  slaSummary: {
    slaDueDate: string;
    slaStatus: string;
    timeRemaining: string;
  };
  additionalData?: {
    closureRequirements?: {
      customerConfirmation?: boolean;
      qualityAssuranceDone?: boolean;
    }
  }
  file?: string;
}

export interface ComplaintAdditionalData {
  description: string;
  expectedResolution: string;
  additionalNotes?: string;
  utilitySupportRequestVersion?: string;
}

export interface CreateComplaint {
  consumer: number;
  remoteUtilityId: number;
  utilitySupportRequest: number;
  requestType: string;
  severityLevel?: string;
  utilitySupportName: string;
  source: number;
  requestDate: string; // Format: "YYYY-MM-DD"
  additionalData: ComplaintAdditionalData;
  file?: File | null;
}

export interface UpdateComplaintStatus {
  status: number;
  closeDate?: string;
  closureRemark?: string;
  additionalData?: {
    closureRequirements?: {
      customerConfirmation: boolean;
      qualityAssuranceDone: boolean;
    };
  };
}

export interface ComplaintConfiguration {
  id: number;
  requestType: string;
  requestTypeDisplay: string;
  remoteUtilityId: number;
  productCode: string[];
  name: string;
  configurationCode: string;
  supportRequestType: string;
  supportRequestSubtype: string;
  extraData: {
    responseTime: number;
    severityLevel: number;
    resolutionTime: number;
    acknowlegmentTime: number;
    fieldForceRequired: boolean;
    qualityAssuranceReview: string;
    consumerUpdateFrequency: number;
    consumerConfirmationRequired: string;
    severityLevelDisplay: string;
  };
  isActive: boolean;
  longDescription: string;
  version: string;
  createdDate: string;
  supportRequestTypeDisplay: string;
  supportRequestSubtypeDisplay: string;
}

export interface ComplaintStatusChoice {
  key: number;
  value: string;
}

export interface ComplaintFilters {
  remoteUtilityId?: number;
  requestType?: string;
  activeTab?: "Current" | "History";
  status?: number[];
  name?: string; // For filtering by name
  severityLevel?: string[];
  category?: string;
  slaStatus?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  page?: number;
  limit?: number;
  searchData?: string;
}

export interface PaginatedComplaintsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Complaint[];
}

export interface StepSaveData {
  stepIndex: number;
  stepData: any;
  requestId?: string;
}

export interface CustomerSearchResult {
  id: string;
  label: string;
  description: string;
  accountNumber: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  customerType: string;
  customerSince: string;
}
export interface SupportRequestConfig {
  name: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  requestType: string;
  utilityService: string | string[];
  code: string;
  hierarchyNames?: {
    serviceType: string;
    serviceSubType: string;
  };
  hierarchyCodes?: {
    serviceType: string;
    serviceSubType: string;
  };
}

export interface ComplaintCategoryFilters {
  remoteUtilityId: any;
  requestType: string;
}

export interface ComplaintSubCategoryFilters {
  remoteUtilityId: number;
  codeList: string;
  configLevel: string;
}
export interface PercentChange {
  pending: number;
  completedToday: number;
  rejectedToday: number;
}

export interface ConsumerComplaintSummary {
  totalPending: number;
  totalCompletedToday: number;
  totalRejectedToday: number;
  currentMonthSlaBreached: number;
  percentChange: PercentChange;
}
