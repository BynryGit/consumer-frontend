

// Add your feature-specific types here
export interface serviceRequestState {
  // Define your state types
  
}
import { ApiCustomField } from "@shared/utils/customFormMaker";

export interface TerritoryLocation {
  region?: string;
  country?: string;
  state?: string;
  county?: string;
  zone?: string;
  division?: string;
  area?: string;
  subArea?: string;
  premise?: string;
  address?: string;
  zipCode?: string;
  unit?: string;
}

export interface AddressMap {
  street: string;
  addressLine: string;
}

export interface AdditionalData {
  openingBalance?: number;
  paymentReceived?: number;
  kyc?: string;
  payment?: string;
  secondaryConsumer?: SecondaryConsumer;
  serviceAvailability?: string;
  applicantInformation?: string;
}

export interface ConsumptionDetail {
  [key: string]: number; // e.g., "Water": 206.0
}

export interface ExtraData {
  remark: string;
  billAmount: number;
  cashRecieved: number;
  excessRefund: number;
  paymentAmount: number;
  outstandingAmount: number;
}

export interface PaymentData {
  id: number;
  transactionId: string;
  amount: string;
  paymentMode: string;
  paymentChannel?: string | null;
  paymentType: string;
  paymentSubtype?: string | null;
  paymentPayType: number;
  paymentPayTypeDisplay: string;
  paymentDate: string;
  settlementDate?: string | null;
  status: string;
  isActive: boolean;
  isDeleted: boolean;
  isPaymentConsiled: boolean;
  consumer: number;
  createdDate: string;
  remoteBillId?: number | null;
  remoteUtilityId: number;
  extraData: ExtraData;
  consumerSupportRequest?: number | null;
  paymentModeDisplay: string;
}


export interface TerritoryData {
  service: TerritoryLocation;
  billing: TerritoryLocation;
}

export interface RateDetail {
  rate: number;
  endTime: number;
  startTime: number;
}

export interface Rate {
  id: number;
  rateName: string;
  remoteUtilityId: number;
  effectiveDate: string;
  taxRate?: number | null;
  country?: string | null;
  rateType: number;
  currency: string;
  version: string;
  basisType?: string | null;
  utilityService?: string | null;
  currencyDisplay: string;
  rate: RateDetail[];
  paymentFrequency?: number | null;
  isTaxable: boolean;
  isActive: boolean;
  rateTypeDisplay: string;
  expiryDate: string;
  createdDate: string;
}

export interface UtilityServiceRate {
  rate: Rate;
  type: number;
  version: string;
  avgConsumption: string;
  estimatedAvgBillAmount: string;
  estimatedAvgConsumption: string;
  isMeterRequired: boolean;
  utilityUnit: string;
}

export interface CommonCharge {
  fee: string;
  basis: string;
  frequency: string;
  operation: string;
  chargeLabel: string;
  creditPeriod: string;
  utilityService: string;
}

export interface ExtraCharges {
  utilityServiceCharges: { [key: string]: any };
  commonCharges: { [key: string]: CommonCharge };
}

export interface UtilityServiceData {
  rate: { [key: string]: UtilityServiceRate };
  extraCharges: ExtraCharges;
}

export interface PlanDetails {
  id: number;
  planName: string;
  remoteUtilityId: number;
  shortName: string;
  description?: string | null;
  category: string;
  subcategory: string;
  utilityService: string[];
  validity: string;
  utilityUnit?: string | null;
  tax: number;
  taxType: number;
  taxTypeDisplay: string;
  startDate?: string | null;
  depositAmount?: number | null;
  contract: number;
  latePaymentAmount?: number | null;
  surcharge?: number | null;
  status: number;
  createdDate: string;
  creditPeriod?: number | null;
  billingFrequency: number;
  utilityServiceData: UtilityServiceData;
  isActive: boolean;
  statusDisplay: string;
  billingFrequencyDisplay: string;
  categoryCode: string;
  subCategoryCode: string;
  showSlabRates: boolean;
}

