// Add your feature-specific types here
export interface ProfileState {
  // Define your state types
}
export interface AddressData {
  service: {
    premise: string;
    subarea: string;
    area: string;
    division: string;
    zone: string;
    city: string;
    state: string;
    country: string;
    region: string;
    zipcode: string;
    unit: string;
    address: string;
  };
  billing: {
    premise: string;
    subarea: string;
    area: string;
    division: string;
    zone: string;
    city: string;
    state: string;
    country: string;
    region: string;
    zipcode: string;
    unit: string;
    address: string;
  };
}

export interface AddressMap {
  street: string | null;
  addressLine: string;
}

export interface AdditionalData {
  openingBalance: number;
  paymentReceived: number;
}

export interface MeterDetails {
  id: number;
  meterNumber: string;
  deviceNo: string;
  productCode: string;
  meterType: number;
  premise: string;
  meterTypeDisplay: string;
  meterDials: any;
  physicalStatus: number;
  readingStatus: number;
  status: number;
  physicalStatusDisplay: string;
  statusDisplay: string;
  readingStatusDisplay: string | null;
  lat: string;
  long: string;
  currentReading: number | null;
  currentReadingDate: string;
  lastReading: number;
  lastReadingDate: string;
  meterModel: string | null;
  routeName: string;
  cycleName: string;
}

export interface ConsumerMappingData {
  consumer: number;
  utilityService: string;
  remoteMeterId: number;
  status: number;
  statusDisplay: string;
  isActive: boolean;
  meterDetails: MeterDetails;
}

export interface TerritoryData {
  service: {
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
  billing: {
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
}

export interface RateStructure {
  rate: string;
  endTime: number;
  startTime: number;
}

export interface UtilityRate {
  id: number;
  rateName: string;
  remoteUtilityId: number;
  effectiveDate: string;
  taxRate: number | null;
  country: string | null;
  rateType: number;
  currency: string;
  version: string;
  basisType: string;
  utilityService: string | null;
  currencyDisplay: string;
  rate: RateStructure[];
  paymentFrequency: string | null;
  isTaxable: boolean;
  isActive: boolean;
  rateTypeDisplay: string;
  expiryDate: string;
  createdDate: string;
}

export interface UtilityServiceRate {
  rate: UtilityRate;
  type: number;
  version: string;
  avgConsumption: string;
  estimatedAvgBillAmount: string;
  estimatedAvgConsumption: string;
  isMeterRequired: boolean;
  utilityUnit: string | null;
}

export interface ChargeItem {
  fee: string;
  basis: string;
  frequency: string;
  operation: string;
  chargeLabel: string;
  creditPeriod: string | null;
  utilityService: string;
}

export interface UtilityServiceCharges {
  charges: Record<string, ChargeItem>;
  rate: Record<string, any>;
}

export interface ExtraCharges {
  utilityServiceCharges: Record<string, UtilityServiceCharges>;
  commonCharges: Record<string, ChargeItem>;
}

export interface UtilityServiceData {
  rate: Record<string, UtilityServiceRate>;
  extraCharges: ExtraCharges;
}

export interface PlanDetails {
  id: number;
  planName: string;
  remoteUtilityId: number;
  shortName: string;
  description: string | null;
  category: string;
  subcategory: string;
  utilityService: string[];
  validity: string;
  utilityUnit: string | null;
  tax: number;
  processingFees: number | null;
  connectionFee: number | null;
  securityDeposit: number | null;
  taxType: number;
  taxTypeDisplay: string;
  startDate: string | null;
  depositAmount: number | null;
  contract: number;
  latePaymentAmount: number | null;
  surcharge: number | null;
  status: number;
  createdDate: string;
  creditPeriod: number | null;
  billingFrequency: number;
  utilityServiceData: UtilityServiceData;
  isActive: boolean;
  statusDisplay: string;
  billingFrequencyDisplay: string;
  categoryCode: string;
  subCategoryCode: string;
  showSlabRates: boolean;
}

export interface DocumentData {
  id: number;
  consumerRole: string;
  consumer: number;
  documentType: string;
  documentSubtype: string;
  file: string;
  isActive: boolean;
  status: number;
  statusDisplay: string;
  createdDate: string;
  createdUserRemoteName: string | null;
  lastModifiedUserRemoteName: string | null;
  documentTypeName?: string;
  documentSubtypeName?: string;
}

export interface ConsumerDetail {
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
  additionalData: AdditionalData;
  addressMap: AddressMap;
  remotePlanId: number;
  source: number;
  sourceDisplay: string;
  remarks: string;
  ownership: number;
  ownershipDisplay: string;
  registrationDate: string;
  approveDate: string;
  connectDate: string;
  activateDate: string;
  isVip: boolean;
  isAutoPay: boolean;
  ssn: string | null;
  isEBill: boolean;
  isPaperedBill: boolean;
  createdDate: string;
  createdUserRemoteName: string;
  lastModifiedUserRemoteName: string;
  category: string | null;
  subCategory: string | null;
  consumerMappingData: ConsumerMappingData[];
  meters: number[];
  territoryData: TerritoryData;
  planDetails: PlanDetails;
  document: DocumentData[];
  addressData: AddressData;
}

export interface ConsumerDetailResponse {
  result: ConsumerDetail;
}