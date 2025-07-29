import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { dashboardApi } from "./api";
import { useSmartQuery } from "@shared/api/queries/hooks";

export const useConsumerBillDetails = (params: {
  remoteUtilityId: string;
  remoteConsumerNumber: any;
  fetch_last_six_records: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.dashboard.billData(params),
    () => dashboardApi.getConsumerBillDetails(params)
  );
};

export const useTipsData = (params: {
  remote_utility_id: string;
  is_pagination_required: any;
  show_inactive: any;
  page: any;
  limit: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.dashboard.tipsData(params),
    () => dashboardApi.getTipsData(params)
  );
};

export const useRequestData = (params: {
  remote_utility_id: string;
  consumer_id: any;
  page: any;
  limit: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.dashboard.requestData(params),
    () => dashboardApi.getRequestData(params)
  );
};


export const useUsageChart= (params: {
    consumer_no: string;
    remote_utility_id: string;
    fetch_last_six_records: any;
    utility_service:any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.dashboard.UsageChart(params),
    () => dashboardApi.getUsageChart(params)
  );
};

export const useService= (params: {
    consumer: string;
  
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.dashboard.ConsumerService(params),
    () => dashboardApi.getConsumerServices(params)
  );
};