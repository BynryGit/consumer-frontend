import { Premise } from "@features/serviceRequest/types";
import { ApiEndpoints } from "@shared/api/api-endpoints";
import { communicationApiClient, cxApiClient } from "@shared/api/clients/apiClientFactory";

// Add your feature-specific API calls here
export const ProfileApi = {
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
  getMeterList: async (params: {
    remote_utility_id: string;
    consumer_id: string;
    remote_meter_id: string;
    is_status: boolean;
    page: any;
    limit: any;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "meter-reading",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("consumer_id", params.consumer_id);
         qs.push("remote_meter_id", params.remote_meter_id);
        qs.push("is_status", params.is_status);
         qs.push("page", params.page);
           qs.push("limit", params.limit);
       
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },
  updateConsumer: async (
    consumerId: string | number,
    payload: {
      remote_utility_id: string | number;
      consumer_details: {
        primary_consumer: {
          email: string;
          contact_number: string;
        };
      };
      service_address_data: {
        unit: string;
        address: string;
        city: string;
        area: string;
        sub_area: string;
        premise: string;
        zipcode: string;
      };
    }
  ): Promise<any> => {
    const url = ApiEndpoints.createUrl("consumerWeb", `consumer/${consumerId}`);
    const response = await cxApiClient.put(url, payload);
    return response.data;
  },


  getActivityLog: async (params: {
      remote_utility_id: string;
      module:any;
      consumer_no:string
    }): Promise<any> => {
      const url = ApiEndpoints.createUrlWithQueryParameters(
        "activityLog",
        `logs`,
        (qs) => {
          qs.push("remote_utility_id", params.remote_utility_id); 
            qs.push("consumer_no", params.consumer_no);
                qs.push("module", params.module);
        }
      );
      const response = await communicationApiClient.get(url);
      return response.data;
    },
};
