// features/complaints/hooks.ts
import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { queryClient } from "@shared/api/queries/queryClient";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { formDataToJson } from "@shared/utils/jsonToObjectTransformer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreateNoteInput, NoteFilters } from "../shared/types/notesTabProps";
import { complaintsApi, getConsumerComplaintSummary } from "./api";
import {
  ComplaintCategoryFilters,
  ComplaintFilters,
  ComplaintSubCategoryFilters,
  UpdateComplaintStatus,
} from "./types";

// ================================
// QUERY HOOKS (Data Fetching)
// ================================

/**
 * Get current/active complaints with filtering and pagination
 */
export const useCurrentComplaints = (filters: ComplaintFilters = {}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.complaintList(filters),
    () => complaintsApi.getCurrent(filters),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

/**
 * Get historical complaints with filtering and pagination
 */
export const useHistoricalComplaints = (filters: ComplaintFilters = {}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.complaintHistory(filters),
    () => complaintsApi.getHistory(filters)
  );
};

/**
 * Get single complaint details
 */
export const useComplaintDetails = (id: number) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.complaintDetails(id.toString()),
    () => complaintsApi.getDetails(id),
    {
      enabled: !!id, // Only run query if ID exists
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
};

/**
 * Get complaint configurations/types
 */
export const useComplaintConfigurations = (remoteUtilityId: number) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.complaintConfigurations(
      remoteUtilityId
    ),
    () => complaintsApi.getConfigurations(remoteUtilityId),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes (configurations don't change often)
      enabled: !!remoteUtilityId,
    }
  );
};

/**
 * Get status choices
 */
export const useComplaintStatusChoices = () => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.complaintStatusChoices(),
    complaintsApi.getStatusChoices,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes (status choices rarely change)
    }
  );
};

/**
 * Get dashboard summary data
 */
export const useComplaintsSummary = (remoteUtilityId: number) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.complaintSummary(remoteUtilityId),
    () => complaintsApi.getSummary(remoteUtilityId),
    {
      refetchInterval: 300 * 1000, // Refresh every 30 seconds
      staleTime: 30 * 1000,
      enabled: !!remoteUtilityId,
    }
  );
};

// ================================
// MUTATION HOOKS (Data Updates)
// ================================

/**
 * Create new complaint
 */
export const useCreateComplaint = () => {
  const navigate = useNavigate();
  return useSmartMutation(
    (payload: { data: any }) => complaintsApi.create(payload.data),
    {
      onSuccess: async (data, variables) => {
        await queryClient.invalidateQueries({
          queryKey: [QueryKeyFactory.module.cx.complaints.complaintList()],
          exact: false,
        });

        toast.success("Complaint created successfully!");

        // Convert FormData to JSON if it's FormData
        const formDataJson =
          variables.data instanceof FormData
            ? formDataToJson(variables.data)
            : variables.data;

        navigate("/cx/complaints/success", {
          state: { ...data, formData: formDataJson },
        });
      },
      onError: async (error: any) => {
        toast.error(`Failed to create complaint: ${error.message}`);
        await queryClient.refetchQueries({
          queryKey: QueryKeyFactory.module.cx.complaints.complaintList(),
          exact: false,
        });
      },
    }
  );
};

/**
 * Acknowledge complaint
 */
