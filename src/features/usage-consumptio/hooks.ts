

import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { usageconsumptionApi } from "./api";
import { ThresholdPayload } from "./types";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";


export const useAddThreshold = () => {
  return useSmartMutation(
    (payload: ThresholdPayload) =>
      usageconsumptionApi.addThreshold(payload)
  );
};

export const useTipsData = (params: {
  remote_utility_id: string;
  utility_service: any;

  show_inactive: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.usage.tipsData(params),
    () => usageconsumptionApi.getTipsData(params)
  );
}; 

export const useThershold = (params: {
 consumer_number: string;
    remote_utility_id: string;
    fetch_latest: any;
    bill_data: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.usage.getThershold(params),
    () => usageconsumptionApi.getThershold(params)
  );
};

export const useComparison= (params: {
    consumer_no: string;
    remote_utility_id: string;
    period: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.usage.Comparison(params),
    () => usageconsumptionApi.getComparison(params)
  );
};


export const useUsageChart= (params: {
    consumer_no: string;
    remote_utility_id: string;
    fetch_last_six_records: any;
    utility_service:any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.usage.UsageChart(params),
    () => usageconsumptionApi.getUsageChart(params)
  );
};



    export const useUtilityServices= (params: {
        utility_id: string;
    }) => {
    return useSmartQuery(
        QueryKeyFactory.module.cx.usage.utilityService(params),
        () => usageconsumptionApi.getUtilityServices(params)
    );
    };
