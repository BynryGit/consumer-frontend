import { serviceRequestApi } from "@features/serviceRequest/api";
import { useSmartQuery } from "@shared/api/queries/hooks";
import { useSmartMutation } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { ProfileApi } from "./api";

export const useActivityLog = (params: {
    remote_utility_id: string;
    consumer_no:string
    module:any
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.profile.activityLog(params),
    () => ProfileApi.getActivityLog(params)
  );
};
export const useConsumerDetails = (params: {
  remote_utility_id: any;
  consumer_no: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.login.consumerDetails(params), // Include params in query key for caching
    () => ProfileApi.consumerDetails(params),
    {
      enabled: !!params.remote_utility_id,
    }
  );
};

export const useMeterList = (params: {
  remote_utility_id: string;
    consumer_id: string;
    remote_meter_id: string;
    is_status: boolean;
    page: any;
    limit: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.profile.meterList(params), 
    () => ProfileApi.getMeterList(params),
  );
};
export const useUpdateConsumer = () => {
  return useSmartMutation(({ consumerId, payload }: { consumerId: string | number; payload: any }) =>
    ProfileApi.updateConsumer(consumerId, payload)
  );
};
    