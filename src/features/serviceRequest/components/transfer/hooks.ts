// features/cx/transfer/hooks.ts

import { useSmartQuery, useSmartMutation } from '@shared/api/queries/hooks';
import { QueryKeyFactory } from '@shared/api/queries/queryKeyFactory';
import { useState, useCallback } from 'react';
import { transferApi } from './api';
import { toast } from 'sonner';
import {
  TransferFilters,
  ConsumerSearchFilters,
  CreateTransferRequestPayload,
  UpdateTransferRequestPayload,
  DocumentUpdatePayload,
  BulkTransferOperation,
} from './types';
import { useNavigate } from 'react-router-dom';
import { UtilityConfigFilters } from '@features/cx/shared/types/consumerRequest';
import { formDataToJson } from '@shared/utils/jsonToObjectTransformer';


// ================================
// CONSUMER SEARCH HOOKS
// ================================

/**
 * Search consumers for transfer
 */
export const useConsumerSearch = (filters: ConsumerSearchFilters) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.consumerSearch(filters),
    () => transferApi.searchConsumer(filters),
    {
      enabled: filters.searchData.length >= 3,
      staleTime: 5 * 60 * 1000,
      retry: false
    }
  );
};

/**
 * Get consumer meta data
 */
export const useConsumerMetaData = (params: {
  consumerId: number;
  remoteUtilityId: number;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.consumerMetaData(params),
    () => transferApi.getConsumerMetaData(params),
    {
      enabled: !!params.consumerId,
      staleTime: 5 * 60 * 1000,
    }
  );
};

/**
 * Get utility request configuration
 */
export const useUtilityRequestConfiguration = (filters: UtilityConfigFilters) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.utilityConfig(filters),
    () => transferApi.getUtilityRequestConfiguration(filters),
    {
      enabled: !!filters.remoteUtilityId && !!filters.requestType,
      staleTime: 10 * 60 * 1000,
    }
  );
};

/**
 * Get consumer relation choices
 */
export const useConsumerRelationChoices = () => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.consumerRelationChoices(),
    () => transferApi.getConsumerRelationChoices(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

// ================================
// TRANSFER REQUEST HOOKS
// ================================

/**
 * Get transfer requests list with tab support (Current/History)
 */
export const useTransferRequestsWithTab = (
  remoteUtilityId: number,
  activeTab: 'Current' | 'History',
  additionalFilters: Partial<TransferFilters> = {}
) => {
  const filters: TransferFilters = {
    remoteUtilityId,
    activeTab,
    requestType: 'Transfer',
    page: 1,
    limit: 50,
    ...additionalFilters,
  };

  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.list(filters),
    () => transferApi.getTransferRequests(filters),
    {
      enabled: !!remoteUtilityId,
      staleTime: 2 * 60 * 1000,
    }
  );
};

/**
 * Get transfer requests list
 */
export const useTransferRequests = (filters: TransferFilters) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.list(filters),
    () => transferApi.getTransferRequests(filters),
    {
      enabled: !!filters.remoteUtilityId,
      staleTime: 2 * 60 * 1000,
    }
  );
};

/**
 * Get transfer request detail
 */
export const useTransferRequestDetail = (requestId: number, remoteUtilityId: number) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
    () => transferApi.getTransferRequestDetail(requestId, remoteUtilityId),
    {
      enabled: !!requestId,
      staleTime: 2 * 60 * 1000,
    }
  );
};

/**
 * Get transfer summary
 */
export const useTransferSummary = (params: {
  remoteUtilityId: number;
  requestType: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transferRequests.summary(params),
    () => transferApi.getTransferSummary(params),
    {
      enabled: !!params.remoteUtilityId,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// ================================
// TRANSFER MUTATION HOOKS
// ================================

/**
 * Create transfer request
 */
export const useCreateTransferRequest = () => {
  const navigate = useNavigate();
  return useSmartMutation(
    (payload: {data: FormData}) => transferApi.createTransferRequest(payload.data),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
        onSuccess: (data: any, variables: any) => {
        toast.success('Transfer request created successfully!');
        // Convert FormData to JSON if it's FormData
        const formDataJson = variables.data instanceof FormData 
          ? formDataToJson(variables.data)
          : variables.data;

          navigate('/cx/transfer/success', { state: { ...data, formData: formDataJson } });  
      },
      onError: (error: any) => {
        toast.error(`Failed to create transfer request: ${error.message}`);
      },
    }
  );
};

export const useConsumerRelation = () => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.nsc.list(), // Unique query key
    () => transferApi.getConsumerRelation(),
   
  );
};

/**
 * Update transfer request
 */
export const useUpdateTransferRequest = (requestId: number) => {
  return useSmartMutation(
    (payload: UpdateTransferRequestPayload) => 
      transferApi.updateTransferRequest(requestId, payload),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request updated successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to update transfer request: ${error.message}`);
      },
    }
  );
};

/**
 * Delete transfer request
 */
export const useDeleteTransferRequest = () => {
  return useSmartMutation(
    (requestId: number) => transferApi.deleteTransferRequest(requestId),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to delete transfer request: ${error.message}`);
      },
    }
  );
};

// ================================
// DOCUMENT OPERATION HOOKS
// ================================

/**
 * Update document status
 */
export const useUpdateDocument = (requestId: number) => {
  return useSmartMutation(
    (payload: DocumentUpdatePayload) => transferApi.updateDocument(requestId, payload),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
      ],
      onSuccess: () => {
        toast.success('Document status updated successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to update document: ${error.message}`);
      },
    }
  );
};

/**
 * Approve document
 */
