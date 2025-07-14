import {
  ActivityFilters,
  CommunicationFilters,
  ConsumerFilters,
  ServiceOrderFilters,
} from "@features/cx/consumerManagement/types";
import { ActionType, EntityType, ModuleType } from "../../../queryKeyFactory";
import { tarrifFilters } from "@features/onboarding/utility-setup/components/plan-tariffs/components/Tarrif/types";
export const planTarrifKeyFactory = {
  rateTypes: (): [ModuleType, EntityType] => ["onboarding", "rateTypes"],
  rateTable: (
    filters?: tarrifFilters
  ): [ModuleType, EntityType, ActionType, tarrifFilters] => [
    "onboarding",
    "rateList",
    "list",
    filters,
  ],
    planTable: (
    filters?: tarrifFilters
  ): [ModuleType, EntityType, ActionType, tarrifFilters] => [
    "onboarding",
    "planList",
    "list",
    filters,
  ],
  billFrequency: (): [ModuleType, EntityType] => [
    "onboarding",
    "billFrequency",
  ],
  taxType: (): [ModuleType, EntityType] => ["onboarding", "taxType"],
  category: (): [ModuleType, EntityType] => ["onboarding", "category"],
  subCategory: (categoryCode: string) => [
    "plan-tariff",
    "subcategory",
    categoryCode,
  ],
  rateNames: (rateTypeKey: string) => ["plan-tariff", "rateNames", rateTypeKey],
  serviceCharges: () => ["plan-tariff", "serviceCharges"],
  recentlyUpdatedRates: (page: number): [ModuleType, EntityType, number] => [
    "onboarding",
    "recentlyUpdatedRates",
    page,
  ],
  recentlyUpdatedPlans: (page: number) => [
    "onboarding",
    "planTarrif",
    "recentlyUpdatedPlans",
    page,
  ],
  planKPIs: (): [ModuleType, EntityType] => ["onboarding", "planKPIs"],
  rateDetail: (id: number): [ModuleType, EntityType, number] => [
    "onboarding",
    "rateDetail",
    id,
  ],
};