export const useAcknowledgeComplaint = (remoteUtilityId: number) => {
  return useSmartMutation(complaintsApi.acknowledge, {
    invalidateKeys: [
      QueryKeyFactory.module.cx.complaints.complaintList(),
      QueryKeyFactory.module.cx.complaints.complaintSummary(remoteUtilityId),
    ],
    onSuccess: (data) => {
      QueryKeyFactory.module.cx.complaints.complaintDetails(data.id.toString());
      toast.success("Complaint acknowledged successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to acknowledge complaint: ${error.message}`);
    },
  });
};

/**
 * Hold complaint
 */
export const useHoldComplaint = (remoteUtilityId: number) => {
  return useSmartMutation(complaintsApi.hold, {
    invalidateKeys: [
      QueryKeyFactory.module.cx.complaints.complaintList(),
      QueryKeyFactory.module.cx.complaints.complaintSummary(remoteUtilityId),
    ],
    onSuccess: (data) => {
      QueryKeyFactory.module.cx.complaints.complaintDetails(data.id.toString());
      toast.success("Complaint put on hold successfully!");
    },
    onError: (error: any) => {
      toast.error(`Failed to hold complaint: ${error.message}`);
    },
  });
};

/**
 * Reject complaint
 */
export const useRejectComplaint = (remoteUtilityId: number) => {
  return useSmartMutation(
    ({ id, closeDate }: { id: number; closeDate: string }) =>
      complaintsApi.reject(id, closeDate),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.complaints.complaintList(),
        QueryKeyFactory.module.cx.complaints.complaintHistory(),
        QueryKeyFactory.module.cx.complaints.complaintSummary(remoteUtilityId),
      ],
      onSuccess: (data) => {
        QueryKeyFactory.module.cx.complaints.complaintDetails(
          data.id.toString()
        );
        toast.success("Complaint rejected successfully!");
      },
      onError: (error: any) => {
        toast.error(`Failed to reject complaint: ${error.message}`);
      },
    }
  );
};

/**
 * Resolve complaint
 */
export const useResolveComplaint = (remoteUtilityId: number) => {
  return useSmartMutation(
    ({ id, closeDate }: { id: number; closeDate: string }) =>
      complaintsApi.resolve(id, closeDate),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.complaints.complaintList(),
        QueryKeyFactory.module.cx.complaints.complaintHistory(),
        QueryKeyFactory.module.cx.complaints.complaintSummary(remoteUtilityId),
      ],
      onSuccess: (data) => {
        QueryKeyFactory.module.cx.complaints.complaintDetails(
          data.id.toString()
        );
        toast.success("Complaint resolved successfully!");
      },
      onError: (error: any) => {
        toast.error(`Failed to resolve complaint: ${error.message}`);
      },
    }
  );
};

/**
 * Generic status update
 */
export const useUpdateComplaintStatus = (remoteUtilityId: number) => {
  return useSmartMutation(
    ({
      requestId,
      payload,
    }: {
      requestId: number;
      payload: UpdateComplaintStatus;
    }) => complaintsApi.updateStatus(requestId, payload),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.complaints.complaintList(),
        QueryKeyFactory.module.cx.complaints.complaintHistory(),
        QueryKeyFactory.module.cx.complaints.complaintSummary(remoteUtilityId),
      ],
      onSuccess: (data, variables) => {
        QueryKeyFactory.module.cx.complaints.complaintDetails(
          variables.requestId.toString()
        );
        toast.success("Complaint status updated successfully!");
        queryClient.invalidateQueries({
          queryKey: QueryKeyFactory.module.cx.complaints.complaintDetails(
          variables.requestId.toString()
        )
        })
      },
      onError: (error: any) => {
        toast.error(`Failed to update complaint status: ${error.message}`);
      },
    }
  );
};

/**
 * Auto-save step data during stepper flow
 */
export const useStepAutoSave = () => {
  return useSmartMutation(complaintsApi.saveStep, {
    onError: (error: any) => {
      console.warn("Auto-save failed:", error);
    },
  });
};

// Search consumer
export const useSearchConsumer = (
  searchTerm: string,
  remoteUtilityId: number
) => {
  const query = useSmartQuery(
    QueryKeyFactory.module.cx.consumers.consumerSearch(
      searchTerm,
      remoteUtilityId
    ),
    async () => {
      const result = await complaintsApi.searchConsumer({
        remoteUtilityId,
        requestType: "Complaint",
        searchData: searchTerm,
      });
      return result;
    },
    {
      enabled: searchTerm.length >= 3,
      staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
      refetchOnWindowFocus: true,
      retry: false, // Don't retry failed requests
    }
  );

  // Debug log to check query results
  useEffect(() => {
    console.log("Search Consumer Query State:", {
      data: query.data,
      isLoading: query.isLoading,
      error: query.error,
      isError: query.isError,
      status: query.status,
    });
  }, [query.data, query.isLoading, query.error, query.isError, query.status]);

  return query;
};

