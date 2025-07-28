import { ApiEndpoints } from "@shared/api/api-endpoints";
import { communicationApiClient, cxApiClient } from "@shared/api/clients/apiClientFactory";
import { AddNotePayload } from "./types";

// Add your feature-specific API calls here
export const requestTrackerApi = {
  getRequestData: async (params: {
    consumer_id: string;
    remote_utility_id: string;
    page: any;
    limit: any;
    search_data?: string;
    status?: string;
    request_type?: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-request",
      (qs) => {
        qs.push("consumer_id", params.consumer_id);
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("page", params.page);
        qs.push("limit", params.limit);
        if (params.search_data) {
          qs.push("search_data", params.search_data);
        }
        if (params.status) {
          qs.push("status", params.status);
        }
        if (params.request_type) {
          qs.push("request_type", params.request_type);
        }
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },

  getRequestType: async (params: {
    remote_utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "choices/request_type",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },

  getRequestSummary: async (params: {
    remote_utility_id: string;
    consumer_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-request-summary",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("consumer_id", params.consumer_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },
  getConsumerStatus: async (params: {
    remote_utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "choices/consumer_support_request_status",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },
getActivityLog: async (params: {
    id: string;
    remote_utility_id: string;
    module:any
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "activityLog",
      `logs`,
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
          qs.push("request_id", params.id);
         
              qs.push("module", params.module);
      }
    );
    const response = await communicationApiClient.get(url);
    return response.data;
  },
  getRequestDetail: async (params: {
    id: string;
    remote_utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      `consumer-request/detail/${params.id}`,
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },
  addNote: async (payload: AddNotePayload): Promise<any> => {
    const url = ApiEndpoints.createUrl("cx", "consumer-request/notes");
    const response = await cxApiClient.post(url, payload);
    return response.data;
  },
};
