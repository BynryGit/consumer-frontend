import { ApiEndpoints } from "@shared/api/api-endpoints";
import { AddHelpfullPayload, ThresholdPayload } from "./types";
import { authApiClient, cxApiClient, onboardingApiClient } from "@shared/api/clients/apiClientFactory";


export const usageconsumptionApi = {

 
 getUtilityServices: async (params: {
    utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "auth",
      "utility/services",
      (qs) => {
        qs.push("utility_id", params.utility_id);
      }
    );
    const response = await authApiClient.get(url);
    return response.data;
  }, 


    getTipsData: async (params: {
    remote_utility_id: string;
    utility_service: any;
    show_inactive: any;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "onboarding",
      "config-map/tips",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("utility_service", params.utility_service);
        qs.push("show_inactive", params.show_inactive);
      }
    );
    const response = await onboardingApiClient.get(url); 
    return response.data;
  },
getUsageChart: async (params: {
    consumer_no: string;
    remote_utility_id: string;
    fetch_last_six_records: any;
    utility_service:any;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-dashboard/graph",
      (qs) => {
        qs.push("consumer_no", params.consumer_no);
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("fetch_last_six_records", params.fetch_last_six_records);
        qs.push("utility_service", params.utility_service);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  }, 
addThreshold: async (payload: ThresholdPayload): Promise<any> => {
    const url = ApiEndpoints.createUrl("consumerWeb", "consumer-threshold");
    const response = await cxApiClient.post(url, payload);
    return response.data;
  },
  getThershold: async (params: {
    consumer_number: string;
    remote_utility_id: string;
    fetch_latest: any;
    bill_data: any;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-bill",
      (qs) => {
        qs.push("consumer_number", params.consumer_number);
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("fetch_latest", params.fetch_latest);
        qs.push("bill_data", params.bill_data);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },
  getComparison: async (params: {
    consumer_no: string;
    remote_utility_id: string;
    period: any;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-bill-analytics",
      (qs) => {
        qs.push("consumer_no", params.consumer_no);
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("period", params.period);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  }, 
   addHelpful: async (
        payload: AddHelpfullPayload
      ): Promise<any> => {
        const url = ApiEndpoints.createUrl("onboarding", "config-map/tips");
        const response = await onboardingApiClient.patch(url, payload);
        return response.data;
      },
};