export const useApproveDocument = (requestId: number) => {
  return useSmartMutation(
    (documentId: number) => transferApi.approveDocument(requestId, documentId),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
      ],
      onSuccess: () => {
        toast.success('Document approved successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to approve document: ${error.message}`);
      },
    }
  );
};

/**
 * Reject document
 */
export const useRejectDocument = (requestId: number) => {
  return useSmartMutation(
    (documentId: number) => transferApi.rejectDocument(requestId, documentId),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
      ],
      onSuccess: () => {
        toast.success('Document rejected successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to reject document: ${error.message}`);
      },
    }
  );
};

// ================================
// STATUS CHANGE HOOKS
// ================================

/**
 * Approve transfer request
 */
export const useApproveTransferRequest = (requestId: number) => {
  return useSmartMutation(
    ({ requestId, acknowledgeTime }: { requestId: number; acknowledgeTime?: string }) => 
      transferApi.approveTransferRequest(requestId, acknowledgeTime),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request approved successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to approve transfer request: ${error.message}`);
      },
    }
  );
};

/**
 * Reject transfer request
 */
export const useRejectTransferRequest = (requestId: number) => {
  return useSmartMutation(
    ({ requestId, remarks, closeDate }: { requestId: number; remarks: string; closeDate: string }) => 
      transferApi.rejectTransferRequest(requestId, remarks, closeDate),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request rejected successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to reject transfer request: ${error.message}`);
      },
    }
  );
};

/**
 * Acknowledge transfer request
 */
export const useAcknowledgeTransferRequest = (requestId: number) => {
  return useSmartMutation(
    ({ requestId, acknowledgeTime }: { requestId: number; acknowledgeTime: string }) => 
      transferApi.acknowledgeTransferRequest(requestId, acknowledgeTime),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request acknowledged successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to acknowledge transfer request: ${error.message}`);
      },
    }
  );
};

/**
 * Complete transfer request
 */
export const useCompleteTransferRequest = (requestId: number) => {
  return useSmartMutation(
    ({ requestId, closeDate }: { requestId: number; closeDate: string }) => 
      transferApi.completeTransferRequest(requestId, closeDate),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request completed successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to complete transfer request: ${error.message}`);
      },
    }
  );
};

/**
 * Hold transfer request
 */
export const useHoldTransferRequest = (requestId: number) => {
  return useSmartMutation(
    ({ requestId, remarks }: { requestId: number; remarks?: string }) => 
      transferApi.holdTransferRequest(requestId, remarks),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer request put on hold successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to hold transfer request: ${error.message}`);
      },
    }
  );
};

/**
 * Bulk update transfer requests
 */
export const useBulkUpdateTransferRequests = () => {
  return useSmartMutation(
    (operation: BulkTransferOperation) => transferApi.bulkUpdateTransferRequests(operation),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Bulk operation completed successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to complete bulk operation: ${error.message}`);
      },
    }
  );
};

/**
 * Complete transfer workflow
 */
export const useCompleteTransferWorkflow = (requestId: number) => {
  return useSmartMutation(
    (params: {
      requestId: number;
      documentsApproved: boolean;
      transferData?: any;
    }) => transferApi.completeTransferWorkflow(params),
    {
      invalidateKeys: [
        QueryKeyFactory.module.cx.transferRequests.details(String(requestId)),
        QueryKeyFactory.module.cx.transferRequests.list(),
        QueryKeyFactory.module.cx.transferRequests.summary(),
      ],
      onSuccess: () => {
        toast.success('Transfer workflow completed successfully!');
      },
      onError: (error: any) => {
        toast.error(`Failed to complete transfer workflow: ${error.message}`);
      },
    }
  );
};

// ================================
// CUSTOM HOOKS FOR COMPLEX FLOWS
// ================================

/**
 * Custom hook for managing transfer filters and pagination
 */
export const useTransferFilters = (initialFilters: TransferFilters) => {
  const [filters, setFilters] = useState<TransferFilters>({
    page: 1,
    limit: 50,
    ...initialFilters,
  });

  const updateFilters = useCallback((newFilters: Partial<TransferFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 50,
      ...initialFilters,
    });
  }, [initialFilters]);

  const nextPage = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      page: (prev.page || 1) + 1,
    }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      page: Math.max((prev.page || 1) - 1, 1),
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page: Math.max(page, 1),
    }));
  }, []);

  const queryResult = useTransferRequests(filters);

  return {
    filters,
    updateFilters,
    resetFilters,
    nextPage,
    prevPage,
    setPage,
    ...queryResult,
  };
};

/**
 * Custom hook for bulk transfer selection
 */
export const useBulkTransferSelection = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const selectAll = useCallback((ids: number[]) => {
    setSelectedIds(ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback((id: number) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    hasSelection: selectedIds.length > 0,
    selectionCount: selectedIds.length,
  };
};


export const useTransferStatus = (params: {
    remoteUtilityId: number;
  }) => {
    return useSmartQuery(
      QueryKeyFactory.module.cx.serviceRequests.status(), // Include params in query key for caching
      () => transferApi.getStatus(params),
     
    );
  };
  
  // Hook for setup progress (original)
export const useServiceCategory = (params: { remoteUtilityId: number }) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.serviceRequests.category(), // Include params in query key for caching
    () => transferApi.getCategory(params)
  );
};

export const useUpdateConsumerDocument = () => {
  return useSmartMutation(
    ({ requestId, documentId, documentStatus }: { requestId: any; documentId: any; documentStatus: number }) =>
      transferApi.updateConsumerDocument(requestId, { documentId, documentStatus })
  );
};