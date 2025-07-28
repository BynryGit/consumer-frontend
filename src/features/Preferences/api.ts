import { ApiEndpoints } from "@shared/api/api-endpoints";
import { prefrencesPayload } from "./types";
import { cxApiClient } from "@shared/api/clients/apiClientFactory";


// Add your feature-specific API calls here
export const PreferencesApi = {
 //https://api-cx-staging.bynry.com/api/consumer-web/consumer/19321/
//  https://api-cx-staging.bynry.com/api/consumer-web/choices/frequency/?remote_utility_id=702


  addPreferences: async (id: any, payload: prefrencesPayload): Promise<any> => {
    const url = ApiEndpoints.createUrl("consumerWeb", `consumer/${id}`);
    const response = await cxApiClient.put(url, payload);
    return response.data;
  },
};
