import { ApiEndpoints } from "@shared/api/api-endpoints";
import { consumerApiClient, cxApiClient, onboardingApiClient } from "@shared/api/clients/apiClientFactory";
import { Complaint, ComplaintConfiguration } from "./components/complaints/types";
import { CreateDisconnectionRequestPayload, CreateServiceRequestPayload, PaymentMethod, Premise, ServiceRequest, TimeSlotChoice, TransferRequest, UtilityConfigFilters, UtilityRequestConfiguration } from "./types";
import { transformJsonToObject } from "@shared/utils/jsonToObjectTransformer";


// Add your feature-specific API calls here
export const serviceRequestApi = {
   getConfigurations: async (
     remoteUtilityId: number
   ): Promise<any> => {
     const url = ApiEndpoints.createUrlWithQueryParameters(
       "consumerWeb",
       "utility-request-configuration",
       (params) => {
         params.push("remote_utility_id", remoteUtilityId.toString());
         params.push("request_type", "Complaint");
         params.push("disable_pagination", "true");
         // if (productCodes.length) {
         //   productCodes.forEach(code => params.push('product_code', code));
         // }
 
         return params;
       }
     );
 
     const response = await consumerApiClient.get<{
       result: ComplaintConfiguration[];
     }>(url);
     return response.data.result || [];
   },
    createComplaint: async (data: any): Promise<Complaint> => {
       const response = await cxApiClient.post<Complaint>(
         ApiEndpoints.createUrlWithPathVariables(
           "consumerWeb",
           "consumer-complaint-request"
         ),
         data
       );
       return response.data;
     },
       getTimeSlotChoices: async (): Promise<{ result: TimeSlotChoice[] }> => {
    const url = ApiEndpoints.createUrl("consumerWeb", "choices/time_slot");
    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: TimeSlotChoice[] }>(response.data);
  },
   getUtilityRequestConfiguration: async (
    filters: UtilityConfigFilters
  ): Promise<{ result: UtilityRequestConfiguration[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "utility-request-configuration",
      (query) => {
        query.push("remote_utility_id", 699);
        query.push("request_type", filters.requestType);
        if (filters.disablePagination) query.push("disable_pagination", "true");
        if (filters.searchData) query.push("search_data", filters.searchData);
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: UtilityRequestConfiguration[] }>(
      response.data
    );
  },
 createServiceRequest: async (
    id: string,
    remoteUtilityId: string,
    data: Omit<ServiceRequest, "id" | "date">
  ): Promise<ServiceRequest> => {
    const payload = {
      ...data,
      consumer_id: id,
      remote_utility_id: remoteUtilityId,
    };

    const response = await cxApiClient.post(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-service-request",
        []
      ),
      payload
    );
    return response.data;
  },
    // createServiceRequest: async (
    //   payload: CreateServiceRequestPayload
    // ): Promise<any> => {
    //   const url = ApiEndpoints.createUrl("cx", "consumer-service-request");
    //   const response = await cxApiClient.post(url, payload);
    //   return response.data;
    // },
getPaymentMethod: async (params: {
    remote_utility_id: number;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "onboarding",
      "config-map",
      ["payment_mode"],
      (query) => {
        query.push("remote_utility_id", params.remote_utility_id);
        return query;
      }
    );
    const response = await onboardingApiClient.get(url);
    return response.data;
  },
    createDisconnectionRequest: async (
    payload: CreateDisconnectionRequestPayload
  ): Promise<any> => {
    const url = ApiEndpoints.createUrl("consumerWeb", "connection-status-request");
    const response = await cxApiClient.post(url, payload);
    return transformJsonToObject<any>(response.data);
  },

    getPremise: async (params: {
    remote_utility_id: string;
    config_level: string;
  }): Promise<{ result: Premise[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "onboarding",
      "config-map/territory_json",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("config_level", params.config_level);
      }
    );
    const response = await onboardingApiClient.get<{ result: Premise[] }>(url);
    return transformJsonToObject<{ result: Premise[] }>(response.data);
  },

   getConsumerRelation: async (): Promise<any> => {
    const url = ApiEndpoints.createUrl('consumerWeb', 'choices/consumer_relation');
    const response = await cxApiClient.get(url);
    return response.data;
  },

  consumerDetails: async (params: {
    remote_utility_id: string;
    consumer_no: string;
  }): Promise<{ result: Premise[] }> => {
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
    getDocumentType: async (params: {
    remote_utility_id: string;
    config_level: string;
  }): Promise<any> => {
    const response = await onboardingApiClient.get(
      `config-map/document_json/?remote_utility_id=${params.remote_utility_id}&config_level=${params.config_level}`
    );
    return response.data;
  },
  getKycInfo: async (params: {
    consumer_id: string;
    remote_utility_id: string;
    is_kyc_info: any;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "nsc-detail",
      (qs) => {
        qs.push("consumer_id", params.consumer_id);
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("is_kyc_info", params.is_kyc_info);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },

   getDocumentSubtype: async (params: {
    remote_utility_id: string;
    config_level: string;
    code_list: string;
  }): Promise<any> => {
    const response = await onboardingApiClient.get(
      `config-map/document_json/?remote_utility_id=${
        params.remote_utility_id
      }&config_level=${params.config_level}&code_list=${encodeURIComponent(
        params.code_list
      )}`
    );
    return response.data;
  },

   createTransferRequest: async (
      formData: FormData
    ): Promise<TransferRequest> => {
      const url = ApiEndpoints.createUrl("cx", "consumer-transfer-request");
      const response = await cxApiClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return transformJsonToObject<TransferRequest>(response.data);
    },
};