export interface AddressDataLocation {
  ZIPCODE: string;
  STATE: string;
  CITY: string;
  ZONE: string;
  DIVISION: string;
  AREA: string;
  SUBAREA: string;
  PREMISE: string;
  ADDRESS: string;
  UNIT: string;
}

export interface AddressData {
  service: AddressDataLocation;
  billing: AddressDataLocation;
}

export interface Consumer {
  id: number;
  consumerNo: string;
  remoteUtilityId: number;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  alternateContactNumber?: string | null;
  status: number;
  statusDisplay: string;
  additionalData?: AdditionalData;
  addressMap?: AddressMap | null;
  remotePlanId: number;
  source: number;
  sourceDisplay: string;
  remarks: string;
  ownership?: number;
  ownershipDisplay?: string;
  registrationDate?: string | null;
  approveDate?: string | null;
  connectDate?: string | null;
  activateDate?: string | null;
  isVip: boolean;
  isAutoPay: boolean;
  ssn?: string | null;
  isEBill: boolean;
  isPaperedBill: boolean;
  createdDate: string;
  createdUserRemoteName?: string | null;
  lastModifiedUserRemoteName?: string | null;
  subCategoryDisplay?: string | null;
  categoryDisplay?: string | null;
  subCategory?: string | null;
  category?: string | null;
  territoryData?: TerritoryData;
  consumerMappingData?: MeterData[];
  meters?: number[];
  billData?: BillData;
  planDetails?: PlanDetails;
  document?: Document[];
  addressData?: AddressData;
}

export interface Alert {
  type: 'payment' | 'service' | 'maintenance' | 'warning';
  message: string;
  severity: 'info' | 'warning' | 'error';
  createdAt?: string;
  id?: string;
}

export interface Meter {
  meterNo: string;
  deviceNo: string;
  meterType: string;
  assignmentDate: string;
  installationDate: string;
  model: string;
  readingStatus: 'Active' | 'Inactive' | 'Maintenance';
  lastReading: string;
  lastReadingDate: string;
  readings: MeterReading[];
  location?: string;
  serialNumber?: string;
}

export interface UtilityConnection {
  id: number;
  type: 'Water' | 'Electricity' | 'Gas' | 'Sewage';
  status: string;
  isActive: boolean;
  remoteMeterIds?: number[];
  connectionDate?: string;
  meters?: Meter[];
  tariffPlan?: string;
  connectionCapacity?: string;
}


export interface PaymentRecord {
  id: number;
  transactionId?: string | null;
  amount: string;
  paymentMode: string;
  paymentChannel?: string | null;
  paymentType: string;
  paymentSubtype?: string | null;
  paymentDate: string;
  paymentPayType: number;
  paymentPayTypeDisplay: string;
  settlementDate?: string | null;
  status: string;
  statusDisplay: string;
  isActive: boolean;
  isDeleted: boolean;
  isPaymentConsiled: boolean;
  createdDate: string;
  remoteBillId?: number | null;
  remoteUtilityId: number;
  createdUserRemoteId: number;
  createdUserRemoteName: string;
  lastModifiedUserRemoteName: string;
  lastModifiedUserRemoteId: number;
  consumer: {
    id: number;
    consumerNo: string;
    status: number;
    statusDisplay: string;
    remoteUtilityId: number;
    remotePlanId: number;
    email: string;
    firstName: string;
    lastName: string;
    consumerName: string;
    contactNumber: string;
    addressMap?: {
      street: string;
      addressLine: string;
    };
    premiseCode?: string | null;
    additionalData?: {
      openingBalance: number;
      paymentReceived: number;
    };
    consumerFullName: string;
  };
}

export interface BillingService {
  serviceType: 'Water' | 'Electricity' | 'Gas' | 'Sewage' | 'Waste';
  consumption: number;
  rate: number;
  amount: number;
  unit: string;
}

