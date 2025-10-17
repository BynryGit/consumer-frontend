import { ActionType, EntityType, ModuleType } from "../../queryKeyFactory";

export const complaintKeyFactory = {
  complaintList: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "complaints",
    "list",
    filters,
  ],
  complaintHistory: (
    filters?: any
  ): [ModuleType, EntityType, ActionType, any?] => [
    "cx",
    "complaints",
    "history",
    filters,
  ],
  complaintDetails: (
    id: string
  ): [ModuleType, EntityType, ActionType, string] => [
    "cx",
    "complaints",
    "details",
    id,
  ],
  complaintConfigurations: (
    remoteUtilityId: number
  ): [ModuleType, EntityType, ActionType, number] => [
    "cx",
    "complaintConfigurations",
    "list",
    remoteUtilityId,
  ],
  complaintStatusChoices: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaintStatusChoices",
    "list",
  ],
  complaintFilterOptions: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaintFilterOptions",
    "list",
  ],
  complaintSummary: (
    remoteUtilityId: number
  ): [ModuleType, EntityType, ActionType, number] => [
    "cx",
    "complaints",
    "dashboard",
    remoteUtilityId,
  ],
  complaintCreate: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "create",
  ],
  complaintAcknowledge: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "acknowledge",
  ],
  complaintHold: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "hold",
  ],
  complaintReject: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "reject",
  ],
  complaintResolve: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "resolve",
  ],
  complaintUpdateStatus: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "updateStatus",
  ],
  complaintStepSave: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "stepSave",
  ],
  complaintStepper: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "stepper",
  ],
  complaintBulkSelection: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "bulkSelection",
  ],
  complaintActions: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "actions",
  ],
  complaintRecentActivity: (): [ModuleType, EntityType, ActionType] => [
    "cx",
    "complaints",
    "recentActivity",
  ],
  complaintFilters: (
    listType: "current" | "history" = "current"
  ): [ModuleType, EntityType, ActionType, "current" | "history"] => [
    "cx",
    "complaints",
    "filter",
    listType,
  ],
};
