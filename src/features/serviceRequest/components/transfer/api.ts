// features/cx/transfer/api.ts

import {
  UtilityConfigFilters,
  UtilityRequestConfiguration,
} from "@features/cx/shared/types/consumerRequest";
import { ApiEndpoints } from "@shared/api/api-endpoints";
import { cxApiClient } from "@shared/api/clients/apiClientFactory";
import { ApiResponse, DropdownItem } from "@shared/api/types";
import { getRemoteUtilityId } from "@shared/utils/getUtilityId";
import { transformJsonToObject } from "@shared/utils/jsonToObjectTransformer";
import {
  BulkTransferOperation,
  ConsumerMetaData,
  ConsumerRelationChoice,
  ConsumerSearchFilters,
  ConsumerSearchResult,
  DocumentUpdatePayload,
  TransferFilters,
  TransferRequest,
  TransferRequestDetail,
  TransferSummary,
  UpdateTransferRequestPayload,
} from "./types";

// API Functions
export const transferApi = {
  // Consumer Search
  searchConsumer: async (
    filters: ConsumerSearchFilters
  ): Promise<{ result: ConsumerSearchResult[] }> => {
    const REMOTE_UTILITY_ID = getRemoteUtilityId();
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "consumer-search/info",
      (query) => {
        query.push("remote_utility_id", REMOTE_UTILITY_ID);
        query.push("request_type", filters.requestType);
        query.push("search_data", filters.searchData);
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: ConsumerSearchResult[] }>(
      response.data
    );
  },
 getConsumerRelation: async (): Promise<any> => {
    const url = ApiEndpoints.createUrl('cx', 'choices/consumer_relation');
    const response = await cxApiClient.get(url);
    return response.data;
  },
  // Consumer Meta Data
  getConsumerMetaData: async (params: {
    consumerId: number;
    remoteUtilityId: number;
  }): Promise<{ result: ConsumerMetaData }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "consumer-meta-data",
      (query) => {
        query.push("consumer_id", params.consumerId.toString());
        query.push("remote_utility_id", params.remoteUtilityId.toString());
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: ConsumerMetaData }>(response.data);
  },

  // Utility Request Configuration
  getUtilityRequestConfiguration: async (
    filters: UtilityConfigFilters
  ): Promise<{ result: UtilityRequestConfiguration[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "utility-request-configuration",
      (query) => {
        query.push("remote_utility_id", filters.remoteUtilityId.toString());
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

  // Consumer Relation Choices
  getConsumerRelationChoices: async (): Promise<{
    result: ConsumerRelationChoice[];
  }> => {
    const url = ApiEndpoints.createUrl("cx", "choices/consumer_relation");
    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: ConsumerRelationChoice[] }>(
      response.data
    );
  },

  // Transfer Request List
  getTransferRequests: async (
    filters: TransferFilters
  ): Promise<ApiResponse<TransferRequest[]>> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "consumer-transfer-request",
      (query) => {
        if (filters.remoteUtilityId)
          query.push("remote_utility_id", filters.remoteUtilityId.toString());
        if (filters.requestType)
          query.push("request_type", filters.requestType);
        if (filters.activeTab) query.push("active_tab", filters.activeTab);
        if (filters.page) query.push("page", filters.page.toString());
        if (filters.limit) query.push("limit", filters.limit.toString());
        if (filters.searchData) query.push("search_data", filters.searchData);
        if (filters.status) query.push("status", filters.status);
        if (filters.name) query.push("name", filters.name);
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<ApiResponse<TransferRequest[]>>(response.data);
  },

  // Create Transfer Request (using FormData for file uploads)
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

  // Get Transfer Request Detail
  getTransferRequestDetail: async (
    requestId: number,
    remoteUtilityId: number
  ): Promise<{ result: TransferRequestDetail }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "consumer-transfer-request/detail",
      (query) => {
        query.push("request_id", requestId.toString());
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: TransferRequestDetail }>(
      response.data
    );
  },

  // Update Transfer Request
  updateTransferRequest: async (
    requestId: number,
    payload: UpdateTransferRequestPayload
  ): Promise<TransferRequest> => {
    const url = ApiEndpoints.createUrlWithPathVariables(
      "cx",
      "consumer-transfer-request",
      [requestId.toString()]
    );
    const response = await cxApiClient.put(url, payload);
    return transformJsonToObject<TransferRequest>(response.data);
  },

  // Delete Transfer Request
  deleteTransferRequest: async (requestId: number): Promise<void> => {
    const url = ApiEndpoints.createUrlWithPathVariables(
      "cx",
      "consumer-transfer-request",
      [requestId.toString()]
    );
    await cxApiClient.delete(url);
  },

  // Get Transfer Summary
  getTransferSummary: async (params: {
    remoteUtilityId: number;
    requestType: string;
  }): Promise<TransferSummary> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "consumer-transfer-request/summary",
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId.toString());
        query.push("request_type", params.requestType);
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<TransferSummary>(response.data.result);
  },

  // Document Operations
  updateDocument: async (
    requestId: number,
    payload: DocumentUpdatePayload
  ): Promise<TransferRequest> => {
    return transferApi.updateTransferRequest(requestId, payload);
  },

  approveDocument: async (
    requestId: number,
    documentId: number
  ): Promise<TransferRequest> => {
    return transferApi.updateDocument(requestId, {
      documentId,
      documentStatus: 1, // Approved
    });
  },

  rejectDocument: async (
    requestId: number,
    documentId: number
  ): Promise<TransferRequest> => {
    return transferApi.updateDocument(requestId, {
      documentId,
      documentStatus: 2, // Rejected
    });
  },

  // Status Change Operations
  approveTransferRequest: async (
    requestId: number,
    acknowledgeTime?: string
  ): Promise<TransferRequest> => {
    const payload: UpdateTransferRequestPayload = {
      status: 4, // Approved/In Progress status
    };

    if (acknowledgeTime) {
      payload.actualAcknowledgeTime = acknowledgeTime;
    }

    return transferApi.updateTransferRequest(requestId, payload);
  },

  rejectTransferRequest: async (
    requestId: number,
    remarks: string,
    closeDate: string
  ): Promise<TransferRequest> => {
    const payload: UpdateTransferRequestPayload = {
      status: 3, // Rejected status
      closeDate,
      closureRemark: remarks,
    };
    return transferApi.updateTransferRequest(requestId, payload);
  },

  acknowledgeTransferRequest: async (
    requestId: number,
    acknowledgeTime: string
  ): Promise<TransferRequest> => {
    const payload: UpdateTransferRequestPayload = {
      status: 4, // Acknowledged/In Progress status
      actualAcknowledgeTime: acknowledgeTime,
    };
    return transferApi.updateTransferRequest(requestId, payload);
  },

  completeTransferRequest: async (
    requestId: number,
    closeDate: string
  ): Promise<TransferRequest> => {
    const payload: UpdateTransferRequestPayload = {
      status: 2, // Completed status
      closeDate,
    };
    return transferApi.updateTransferRequest(requestId, payload);
  },

  holdTransferRequest: async (
    requestId: number,
    remarks?: string
  ): Promise<TransferRequest> => {
    const payload: UpdateTransferRequestPayload = {
      status: 7, // On Hold status
      closureRemark: remarks,
    };
    return transferApi.updateTransferRequest(requestId, payload);
  },

  // Bulk Operations
  bulkUpdateTransferRequests: async (
    operation: BulkTransferOperation
  ): Promise<any> => {
    const url = ApiEndpoints.createUrl(
      "cx",
      "consumer-transfer-request/bulk-update"
    );
    const response = await cxApiClient.post(url, operation);
    return response.data;
  },

  // Complete Transfer Workflow
  completeTransferWorkflow: async (params: {
    requestId: number;
    documentsApproved: boolean;
    transferData?: any;
  }): Promise<any> => {
    // Step 1: Ensure all documents are approved
    if (!params.documentsApproved) {
      throw new Error(
        "All documents must be approved before completing transfer"
      );
    }

    // Step 2: Approve the transfer request
    await transferApi.approveTransferRequest(params.requestId);

    // Step 3: Complete the transfer
    const closeDate = new Date().toISOString();
    return await transferApi.completeTransferRequest(
      params.requestId,
      closeDate
    );
  },

  getStatus: async (params: {
    remoteUtilityId: number;
  }): Promise<{ result: DropdownItem[] }> => {
    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "cx",
      "choices",
      ["document_status"],
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId.toString());
        return query;
      }
    );
    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: DropdownItem[] }>(response.data);
  },

 getCategory: async (params: {
    remoteUtilityId: number;
  }): Promise<{ result: any[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "utility-request-configuration",
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId);
        query.push("request_type", "Transfer");
        query.push("disable_pagination", true);
        return query;
      }
    );
    const response = await cxApiClient.get(url);
    return response?.data.result.map((item) => ({
      label: item.name,
      value: item.name,
    }));
  },

  // Update Consumer Document (verify/reject)
  updateConsumerDocument: async (
    requestId: any,
    payload: { documentId: any; documentStatus: number }
  ): Promise<any> => {
    const url = ApiEndpoints.createUrlWithPathVariables(
      'cx',
      'consumer-transfer-request',
      [requestId]
    );
    const response = await cxApiClient.put(url, payload);
    return response.data;
  },
};