export interface BillingTax {
  name: string;
  rate: number;
  amount: number;
}

export interface BillingDiscount {
  name: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  amount: number;
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

// Filter interfaces
export interface DateRange {
  start: string;
  end: string;
}

export interface ConsumerFilters {
  page?: number;
  limit?: number;
  status?: number[];
  category?: string;
  date_range?: DateRange;
  remoteUtilityId?: number;
  search_data?: string;
}

export interface FinancialFilters {
  page?: number;
  limit?: number;
  date_range?: DateRange;
  payment_method?: string;
  status?: string;
  remote_utility_id?: number;
}

export interface ComplaintFilters {
  page?: number;
  limit?: number;
  status?: number[];
  severity_level?: string[];
  sla_status?: string[];
  date_range?: DateRange;
  name?: string;
  query?: string;
  sort_field?: string;
  sort_direction?: string;
  remote_utility_id?: number;
}

export interface DocumentFilters {
  page?: number;
  limit?: number;
  document_type?: string;
  category?: string;
  date_range?: DateRange;
  query?: string;
  sort_field?: string;
  sort_direction?: string;
  remote_utility_id?: number;
}




// Response types
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
  page: number;
  result: T[];
  limit: number;
  total_pages: number;
}

export interface ConsumptionData {
  [key: string]: {
    consumption: number;
  };
}

export interface RelationshipInsights {
  accountAgeMonths: number;
  serviceRequestCount: number;
  complaintRequestCount: number;
  communicationPreference: string;
}

export interface MeterReading {
  id: number;
  productCode: string;
  status: string | null;
  meter: {
    id: number;
    remoteUtilityId: number;
    meterNumber: string;
    status: string;
    physicalStatus: string;
    productCode: string;
    category: string;
    subCategory: string;
    meterTypeDisplay: string;
    meterType: number;
    deviceNo: string;
    meterMake: string;
    area: string;
    subArea: string;
    premise: string;
    floor: string | null;
    floorUnit: string | null;
    currentReadingDate: string;
    currentReading: number;
    notes: string | null;
    long: string | null;
    lat: string | null;
    installedOn: string;
    averageConsumption: number | null;
    file: string | null;
    remark: string | null;
    isActive: boolean;
    readingStatus: string;
    disposeReason: string;
    readingOem: string | null;
    meterModel: string | null;
    ownership: number;
    ownershipDisplay: string;
    parentMeter: string | null;
    isSensor: boolean;
    meterSize: string | null;
    meterDials: number | null;
  };
  updatedOn: string;
  meterReader: string | null;
  remarks: {
    hold: string;
    reject: string;
    approve: string;
  };
  jobCard: {
    id: number;
    remoteUtilityId: number;
    meterRun: string | null;
    remoteConsumerId: string;
    consumerName: string;
    meterReader: string | null;
    status: string;
    isSpotBill: boolean;
    consumerNumber: string;
    meterNumber: string;
    contactNumber: string;
    createdDate: string;
    sensorData: any | null;
  };
  meterReading: number;
  readingImage: string | null;
  comments: string | null;
  ruleStatus: string;
  suspiciousActivity: string;
  readingSource: string;
  isActive: boolean;
  createdDate: string;
  reasonCode: string | null;
  isMeterCheck: boolean;
  isReadingCheck: boolean;
  lastModifiedUserRemoteName: string;
  lastModifiedUserRemoteId: number;
  time: string;
}

