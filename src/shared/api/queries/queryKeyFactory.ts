import { complaintKeyFactory } from "./keyFactories/cx/complaintKeyFactory";
import { planTarrifKeyFactory } from "./keyFactories/onboarding/Plan-Tarrif/PlanTarrifKeyFactory";

import { consumerKeyFactory } from "./keyFactories/cx/consumerKeyFactory";
import { serviceRequestKeyFactory } from "./keyFactories/cx/serviceKeyFactory";
import { settingsKeyFactory } from "./keyFactories/mx/settingsKeyFactory";
import { validationsKeyFactory } from "./keyFactories/mx/validationsKeyFactory";
import { UtilityConfigFilters } from "@features/serviceRequest/types";
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
  | "login"
  |"usage"
  | "complaintConfigurations"
  | "disconnectionRequests"
  | "transfer"
  | "request"
  | "profile"
  |"contacts"
  |"faqs"
  | "document";

export type ActionType =
  | "utilityConfig"
  | "list"
  | "consumerDetails"
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
  | "meterList"
  | "recentActivity"
  | "routeDetails"
  | "metersDetails"
  | "relation"
  | "logs"
  | "meterSummaryDashboard"
  | "meterType"
  | "configuration"
  | "meterSummaryDashboardByRouteId"
  | "searchMeterRoute"
  | "activity"
  | "requestDetail"
  | "documents"
  | "paymentStatus"
  | "notes"
  | "financialSummary"
  | "billingHistory"
  | "consumptionData"
  | "relationshipInsights"
  | "utilityConnections"
  | "serviceRequests"
  | "communications"
  | "requestType"
  | "meterReadings"
  | "complaints"
  | "serviceOrders"
  | "category"
  | "subCategory"
  |"requestSummary"
  | "consumerStatus"
  | "meterSummaryDashboardByPremises"
  | "premises"
  | "routeData"
  | "metersCount"
  | "performanceDashboard"
  | "metadata"
  | "requestData"
  | "serviceOrders"
  | "pauseReadCycle"
  | "paymentPayType"
  | "paymentHistory"
  | "timeSlotChoices"
  |"faqData"
  | "transactionStatusChoices"
  | "noteTypeChoices"
  | "billData"
  | "frequency"
  | "weekDays"
  | "activeUtility"
  | "months"
  | "months"
  | "summary"
  |"servicesData"
  | "getAssignments"
  | "getDetails"
  |"creditNoteList"
  | "paymentAgreementDetail"
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

