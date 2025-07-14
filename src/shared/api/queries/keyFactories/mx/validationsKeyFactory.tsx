import { ActionType, EntityType, ModuleType } from "../../queryKeyFactory";

export const validationsKeyFactory = {
  validationBreakRunCount: (
    meterRunId: string,
    page: number
  ): [ModuleType, "validation-break-run-count", string, number] => [
    "mx",
    "validation-break-run-count",
    meterRunId,
    page,
  ],
  newMeterReadings: (
    meterRunId: string,
    page: number,
    searchData: string,
    premises,
    sortBy
  ): [ModuleType, "new-meter-readings", string, number, string, string[], string[]] => [
    "mx",
    "new-meter-readings",
    meterRunId,
    page,
    searchData,
    premises,
    sortBy
  ],
  viewReadingsList: (
    meterRunId: string,
    ruleStatus: string,
    page: number,
    searchData,
    premises,
    sortBy
  ): [ModuleType, "view-readings-list", string, string, number, string, string[], string[]] => [
    "mx",
    "view-readings-list",
    meterRunId,
    ruleStatus,
    page,
    searchData,
    premises,
    sortBy
  ],
  missingReadingsList: (
    page: number,
    searchData,
    premises,
    sortBy,
  ): [ModuleType, "missing-readings-list", number, string, string[], string[]] => [
    "mx",
    "missing-readings-list",
    page,
    searchData, 
    premises,
    sortBy
  ],
  exemptionList: (meterRunId: string, page: number, searchData, premises, sortBy): [ModuleType, "exemptions", string, number, string, string[],string[]] =>
  ["mx", "exemptions", meterRunId, page, searchData, premises, sortBy],
  viewMeterReadingDetail: (
  meterReadingId: string
): [ModuleType, "meter-reading-detail", string] => [
  "mx",
  "meter-reading-detail",
  meterReadingId,
],
meterReadingConsumption: (
  meterNumber: string
): [ModuleType, "meter-reading-consumption", string] => [
  "mx",
  "meter-reading-consumption",
  meterNumber,
],
previousReadingImage: () : [ModuleType, "image"] => ['mx', 'image'],
  routesList: (cycleId: number): [ModuleType, "routes", number] => [
    "mx",
    "routes",
    cycleId,
  ],
  validationCodes: (): [ModuleType, "validation-code"] => [
  "mx",
  "validation-code"],
  reasonCodeList: (codeId: string): [ModuleType, "reason-code-list", string] =>
  ["mx", "reason-code-list", codeId],
  sops: (): [ModuleType, "sops"] => ['mx', 'sops'],
  validationBreakSummary: (): [ModuleType, "validation-break-summary"] =>
  ["mx", "validation-break-summary"],
  viewValidationBreakList: (): [ModuleType, "validation-break-list"] =>
  ["mx", "validation-break-list"],
  utilityRules: (): [ModuleType, "validation-rules"] => ['mx', "validation-rules"],
  meterCycleValidators: (search): [ModuleType, 'meter-validators', string] => ['mx', 'meter-validators', search],
  auditUsers: (
  userType: number
): [ModuleType, "audit-users", number] =>
  ["mx", "audit-users", userType],
};
