
import { complaintKeyFactory } from "./keyFactories/cx/complaintKeyFactory";
import { planTarrifKeyFactory } from "./keyFactories/onboarding/Plan-Tarrif/PlanTarrifKeyFactory";

import { consumerKeyFactory } from "./keyFactories/cx/consumerKeyFactory";
import { serviceRequestKeyFactory } from "./keyFactories/cx/serviceKeyFactory";
import { settingsKeyFactory } from "./keyFactories/mx/settingsKeyFactory";
import { validationsKeyFactory } from "./keyFactories/mx/validationsKeyFactory";
export type EntityType =
  | "user"
  | "organization"
  | "meter"
  | "consumer"
  | "workorder"
  | "billing"
  | "notification"
  | "activity"
  | "utility"
  |"login"
;

export type ActionType =
  | "list"
  | "channelType"
  | "paymentMethod"
  | "channelTemplates"
  | "details"
  | "profile"
  | "create"
  | "update"
  | "delete"
  | "search"
  | "status"
  | "filter"
  | "dashboard"
  | "history"
  | "acknowledge"
  | "hold"
  | "reject"
  | "resolve"
  | "updateStatus"
  | "stepSave"
  | "stepper"
  | "bulkSelection"
  | "actions"
  | "recentActivity"
  | "routeDetails"
  | "metersDetails"
  | "logs"
  | "meterSummaryDashboard"
  | "meterType"
  | "configuration"
  | "meterSummaryDashboardByRouteId"
  | "searchMeterRoute"
  | "activity"
  | "documents"
  | "notes"
  | "financialSummary"
  | "billingHistory"
  | "consumptionData"
  | "relationshipInsights"
  | "utilityConnections"
  | "serviceRequests"
  | "communications"
  | "meterReadings"
  | "complaints"
  | "serviceOrders"
  | "category"
  | "subCategory"
  | "meterSummaryDashboardByPremises"
  | "premises"
  | "routeData"
  | "metersCount"
  | "performanceDashboard"
  | "metadata"
  | "serviceOrders"
  | "pauseReadCycle"
  | "paymentHistory"
  | "timeSlotChoices"
  | "transactionStatusChoices"
  | "noteTypeChoices"
  | "billData"
  | "frequency"
  | "weekDays"
  | "activeUtility"
  | "months"
  | "months"
  | "summary"
  | "getAssignments"
  | "getDetails"
  | "getTransactions"
  | "getActivityLogs"
  | "getAllCertificates"
  | "updateFieldForce"
  | "getAllSkills"
  | "getAllAvailability"
  | "getChannel"
  | "updateChannelStatus"
  | "createChannel"
  | "updateChannel"
  | "getMode"
  | "updateModeStatus"
  | "getDisconnectionReasons"
  | "createDisconnectionReason"
  | "updateDisconnectionReason"
  | "deleteDisconnectionReason"
  | "getReconnectionReasons"
  | "getTransferTypes"
  | "getAllFieldTypes"
  | "createMode"
  | "updateMode";

export type ModuleType =
  | "auth"
  | "cx"
  | "global";

// Query key factory following entity-first pattern
export class QueryKeyFactory {
  // Global shared data (cross-module)
  static global = {
    user: {
      profile: (): [EntityType, ActionType] => ["user", "profile"],
      details: (userId: string): [EntityType, ActionType, string] => [
        "user",
        "details",
        userId,
      ],
    },
    utilities: {
      selected: () => ["global", "utilities", "selected"],
    },

    utility: {
      profile: (): [EntityType, ActionType] => ["utility", "profile"],
      settings: (): [EntityType, "settings"] => ["utility", "settings"],
      list: (): [EntityType, ActionType] => ["utility", "list"],
      services: (): [EntityType, ActionType] => ["utility", "list"],
      activeUtility: (): [EntityType, ActionType] => [
        "utility",
        "activeUtility",
      ],
    },
  };

  // Module-specific data
  static module = {
cx:{
  login:{
      
          consumerWebLoginStatus: (): [EntityType, "consumerWebLoginStatus"] => [
          "login",
          "consumerWebLoginStatus",
        ],
        userUtility: (params: {
        tenant_alias: any;
         
        }): [EntityType, "userUtility", any] => ["login", "userUtility", params],
}
}
  };

  // Utility methods
  static isGlobalKey(queryKey: unknown[]): boolean {
    if (!Array.isArray(queryKey) || queryKey.length === 0) return false;

    const globalEntities: EntityType[] = [
      "user",
      "organization",
      "meter",
      "workorder",
      "utility",
    ];
    return globalEntities.includes(queryKey[0] as EntityType);
  }

  static getEntityFromKey(queryKey: unknown[]): EntityType | null {
    if (!Array.isArray(queryKey) || queryKey.length === 0) return null;
    return queryKey[0] as EntityType;
  }

  static getModuleFromKey(queryKey: unknown[]): ModuleType | null {
    if (!Array.isArray(queryKey) || queryKey.length === 0) return null;
    const modules: ModuleType[] = [
      "auth",
      "cx",
    ];
    if (modules.includes(queryKey[0] as ModuleType)) {
      return queryKey[0] as ModuleType;
    }
    return null;
  }
}