// Get consumer metadata
export const useConsumerMetadata = (
  consumer_id: string,
  remoteUtilityId: number
) => {
  const query = useSmartQuery(
    QueryKeyFactory.module.cx.consumers.consumerMetadata(
      consumer_id,
      remoteUtilityId
    ),
    async () => {
      const result = await complaintsApi.getConsumerMetaData({
        consumerId: Number(consumer_id),
        remoteUtilityId,
      });
      return result;
    },
    {
      staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
      refetchOnWindowFocus: true,
      retry: false, // Don't retry failed requests
    }
  );

  // Debug log to check query results
  useEffect(() => {
    console.log("Search Consumer Query State:", {
      data: query.data,
      isLoading: query.isLoading,
      error: query.error,
      isError: query.isError,
      status: query.status,
    });
  }, [query.data, query.isLoading, query.error, query.isError, query.status]);

  return query;
};

export const useComplaintStatus = (params: { remoteUtilityId: number }) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.status(params.remoteUtilityId), // Include params in query key for caching
    () => complaintsApi.getStatus(params)
  );
};

// Hook for setup progress (original)
export const useComplaintCategory = (filters: ComplaintCategoryFilters) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.category(filters.remoteUtilityId),
    () => complaintsApi.getComplaintCategory(filters),
    {
      enabled: !!filters.remoteUtilityId && !!filters.requestType,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

/**
 * Get complaint types as dropdown items
 */
export const useComplaintCategoryDropdown = (
  filters: ComplaintCategoryFilters
) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.categoryDropdown(),
    () => complaintsApi.getComplaintCategoryDropdown(filters),
    {
      enabled: !!filters.remoteUtilityId && !!filters.requestType,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

/**
 * Get complaint sub types (raw data)
 */
export const useComplaintSubCategory = (
  filters: ComplaintSubCategoryFilters
) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.subCategory(
      filters.remoteUtilityId,
      filters.codeList
    ),
    () => complaintsApi.getComplaintSubCategory(filters),
    {
      enabled:
        !!filters.remoteUtilityId &&
        !!filters.codeList &&
        !!filters.configLevel,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

/**
 * Get complaint sub types as dropdown items
 */
export const useComplaintSubCategoryDropdown = (
  filters: ComplaintSubCategoryFilters
) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.subCategoryDropdown(
      filters.remoteUtilityId,
      filters.codeList
    ),
    () => complaintsApi.getComplaintSubCategoryDropdown(filters),
    {
      enabled:
        !!filters.remoteUtilityId &&
        !!filters.codeList &&
        !!filters.configLevel,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

// ================================
// SERVICE REQUEST NOTES HOOKS
// ================================

/**
 * Get service request notes
 */
export const useComplaintNotes = (filters: NoteFilters) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.serviceRequests.notes(filters),
    () => complaintsApi.getComplaintNotes(filters),
    {
      enabled: !!filters.requestId,
      staleTime: 1 * 60 * 1000,
    }
  );
};

/**
 * Create service request note
 */
export const useCreateComplaintNote = (requestId: string) => {
  return useSmartMutation(
    (payload: CreateNoteInput) => complaintsApi.createComplaintNote(payload),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.complaints.complaintDetails(requestId),
        QueryKeyFactory.module.cx.complaints.complaintList(),
      ],
      onSuccess: () => {
        toast.success("Note added successfully!");
      },
      onError: (error: any) => {
        toast.error(`Failed to add note: ${error.message}`);
      },
    }
  );
};

export const useConsumerComplaintSummary = (remoteUtilityId: string, config: string, requestType: string) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaints.consumerComplaintSummary(requestType),
    () => getConsumerComplaintSummary(remoteUtilityId, config, requestType),
    {
      enabled: !!remoteUtilityId
    }
  );
};