export interface ServiceRequest {
  id: number;
  requestNo: string;
  requestType: string;
  requestTypeDisplay: string;
  requestDate: string;
  status: number;
  statusDisplay: string;
  source: number;
  sourceDisplay: string;
  consumerRemark: string;
  closureRemark?: string | null;
  createdDate: string;
  closeDate?: string | null;
  days: number;
  remoteUtilityId: number;
  remoteWorkorderId?: number;
  payableAmount?: number | null;
  additionalData: Record<string, any>;
  remarks: {
    hold: string;
    reject: string;
    approve: string;
    connect: string;
    activate: string;
    completed: string;
    approveHold: string;
    connectHold: string;
    approveRejected: string;
    connectRejected: string;
  };  
  createdUserRemoteName: string;
  lastModifiedUserRemoteName: string;
  consumerUtilityMapping: Array<UtilityConnection>;
  consumer: Consumer;
}

export interface ServiceOrder {
  id: string;
  date: string;
  type: 'Meter Reading' | 'Maintenance' | 'Installation' | 'Repair';
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTo?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedDuration?: string;
  actualDuration?: string;
  cost?: number;
  materials?: string[];
}

export interface UtilitySupportRequest {
    id: number;
    requestType: string;
    requestTypeDisplay: string;
    remoteUtilityId: number;
    productCode: string[];
    name: string;
    supportRequestType: string;
    supportRequestSubtype: string;
    extraData: any | null;
    currency: string;
    currencyDisplay: string;
    rate: number | null;
    numberOfDaysToSolve: number | null;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
    createdDate: string;
    createdUserRemoteId: number;
    shortDescription: string;
    longDescription: string;
    remoteSopId: number | null;
    createdUserRemoteName: string;
    lastModifiedUserRemoteName: string;
  };

export interface Remarks {
  hold: string;
  reject: string;
  approve: string;
  connect: string;
  activate: string;
  completed: string;
  approveHold: string;
  connectHold: string;
  approveRejected: string;
  connectRejected: string;
}

export interface Complaint {
  id: number;
  consumer: Consumer;
  remoteUtilityId: number;
  utilitySupportRequest: UtilitySupportRequest;
  requestNo: string;
  status: number;
  statusDisplay: string;
  requestType: string;
  requestTypeDisplay: string;
  source: number;
  sourceDisplay: string;
  consumerRemark: string;
  closureRemark: string | null;
  createdDate: string;
  days: number;
  closeDate: string | null;
  additionalData: Record<string, any>;
  remarks: Remarks;
  createdUserRemoteName: string | null;
  lastModifiedUserRemoteName: string | null;
  requestDate: string;
  remoteWorkorderId: number | null;
  payableAmount: number | null;
  consumerUtilityMapping: Array<UtilityConnection>;
}

export interface Document {
  id: number;
  consumerRole: string;
  consumer: number;
  documentType: string;
  documentSubtype: string;
  documentTypeName: string;
  documentSubtypeName: string;
  file: string;
  isActive: boolean;
  status: number;
  statusDisplay: string;
  createdDate: string;
  lastModifiedDate: string;
  createdUserRemoteName: string | null;
  lastModifiedUserRemoteName: string | null;
}


export interface FinancialSummary {
  currentBalance: number;
  lastPaymentAmount: number;
  lastPaymentDate: string;
  nextPaymentDue: string;
  outstandingAmount: number;
  paymentHistory: PaymentData[];
  billingHistory: BillData[];
  paymentMethods: PaymentMethod[];
  creditLimit?: number;
  securityDeposit?: number;
}

export interface BillData {
  id: number;
  createdDate: string;
  remoteConsumerNumber: string;
  billMonth: string;
  invoiceNo: string;
  dueDate: string;
  billPeriod: string;
  outstandingBalance: string;
  consumerId?: number | null;
  firstName: string;
  lastName: string;
  contactNumber: string;
  totalAmountPayable: number;
  lastPaymentDate: string;
  lastPayAmount: string;
  consumptionDetails: ConsumptionDetail[];
  paymentModeDisplay: string;
  paymentData: PaymentData[];
  billCycleName: string;
  usageChangePercentage: string;
  averageMonthlyUsage: string;
}

