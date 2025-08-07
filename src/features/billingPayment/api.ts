

// API
import { ApiEndpoints } from "@shared/api/api-endpoints";
import {
  bxApiClient,
  consumerApiClient,
  cxApiClient,
  paymentApiClient,
} from "@shared/api/clients/apiClientFactory";
import { PaymentPayload } from "./types";

export const billingApi = {
  getConsumerBillDetails: async (params: {
    remoteUtilityId: string;
    remoteConsumerNumber: any;
    isPaginationRequired: any;
    isBillSummary:any;
    search_data?: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-bill",
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId);
        query.push("consumer_number", params.remoteConsumerNumber);
        query.push(
          "is_pagination_required",
          params.isPaginationRequired.toString()
        );
          query.push("is_bill_summary", params.isBillSummary);
        if (params.search_data) {
          query.push("search_data", params.search_data);
        }
      }
    );
    const response = await consumerApiClient.get(url);
    return response.data;
  },


  getPaymentAgreementDetail: async (params: {
    remote_utility_id: string;
    consumer_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "payment-agreement/detail",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("consumer_id", params.consumer_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },


getCreditNoteList: async (params: {
  remote_utility_id: string;
  consumer_id: string;
  payment_pay_type: any;
  page: any;
  limit: any;
  search_data?: string;
}): Promise<any> => {
  const url = ApiEndpoints.createUrlWithQueryParameters(
    "consumerWeb",
    "credit-note",
    (qs) => {
      qs.push("remote_utility_id", params.remote_utility_id);
      qs.push("consumer_id", params.consumer_id);
      qs.push("payment_pay_type", params.payment_pay_type);
      qs.push("page", params.page);
      qs.push("limit", params.limit);
      if (params.search_data) {
        qs.push("search_data", params.search_data);
      }
    }
  );
  const response = await cxApiClient.get(url);
  return response.data;
},
  getServicesData: async (params: {
    remote_utility_id: string;
    consumer_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "consumer-service-request",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("consumer_id", params.consumer_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },

  downloadBillTemplate: async (params: { billId: string }): Promise<Blob> => {
    const response = await bxApiClient.get(
      `render-dynamic-template/${params.billId}/`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },

  getPaymentHistory: async (params: {
    remote_utility_id: string;
    consumer_id: string;
    page: any;
    limit: any;
    search_data?: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb", // or your endpoint path
      "payment", // adjust endpoint
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("consumer_id", params.consumer_id);
        qs.push("page", params.page);
        qs.push("limit", params.limit);
        if (params.search_data) {
          qs.push("search_data", params.search_data);
        }
      }
    );
    const response = await cxApiClient.get(url); // adjust client
    return response.data;
  },
  getPaymentStatus: async (params: {
    remote_utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "choices/payment_received_status",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },
  getPaymentPayType: async (params: {
    remote_utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "consumerWeb",
      "choices/payment_pay_type",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
      }
    );
    const response = await cxApiClient.get(url);
    return response.data;
  },

      payBill: async (
      payload: PaymentPayload
    ): Promise<any> => {
      const url = ApiEndpoints.createUrl("consumerWeb", "payment");
      const response = await cxApiClient.post(url, payload);
      return response.data;
    },

  getPSPConfigurationDetails: async (remoteUtilityId: string) :Promise<any> => {
  const url = ApiEndpoints.createUrlWithQueryParameters(
    'payment',
    'psp',
    query => {
      query.push('remote_utility_id', remoteUtilityId);
    }
  );
  const response = await paymentApiClient.get(url);
  return response.data.result;
},

 connectPaymentMethod:  async (payload: any) => {
  const url = ApiEndpoints.createUrl("payment", "initiate-payment");
  const response = await paymentApiClient.post(url, payload);
  return response.data.result ?? null;
},

};
