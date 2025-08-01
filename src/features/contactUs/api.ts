  import { ApiEndpoints } from "@shared/api/api-endpoints";
  import { cxApiClient } from "@shared/api/clients/apiClientFactory";

  export const contactUsApi = {


  getServiceDetail: async (params: {
    remote_utility_id: string;
    consumer_id: string;
    search_data?: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "service-center",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("consumer_id", params.consumer_id);
        if (params.search_data) {
          qs.push("search_data", params.search_data);
        }
      }
    );
    const response = await cxApiClient.get(url); 
    return response.data;
  },
  };