export interface MeterDetails {
  id: number;
  meterNumber: string;
  deviceNo: string;
  productCode: string;
  meterType: number;
  premise: string;
  meterModel: string;
  assignmentDate: string;
  currentReadingDate: string;
  meterTypeDisplay: string;
  meterDials?: number | null;
  physicalStatus: number;
  status: number;
  physicalStatusDisplay: string;
  statusDisplay: string;
  readingStatusDisplay: string;
  lat: string;
  long: string;
  routeName: string;
  cycleName: string;
}

export interface MeterData {
  consumer: number;
  utilityService: string;
  remoteMeterId: number;
  status: number;
  statusDisplay: string;
  isActive: boolean;
  meterDetails: MeterDetails;
}


export interface cxConsumer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  remote_utility_id?: string;
  premise?: string;
  category?: string;
  sub_category?: string;
  consumer_relation?: string;
  plan_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API-specific interfaces for the POST endpoint
export interface PrimaryConsumer {
  firstName: string;
  lastName: string;
  email: string;
  isVip: boolean;
  contactNumber: string;
  category: string;
  subCategory: string;
}

export interface SecondaryConsumer {
  firstName: string;
  lastName: string;
  email?: string;
  contactNumber: string;
}

export interface ConsumerDetails {
  primaryConsumer: PrimaryConsumer;
  secondaryConsumer?: SecondaryConsumer;
}

// Document KYC interface for document uploads
export interface PrimaryConsumerKyc {
  id: null | string;
  document_type: string;
  document_subtype: string;
  file_key: string;
  consumer_role: "Primary" | "Secondary";
}

// API Payload for creating consumer (matches your API structure)
export interface CreateConsumerPayload {
  consumer_details: ConsumerDetails;
  remote_utility_id: string;
  source: string;
}

// API Response interface
export interface CreateConsumerResponse {
  result: cxConsumer;
  data: any;
  id: any;
  message?: string;
}

export interface editConsumerPayload {
  service_address_data?: TerritoryLocation;
  billing_address_data?: TerritoryLocation;
  consumer_details?: ConsumerDetails;
  remote_utility_id?: number;
  primary_consumer_kyc?: PrimaryConsumerKyc;
  file1?: File;
  source?: string;
}



// API Response interface
export interface editConsumerResponse {
  result: any;
  data: any;
  id: any;
  consumer: cxConsumer; // The response returns a simplified consumer object
  message?: string;
}

// Form data interface (for your form component)
export interface ConsumerFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  ssn: string;
  category: string;
  subCategory: string;
  isVip: boolean;
  vipLevel?: string;
  hasSecondary: boolean;
  secondaryFirstName?: string;
  secondaryLastName?: string;
  secondaryPhoneNumber?: string;
  secondaryEmail?: string;
  secondarySSN?: string;
  secondaryRelationship?: string;
}

// Updated UpdateConsumerPayload to support both regular updates and document uploads
export interface UpdateConsumerPayload {
  consumer_details?: Partial<ConsumerDetails>;
  remote_utility_id?: string;
  source?: string;
  consumerStatus?: string;
  // For document uploads - this will be a JSON string when sent as FormData
  primary_consumer_kyc?: PrimaryConsumerKyc[];
  // For FormData support - the actual payload can be FormData
  [key: string]: any;
}

export interface UpdateConsumerResponse {
  consumer: cxConsumer;
  message?: string;
}

export interface ConsumerSummary {
  totalActiveConsumers: number;
  newActiveConsumers: number;
  totalCompleted: number;
  totalRejected: number;
  activeAccounts: number;
  inactiveAccounts: number;
  totalConsumers: number;
  activeConsumers: number;
  inactiveConsumers: number;
  temporarilyDisconnected: number;
  activePercentage: number;
  inactivePercentage: number;
  temporarilyDisconnectedPercentage: number;
}


export interface CategoryOption {
  name: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  code: string;
}

export interface SubcategoryOption {
  name: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  description: string | null;
  code: string;
  hierarchyNames: {
    category: string;
    subCategory: string;
  };
  hierarchyCodes: {
    category: string;
    subCategory: string;
  };
}

