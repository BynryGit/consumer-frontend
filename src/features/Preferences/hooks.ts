import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { prefrencesPayload } from "./types";
import { PreferencesApi } from "./api";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";

export const useAddPreferences = () => {
  return useSmartMutation(
    ({ id, payload }: { id:any; payload: prefrencesPayload }) =>
      PreferencesApi.addPreferences(id, payload)
  );
};  

export const useConsumerDetails = (params: {
  remote_utility_id: any;
  consumer_no: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.preferences.consumerDetails(params), 
    () => PreferencesApi.consumerDetails(params),
    {
      enabled: !!params.remote_utility_id,
    }
  );
};