export type ModuleType = "auth" | "cx" | "global";

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
    cx: {
      login: {
        consumerWebLoginStatus: (): [EntityType, "consumerWebLoginStatus"] => [
          "login",
          "consumerWebLoginStatus",
        ],
        userUtility: (params: {
          tenant_alias: any;
        }): [EntityType, "userUtility", any] => [
          "login",
          "userUtility",
          params,
        ],
        consumerDetails: (params?: any): [EntityType, ActionType, any?] => [
          "transfer",
          "consumerDetails",
          params,
        ],
        
      },
      usage:{
        getThershold:
        (params?: any): [EntityType, "getThershold", any?] => [
          "usage",
          "getThershold",
          params,
        ],
        utilityService:
        (params?: any): [EntityType, "utilityService", any?] => [
          "usage",
          "utilityService",
          params,
        ],
        tipsData:(params?: any): [EntityType, "tipsData", any?] => [
          "usage",
          "tipsData",
          params,
        ],
        Comparison:
        (params?: any): [EntityType, "Comparison", any?] => [
          "usage",
          "Comparison",
          params,
        ],
        UsageChart:(params?: any): [EntityType, "UsageChart", any?] => [
          "usage",
          "UsageChart",
          params,
        ],
      },
      contacts:{
        cotactDetail: (params?: any): [EntityType, "cotactDetail", any?] => [
          "contacts",
          "cotactDetail",
          params,
        ],
      },
      faqs:{ faqData: (params?: any): [EntityType, ActionType, any?] => [
          "faqs",
          "faqData",
          params,
        ],},
      profile: {
        meterList: (params?: any): [EntityType, ActionType, any?] => [
          "profile",
          "meterList",
          params,
        ],
      },
      billing: {
        billData: (params: {
          remoteUtilityId: string;
          remoteConsumerNumber: string;
          isPaginationRequired: boolean;
          isBillSummary: boolean;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "billData",
          params,
        ],
        paymentHistory: (params: {
          remote_utility_id: string;
          consumer_id: string;
          page: any;
          limit: any;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "paymentHistory",
          params,
        ],

        creditNoteList: (params: {
          remote_utility_id: string;
    consumer_id: string;
    payment_pay_type:any;
    page:any;
    limit:any;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "creditNoteList",
          params,
        ],
        paymentAgreementDetail: (params: {
          remote_utility_id: string;
          consumer_id: string;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "paymentAgreementDetail",
          params,
        ],
        servicesData: (params: {
          remote_utility_id: string;
          consumer_id: string;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "servicesData",
          params,
        ],
        paymentStatus: (params: {
          remote_utility_id: string;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "paymentStatus",
          params,
        ],
        paymentPayType: (params: {
          remote_utility_id: string;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "paymentPayType",
          params,
        ],
      },
      complaint: {
        complaintConfigurations: (
          remoteUtilityId: number
        ): [ModuleType, EntityType, ActionType, number] => [
          "cx",
          "complaintConfigurations",
          "list",
          remoteUtilityId,
        ],
      },
      disconnection: {
        timeSlotChoices: (): [ModuleType, EntityType, ActionType] => [
          "cx",
          "disconnectionRequests",
          "timeSlotChoices",
        ],
        utilityConfig: (
          filters: UtilityConfigFilters
        ): [ModuleType, EntityType, ActionType, UtilityConfigFilters] => [
          "cx",
          "disconnectionRequests",
          "utilityConfig",
          filters,
        ],
      },
      transfer: {
        list: (params?: any): [EntityType, ActionType, any?] => [
          "transfer",
          "list",
          params,
        ],
        relation: (params?: any): [EntityType, ActionType, any?] => [
          "transfer",
          "relation",
          params,
        ],
      },
      request: {
        requestData: (params?: any): [EntityType, ActionType, any?] => [
          "request",
          "requestData",
          params,
        ],
        paymentMethod
        : (params?: any): [EntityType, ActionType, any?] => [
          "request",
          "paymentMethod",
          params,
        ],
        requestSummary: (params?: any): [EntityType, ActionType, any?] => [
          "request",
          "requestSummary",
          params,
        ],
        requestDetail: (params?: any): [EntityType, ActionType, any?] => [
          "request",
          "requestDetail",
          params,
        ],
        requestType: (params?: any): [EntityType, ActionType, any?] => [
          "request",
          "requestType",
          params,
        ],
        consumerStatus: (params?: any): [EntityType, ActionType, any?] => [
          "request",
          "consumerStatus",
          params,
        ],
      },
      document: {
        kycInfo: (params: {
          remote_utility_id: any;
          consumer_id: string;
          is_kyc_info: any;
        }): [EntityType, "kycInfo", any] => ["document", "kycInfo", params],
        documentType: (params: {
          remote_utility_id: string;
          config_level: string;
        }): [EntityType, "documentType", any] => [
          "document",
          "documentType",
          params,
        ],
        documentSubType: (params: {
          remote_utility_id: string;
          config_level: string;
          code_list: string;
        }): [EntityType, "documentSubType", any] => [
          "document",
          "documentSubType",
          params,
        ],
      },
    },
    consumerWeb: {
      billing: {
        billData: (params: {
          remoteUtilityId: string;
          remoteConsumerNumber: string;
          fetchLastSixRecords: boolean;
        }): [EntityType, ActionType, typeof params] => [
          "billing",
          "billData",
          params,
        ],
      },
    },
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
    const modules: ModuleType[] = ["auth", "cx"];
    if (modules.includes(queryKey[0] as ModuleType)) {
      return queryKey[0] as ModuleType;
    }
    return null;
  }
}
