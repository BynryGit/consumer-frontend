import { useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { contactUsApi } from "./api";

export const useServiceDetail = (params: {
  remote_utility_id: string;
  consumer_id: string;
  search_data?: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.contacts.cotactDetail(params),
    () => contactUsApi.getServiceDetail(params)
  );
};