import { ApiEndpoints } from '@shared/api/api-endpoints';
import { cxApiClient, onboardingApiClient } from '@shared/api/clients/apiClientFactory';

// Add your feature-specific API calls here
export const dashboardApi = {
    getConsumerBillDetails: async (params: {
      remoteUtilityId: string;
      remoteConsumerNumber: any;
      fetch_last_six_records: any;
     
    }): Promise<any> => {
      const url = ApiEndpoints.createUrlWithQueryParameters(
        "consumerWeb",
        "consumer-bill",
        (query) => {
          query.push("remote_utility_id", params.remoteUtilityId);
          query.push("consumer_number", params.remoteConsumerNumber);
         query.push("fetch_last_six_records", params.fetch_last_six_records);
        }
      );
      const response = await cxApiClient.get(url);
      return response.data;
    },


       getTipsData: async (params: {
        remote_utility_id: string;
        is_pagination_required: any;
        show_inactive: any;
        page:any;
        limit:any;
      }): Promise<any> => {
        const url = ApiEndpoints.createUrlWithQueryParameters(
          "onboarding",
          "config-map/tips",
          (qs) => {
            qs.push("remote_utility_id", params.remote_utility_id);
            qs.push("is_pagination_required", params.is_pagination_required);
            qs.push("show_inactive", params.show_inactive);
             qs.push("page", params.page);
            qs.push("limit", params.limit);
          }
        );
        const response = await onboardingApiClient.get(url); 
        return response.data;
      },
      

        getRequestData: async (params: {
        remote_utility_id: string;
        consumer_id: any;
        page:any;
        limit:any;
      }): Promise<any> => {
        const url = ApiEndpoints.createUrlWithQueryParameters(
          "consumerWeb",
          "consumer-request",
          (qs) => {
            qs.push("remote_utility_id", params.remote_utility_id);
            qs.push("consumer_id", params.consumer_id);
             qs.push("page", params.page);
            qs.push("limit", params.limit);
          }
        );
        const response = await cxApiClient.get(url); 
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
    //https://api-cx-staging.bynry.com/api/consumer-web/consumer-utility-services/?consumer=175065

     getConsumerServices: async (params: {
    consumer: string;
   
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-utility-services",
      (qs) => {
        qs.push("consumer", params.consumer);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  }, 
};