export interface Premise  {
  name: string;
  latitude: string;
  isActive: boolean;
  longitude: string;
  createdBy: string;
  totalUnits: string;
  createdDate: string;
  code: string;
  childCount: number;
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
  hierarchy_codes: {
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
  installedMeterCount: number;
  billedUnitCount: number;
}

export interface Plan {
  id: number,
  planName: string;
  remoteUtilityId: number;
  shortName: string;
  description: string;
  category: string;
  subcategory: string;
  utilityService: string;
  validity: string;
  utilityUnit: string;
  tax: number;
  processingFees: number;
  connectionFee: number;
  securityDeposit: number;
  taxType: number;
  taxTypeDisplay: string;
  depositAmount: number;
  contract: number;
  latePaymentAmount: number;
  surcharge: number;
  status: number;
  createdDate: string;
  startDate: string;
  creditPeriod: number;
  billingFrequency: number;
  utilityServiceData: any;
  isActive: boolean;
  statusDisplay: string;
  billingFrequencyDisplay: string;
  createdUserRemoteName: string;
  lastModifiedUserRemoteName: string;
  categoryCode: string;
  applicationFee: number;
  serviceConnectionFee: number;
  subCategoryCode: string;
}

export interface ConsumerDetailsResponse {
  id: number;
  consumerNo: string;
  remoteUtilityId: number;
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  alternateContactNumber: string | null;
  status: number;
  statusDisplay: string;
  additionalData: {
    secondaryConsumer: SecondaryConsumer | null;
  };
  addressMap: AddressMap | null;
  remotePlanId: number | null;
  source: number;
  sourceDisplay: string;
  remarks: {
    hold: string;
    reject: string;
    approve: string;
    connect: string;
    activate: string;
    completed: string;
    approveHold: string;
    connectHold: string;
    approveReject: string;
    approveRejected: string;
    connectRejected: string;
    surveyInProgress: string;
    installationInProgress: string;
  };
  ownership: number;
  ownershipDisplay: string;
  registrationDate: string | null;
  approveDate: string | null;
  connectDate: string | null;
  activateDate: string | null;
  isVip: boolean;
  isAutoPay: boolean;
  ssn: string | null;
  isEBill: boolean;
  isPaperedBill: boolean;
  createdDate: string;
  createdUserRemoteName: string;
  lastModifiedUserRemoteName: string;
  category: string;
  subCategory: string;
  territoryData: TerritoryData;
}


export interface PaymentChannel {
  code: string;
  createdBy: string;
  createdDate: string;
  isActive: boolean;
  name: string;
  processingFee: number;
  remark: string;
}


export interface PaymentPayType {
  key: number;
  value: string;
}
export interface TimeSlotChoice {
  key: number;
  value: string;
}
export interface UtilityRequestConfiguration {
  id: number;
  name: string;
  configurationCode: string;
  requestType: string;
  remoteUtilityId: number;
  productCode: string[];
  description: string;
  status: number;
  statusDisplay: string;
  version: string;
  extraData: any;
}



export interface CreateServiceRequestPayload {
  consumerId:any
  remoteUtilityId: any;
  requestType: string;
  source: number;
  consumer: number;
  utilityServices:any;
  serviceCharges:any;
  serviceName:string;
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


export interface UtilityConfigFilters {
  remoteUtilityId: any;
  requestType: string;
  disablePagination?: boolean;
  searchData?: string;

  productCode?: string[];

}

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


export interface Premise  {
  name: string;
  latitude: string;
  isActive: boolean;
  longitude: string;
  createdBy: string;
  totalUnits: string;
  createdDate: string;
  code: string;
  childCount: number;
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
  hierarchy_codes: {
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
  installedMeterCount: number;
  billedUnitCount: number;
}

export interface TransferRequest {
  id: number;
  consumer: number ;
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