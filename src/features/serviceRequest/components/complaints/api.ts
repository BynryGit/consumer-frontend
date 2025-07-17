import { ApiEndpoints } from "@shared/api/api-endpoints";
import {
  cxApiClient,
  onboardingApiClient,
} from "@shared/api/clients/apiClientFactory";
import { DropdownItem, DropdownLabelValue } from "@shared/api/types";
import { QueryStringParameters } from "@shared/api/url-builder";
import { PAGE_SIZE } from "@shared/utils/constants";
import { transformJsonToObject } from "@shared/utils/jsonToObjectTransformer";
import {
  ConsumerMetaData,
  ConsumerSearchResult,
} from "../shared/types/consumerRequest";
import {
  CreateNoteInput,
  Note,
  NoteFilters,
} from "../shared/types/notesTabProps";
import {
  Complaint,
  ComplaintCategoryFilters,
  ComplaintConfiguration,
  ComplaintFilters,
  ComplaintStatusChoice,
  ComplaintSubCategoryFilters,
  ConsumerComplaintSummary,
  PaginatedComplaintsResponse,
  StepSaveData,
  SupportRequestConfig,
  UpdateComplaintStatus,
} from "./types";

// API Functions
export const complaintsApi = {
  // Create new complaint
  create: async (data: any): Promise<Complaint> => {
    const response = await cxApiClient.post<Complaint>(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-complaint-request"
      ),
      data
    );
    return response.data;
  },

  // Get current/active complaints with filters
  getCurrent: async (
    filters: ComplaintFilters = {}
  ): Promise<PaginatedComplaintsResponse> => {
    const params = new QueryStringParameters();

    // Default parameters

    // Add filters
    if (filters.remoteUtilityId)
      params.push("remote_utility_id", filters.remoteUtilityId.toString());

    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "cx",
      "consumer-complaint-request",
      [],
      (params) => {
        params.push("request_type", "Complaint");
        params.push("active_tab", "Current");
        // Add filters
        if (filters.remoteUtilityId)
          params.push("remote_utility_id", filters.remoteUtilityId.toString());
        if (filters.status?.length) {
          filters.status.forEach((status) =>
            params.push("status", status.toString())
          );
        }
        if (filters.name) params.push("name", filters.name);
        if (filters.severityLevel?.length) {
          filters.severityLevel.forEach((level) =>
            params.push("severity_level", level)
          );
        }
        if (filters.slaStatus?.length) {
          filters.slaStatus.forEach((status) =>
            params.push("sla_status", status)
          );
        }
        if (filters.dateRange?.start)
          params.push("start_date", filters.dateRange.start);
        if (filters.dateRange?.end)
          params.push("end_date", filters.dateRange.end);
        if (filters.page) params.push("page", filters.page.toString());
        if (filters.limit) params.push("limit", filters.limit.toString());
        if (filters.searchData)
          params.push("search_data", filters.searchData.toString());

        return params;
      }
    );

    const response = await cxApiClient.get<PaginatedComplaintsResponse>(url);
    const transformedResponse =
      transformJsonToObject<PaginatedComplaintsResponse>(response.data);
    return transformedResponse;
  },

  getConsumerMetaData: async (params: {
    consumerId: number;
    remoteUtilityId: number;
  }): Promise<ConsumerMetaData> => {
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
    return transformJsonToObject<ConsumerMetaData>(response.data.result);
  },

  searchConsumer: async (params: {
    remoteUtilityId: number;
    requestType: string;
    searchData: string;
  }): Promise<{ result: ConsumerSearchResult[] }> => {
    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "cx",
      "consumer-search",
      ["info"],
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId.toString());
        query.push("request_type", params.requestType);
        query.push("search_data", params.searchData);
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: ConsumerSearchResult[] }>(
      response.data
    );
  },

  // Get historical complaints with filters
  getHistory: async (
    filters: ComplaintFilters = {}
  ): Promise<PaginatedComplaintsResponse> => {
    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "cx",
      "consumer-complaint-request",
      [],
      (params) => {
        params.push("request_type", "Complaint");
        params.push("active_tab", "History");
        // Add filters
        if (filters.remoteUtilityId)
          params.push("remote_utility_id", filters.remoteUtilityId.toString());
        if (filters.status?.length) {
          filters.status.forEach((status) =>
            params.push("status", status.toString())
          );
        }
        if (filters.name) params.push("name", filters.name);
        if (filters.severityLevel?.length) {
          filters.severityLevel.forEach((level) =>
            params.push("severity_level", level)
          );
        }
        if (filters.slaStatus?.length) {
          filters.slaStatus.forEach((status) =>
            params.push("sla_status", status)
          );
        }
        if (filters.dateRange?.start)
          params.push("start_date", filters.dateRange.start);
        if (filters.dateRange?.end)
          params.push("end_date", filters.dateRange.end);
        if (filters.page) params.push("page", filters.page.toString());
        if (filters.limit) params.push("limit", filters.limit.toString());
        if (filters.searchData)
          params.push("search_data", filters.searchData.toString());

        return params;
      }
    );

    const response = await cxApiClient.get<PaginatedComplaintsResponse>(url);
    return response.data;
  },

  // Get single complaint details
  getDetails: async (id: number): Promise<Complaint> => {
    const response = await cxApiClient.get<{ result: Complaint }>(
      ApiEndpoints.createUrlWithPathAndQueryVariables(
        "cx",
        "consumer-complaint-request",
        ["detail"],
        (query) => {
          query.push("request_id", id.toString());
          return query;
        }
      )
    );
    console.log(
      transformJsonToObject<Complaint>(response.data.result),
      "trsndformed data"
    );
    return transformJsonToObject<Complaint>(response.data.result);
  },

  // Acknowledge complaint (status = 4)
  acknowledge: async (id: number): Promise<Complaint> => {
    const response = await cxApiClient.put<Complaint>(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-complaint-request",
        [id]
      ),
      {
        status: 4,
      }
    );
    return response.data;
  },

  // Hold complaint (status = 7)
  hold: async (id: number): Promise<Complaint> => {
    const response = await cxApiClient.put<Complaint>(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-complaint-request",
        [id]
      ),
      {
        status: 7,
      }
    );
    return response.data;
  },

  // Reject complaint (status = 3)
  reject: async (id: number, closeDate: string): Promise<Complaint> => {
    const response = await cxApiClient.put<Complaint>(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-complaint-request",
        [id]
      ),
      {
        close_date: closeDate,
        status: 3,
      }
    );
    return response.data;
  },

  // Resolve complaint (status = 2)
  resolve: async (id: number, closeDate: string): Promise<Complaint> => {
    const response = await cxApiClient.put<Complaint>(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-complaint-request",
        [id]
      ),
      {
        close_date: closeDate,
        status: 2,
      }
    );
    return response.data;
  },

  // Generic status update
  updateStatus: async (
    id: number,
    data: UpdateComplaintStatus
  ): Promise<Complaint> => {
    const response = await cxApiClient.put<Complaint>(
      ApiEndpoints.createUrlWithPathVariables(
        "cx",
        "consumer-complaint-request",
        [id]
      ),
      data
    );
    return response.data;
  },

  // Get complaint configurations/types
  getConfigurations: async (
    remoteUtilityId: number
  ): Promise<ComplaintConfiguration[]> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
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

    const response = await cxApiClient.get<{
      result: ComplaintConfiguration[];
    }>(url);
    return response.data.result || [];
  },

  // Get status choices
  getStatusChoices: async (): Promise<ComplaintStatusChoice[]> => {
    const response = await cxApiClient.get<{ result: ComplaintStatusChoice[] }>(
      ApiEndpoints.createUrlWithPathVariables("cx", "choices", [
        "consumer_support_request_status",
      ])
    );
    return response.data.result || [];
  },

  // Auto-save step data (for stepper flow)
  saveStep: async (
    data: StepSaveData
  ): Promise<{ success: boolean; message: string }> => {
    // Since we only call API at the end, we'll store this in session storage or return success
    // This is a placeholder for auto-save functionality
    try {
      if (typeof window !== "undefined") {
        const key = data.requestId
          ? `complaint-${data.requestId}-step-${data.stepIndex}`
          : `complaint-draft-step-${data.stepIndex}`;
        sessionStorage.setItem(key, JSON.stringify(data.stepData));
      }
      return { success: true, message: "Step data saved locally" };
    } catch (error) {
      return { success: false, message: "Failed to save step data" };
    }
  },

  getStatus: async (params: {
    remoteUtilityId: number;
  }): Promise<{ result: DropdownItem[] }> => {
    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "cx",
      "choices",
      ["consumer_support_request_status"],
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId.toString());
        return query;
      }
    );
    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: DropdownItem[] }>(response.data);
  },

  getComplaintCategory: async (
    filters: ComplaintCategoryFilters
  ): Promise<{ result: SupportRequestConfig[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "onboarding",
      "config-map/support_requests_json",
      (query) => {
        query.push("remote_utility_id", filters.remoteUtilityId.toString());
        query.push("request_type", filters.requestType);
        return query;
      }
    );

    const response = await onboardingApiClient.get(url);
    return transformJsonToObject<{ result: SupportRequestConfig[] }>(
      response.data
    );
  },

  // Get Complaint Sub Types
  getComplaintSubCategory: async (
    filters: ComplaintSubCategoryFilters
  ): Promise<{ result: SupportRequestConfig[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "onboarding",
      "config-map/support_requests_json",
      (query) => {
        query.push("remote_utility_id", filters.remoteUtilityId.toString());
        query.push("code_list", filters.codeList);
        query.push("config_level", filters.configLevel);
        return query;
      }
    );

    const response = await onboardingApiClient.get(url);
    return transformJsonToObject<{ result: SupportRequestConfig[] }>(
      response.data
    );
  },

  // Get Complaint Types as Dropdown Items
  getComplaintCategoryDropdown: async (
    filters: ComplaintCategoryFilters
  ): Promise<DropdownLabelValue[]> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "utility-request-configuration",
      (query) => {
        query.push("remote_utility_id", filters.remoteUtilityId);
        query.push("request_type", filters.requestType);
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

  // Get Complaint Sub Types as Dropdown Items
  getComplaintSubCategoryDropdown: async (
    filters: ComplaintSubCategoryFilters
  ): Promise<DropdownItem[]> => {
    const response = await complaintsApi.getComplaintSubCategory(filters);
    return response.result.map((item) => ({
      key: item.code,
      value: item.name,
    }));
  },
  // Get summary/dashboard data
  getSummary: async (
    remoteUtilityId: number
  ): Promise<{
    totalActive: number;
    pendingAcknowledgment: number;
    inProgress: number;
    breachedSLA: number;
    recentActivity: Array<{
      id: string;
      action: string;
      timestamp: string;
      user: string;
      complaint_no: string;
    }>;
  }> => {
    // This would typically be a dedicated summary endpoint
    // For now, we'll simulate by getting current complaints and processing them
    const currentComplaints = await complaintsApi.getCurrent({
      remoteUtilityId: remoteUtilityId,
      limit: PAGE_SIZE, // Get all for summary calculation
    });

    const complaints = currentComplaints.results;

    return {
      totalActive: complaints.length,
      pendingAcknowledgment: complaints.filter((c) => c.status === "new")
        .length, // CREATED
      inProgress: complaints.filter((c) => c.status === "in progress").length, // IN PROGRESS
      breachedSLA: complaints.filter((c) => c.slaStatus === "Breached").length,
      recentActivity: complaints.slice(0, 5).map((complaint) => ({
        id: complaint.id,
        action: `Complaint ${complaint.statusDisplay}`,
        timestamp: complaint.createdDate,
        user: complaint.createdUserRemoteName || "System",
        complaint_no: complaint.requestNo,
      })),
    };
  },

  // Service Request Notes
  createComplaintNote: async (
    payload: CreateNoteInput
  ): Promise<{ result: Note[] }> => {
    const url = ApiEndpoints.createUrlWithPathVariables(
      "cx",
      "consumer-request",
      ["notes"]
    );
    const response = await cxApiClient.post(url, payload);
    return transformJsonToObject<{ result: Note[] }>(response.data);
  },

  getComplaintNotes: async (
    filters: NoteFilters
  ): Promise<{ result: Note[] }> => {
    const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
      "cx",
      "consumer-request",
      ["notes"],
      (query) => {
        if (filters.remoteUtilityId)
          query.push("remote_utility_id", filters.remoteUtilityId.toString());
        if (filters.requestId)
          query.push("request_id", filters.requestId.toString());
        if (filters.noteType) query.push("note_type", filters.noteType);
        return query;
      }
    );

    const response = await cxApiClient.get(url);
    return transformJsonToObject<{ result: Note[] }>(response.data);
  },

  getCategory: async (params: {
    remoteUtilityId: number;
  }): Promise<{ result: any[] }> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "utility-request-configuration",
      (query) => {
        query.push("remote_utility_id", params.remoteUtilityId);
        query.push("request_type", "Complaint");
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
};

export const getConsumerComplaintSummary = async (
  remoteUtilityId: string,
  config: string,
  requestType: string
): Promise<ConsumerComplaintSummary> => {
  const url = ApiEndpoints.createUrlWithPathAndQueryVariables(
    "cx",
    "consumer-complaint-request",
    [config],
    (query) => {
      query.push("remote_utility_id", remoteUtilityId);
      query.push("request_type", requestType);
    }
  );

  const response = await cxApiClient.get(url);
  return transformJsonToObject<ConsumerComplaintSummary>(response.data.result);
};