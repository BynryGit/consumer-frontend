import { ModuleType } from "../../queryKeyFactory";

export const settingsKeyFactory = {
    readingFormatList : (search): [ModuleType, 'format-list', string] => ['mx', 'format-list', search],
    userUtilityServices: (): [ModuleType, "utility-services"] =>
  ["mx", "utility-services"],
    viewMeterReadingFormatDetail: (id: string): [ModuleType, "meter-reading-format-detail", string] =>
  ["mx", "meter-reading-format-detail", id],
}