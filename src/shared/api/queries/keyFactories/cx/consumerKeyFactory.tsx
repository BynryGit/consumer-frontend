import { ActivityFilters, CommunicationFilters, ConsumerFilters, ServiceOrderFilters } from "@features/cx/consumerManagement/types";
import { ActionType, EntityType, ModuleType } from "../../queryKeyFactory";

// ================================
// CONSUMER KEY FACTORIES
// ================================


/**
 * Consumer key factory
 */
export const consumerKeyFactory = {
  // ================================
  // CONSUMER LIST
  // ================================
  consumerSearch: (
    searchTerm: string,
    remoteUtilityId?: number  ): [ModuleType, EntityType, ActionType, string, number] => [
    "cx",
    "consumer",
    "search",
    searchTerm,
    remoteUtilityId,
  ],
  consumerStatus: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "consumer",
    "status",
  ],
  consumerCategory: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "consumer",
    "category",
  ],
  consumerMetadata: (
    consumer_id: string,
    remoteUtilityId?: number  ): [ModuleType, EntityType, ActionType, string, number] => [
    "cx",
    "consumer",
    "metadata",
    consumer_id,
    remoteUtilityId,
  ],
  consumerList: (
    filters?: ConsumerFilters
  ): [ModuleType, EntityType, ActionType, ConsumerFilters] => [
    "cx",
    "consumer",
    "list",
    filters,
  ],
  // ================================
  // CONSUMER DETAILS
  // ================================
  consumerDetails: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "details",
    id,
  ],
  consumerBillData: (id: string): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "billData",
    id,
  ],
  consumerActivity: (
    id: string,
    filters: ActivityFilters = {}
  ): [ModuleType, EntityType, ActionType, string, any] => [
    "cx",
    "consumer",
    "activity",
    id,
    filters,
  ],
  consumerDocuments: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "documents",
    id,
  ],
  consumerNotes: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "notes",
    id,
  ],
  consumerServiceOrders: (
    id: string,
    filters: ServiceOrderFilters = {}
  ): [ModuleType, EntityType, ActionType, string, any] => [
    "cx",
    "consumer",
    "serviceOrders",
    id,
    filters,
  ],
  consumerFinancialSummary: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "financialSummary",
    id,
  ],
  consumerBillingHistory: (
    id: string,
    filters: any
  ): [ModuleType, EntityType, ActionType, string, any] => [
    "cx",
    "consumer",
    "billingHistory",
    id,
    filters,
  ],
  consumerPaymentHistory: (
    id: string,
    filters: any
  ): [ModuleType, EntityType, ActionType, string, any] => [
    "cx",
    "consumer",
    "paymentHistory",
    id,
    filters,
  ],
  consumerConsumptionData: (
    id: string,
    period: string
  ): [ModuleType, EntityType, ActionType, string, string] => [
    "cx",
    "consumer",
    "consumptionData",
    id,
    period,
  ],
  consumerRelationshipInsights: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "relationshipInsights",
    id,
  ],
  consumerUtilityConnections: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "utilityConnections",
    id,
  ],
  consumerMeterReadings: (
    consumerId: string,
    meterId: string
  ): [ModuleType, EntityType, ActionType, string, string] => [
    "cx",
    "consumer",
    "meterReadings",
    consumerId,
    meterId,
  ],
  consumerComplaints: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "complaints",
    id,
  ],
  consumerServiceRequests: (
    id: string,
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "consumer",
    "serviceRequests",
    id,
  ],
  consumerCommunications: (
    id: string,
    filters: CommunicationFilters = {}
  ): [ModuleType, EntityType, ActionType, string, any] => [
    "cx",
    "consumer",
    "communications",
    id,
    filters,
  ],
  consumerSummary: (
    remote_utility_id: number,
  ): [ModuleType, EntityType, ActionType, number] => [
    "cx",
    "consumer",
    "dashboard",
    remote_utility_id,
  ],
  channelType: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "consumer",
    "channelType",
  ],
  channelTemplates: (channelType: string, remoteUtilityId: number): [ModuleType, EntityType, ActionType, string, number] => [
    "cx",
    "consumer",
    "channelTemplates",
    channelType,
    remoteUtilityId,
  ],
};

