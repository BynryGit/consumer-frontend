import { ApiEndpoints } from "@shared/api/api-endpoints";
import { prefrencesPayload } from "./types";
import { cxApiClient } from "@shared/api/clients/apiClientFactory";
import { Premise } from "@features/serviceRequest/types";


// Add your feature-specific API calls here
export const PreferencesApi = {

    consumerDetails: async (params: {
      remote_utility_id: string;
      consumer_no: string;
    }): Promise<any> => {
      const url = ApiEndpoints.createUrlWithQueryParameters(
        "consumerWeb",
        "consumer-detail",
        (qs) => {
          qs.push("remote_utility_id", params.remote_utility_id);
          qs.push("consumer_no", params.consumer_no);
        }
      );
      const response = await cxApiClient.get(url);
      return response.data;
    },
  addPreferences: async (id: any, payload: prefrencesPayload): Promise<any> => {
    const url = ApiEndpoints.createUrl("consumerWeb", `consumer/${id}`);
    const response = await cxApiClient.put(url, payload);
    return response.data;
  },
};
