import { ActionType, EntityType, ModuleType } from "../../queryKeyFactory";

export const serviceRequestKeyFactory = {
  list: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "list",
    filters,
  ],
  details: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "serviceRequests",
    "details",
    id,
  ],
  summary: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "dashboard",
    filters,
  ],
  consumerSearch: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "search",
    filters,
  ],
  consumerMetaData: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "serviceRequests",
    "metadata",
    id,
  ],
  utilityRequestConfiguration: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "configuration",
    filters,
  ],
  timeSlotChoices: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "timeSlotChoices",
    filters,
  ],
  transactionStatusChoices: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "transactionStatusChoices",
    filters,
  ],
  noteTypeChoices: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "noteTypeChoices",
    filters,
  ],
  create: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "create",
    filters,
  ],
  notes: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "notes",
    filters,
  ],
  status: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "status",
    filters,
  ],
  category: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "category",
    filters,
  ],
  paymentMethod: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "paymentMethod",
    filters,
  ],
  communications: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "serviceRequests",
    "communications",
    id,
  ],
  activityLogs: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "serviceRequests",
    "activity",
    id,
  ],
  serviceOrders: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "serviceOrders",
    filters,
  ],
  channelType: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "serviceRequests",
    "channelType",
    filters,
  ],
  channelTemplates: (
    remoteUtilityId: number,
    channelType: string
  ): [ModuleType, EntityType, ActionType, number, string] => [
    "cx",
    "serviceRequests",
    "channelTemplates",
    remoteUtilityId,
    channelType,
  ],
};
