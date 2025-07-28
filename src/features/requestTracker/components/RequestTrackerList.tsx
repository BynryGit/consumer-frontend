import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '@shared/ui/badge';
import GenericTable from '@shared/components/GenericTable';
import { TableColumn } from '@shared/types/table';
import { useRequestData } from '../hooks';
import { useSearchParams } from 'react-router-dom';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
import { RequestTrackerFilterPanel } from './RequestTrackerFilterPanel';
import { PAGE_SIZE } from '@shared/utils/constants';

// Request interface
interface Request {
  requestId: string;
  id: string;
  subject: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
  lastUpdated: string;
}

// Request filters interface
interface RequestFilters {
  consumer_id: string;
  remote_utility_id: string;
  page: number;
  limit: number;
  search_data?: string;
  status?: string;
  request_type?: string;
}

interface RequestTrackerTableProps {
  onViewRequest: (request: Request) => void;
}

export const RequestTrackerTable: React.FC<RequestTrackerTableProps> = ({ 
  onViewRequest 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  // Get utility and consumer id from login utils
  const { remoteUtilityId, consumerId } = getLoginDataFromStorage();

  // Compute filters using useMemo instead of a function that calls hooks
  const filters = useMemo((): RequestFilters => {
    const urlFilters: RequestFilters = {
      consumer_id: consumerId,
      remote_utility_id: remoteUtilityId,
      page,
      limit: PAGE_SIZE,
    };

    // Parse status filter
    const statusParam = searchParams.get("status");
    if (statusParam) {
      urlFilters.status = statusParam;
    }

    // Parse request type filter
    const requestTypeParam = searchParams.get("request_type");
    if (requestTypeParam) {
      urlFilters.request_type = requestTypeParam;
    }

    // Parse search query
    const queryParam = searchParams.get("query");
    if (queryParam) {
      urlFilters.search_data = queryParam;
    }

    return urlFilters;
  }, [page, searchParams, consumerId, remoteUtilityId]);

  // Update page when URL page param changes
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam, 10));
    }
  }, [searchParams]);

  const { data, isLoading } = useRequestData(filters);

  const transformedData = useMemo(() => {
    if (!data?.results) return [];
    
    return data.results.map((apiRequest: any, index: number) => ({
      requestId: apiRequest.id?.toString() || `req-${index}`,
      id: apiRequest.requestNo || `unknown-${apiRequest.id || index}`,
      type: apiRequest.requestType || 'Unknown',
      status: apiRequest.statusDisplay || 'Unknown',
      createdAt: apiRequest.createdDate || '',
      lastUpdated: apiRequest.lastModifiedDate || '',
    }));
  }, [data]);

  const handleApplyFilters = (newFilters: { status?: string; requestType?: string }) => {
    const params = new URLSearchParams(searchParams);

    // Clear existing filter params
    params.delete("status");
    params.delete("request_type");
    params.delete("page");

    // Add new filter params
    if (newFilters.status) {
      params.set("status", newFilters.status);
    }
    if (newFilters.requestType) {
      params.set("request_type", newFilters.requestType);
    }

    // Reset to page 1 when applying filters
    params.set("page", "1");
    setPage(1);

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Remove all filter params
    params.delete("status");
    params.delete("request_type");
    params.delete("page");
    params.delete("query");

    setPage(1);
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    setPage(newPage);
  };

  const handleSearch = (searchTerm: string, paramName: "search_data") => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm.trim()) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }

    // Reset to page 1 when searching
    params.set("page", "1");
    setPage(1);

    setSearchParams(params);
  };

  // Current filter values for the filter panel
  const currentFilters = useMemo(() => ({
    status: searchParams.get("status") || '',
    requestType: searchParams.get("request_type") || '',
  }), [searchParams]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CREATED':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">CREATED</Badge>;
      case 'APPROVED':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">APPROVED</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 border-green-200">COMPLETED</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 border-red-200">REJECTED</Badge>;
      case 'IN PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">IN PROGRESS</Badge>;
      case 'CANCELED':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">CANCELED</Badge>;
      case 'PENDING':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">PENDING</Badge>;
      case 'ON HOLD':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">ON HOLD</Badge>;
      case 'CLOSED':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">CLOSED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Service': return 'Service';
      case 'Complaint': return 'Complaint';
      case 'Disconnect Permanent': return 'Disconnect Permanent';
      case 'Reconnection': return 'Reconnection';
      case 'Transfer': return 'Transfer';
      case 'Pause': return 'Pause';
      case 'Resume': return 'Resume';
      case 'Budget Bill': return 'Budget Bill';
      case 'Adjust Bill': return 'Adjust Bill';
      case 'Meter Reads': return 'Meter Reads';
      case 'Outage': return 'Outage';
      default: return type;
    }
  };

  // Define table columns
  const columns: TableColumn<Request>[] = [
    {
      key: 'id',
      header: 'Reference ID',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {getTypeLabel(value)}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  // Define table actions
  const actions = [
    {
      label: 'View Details',
      icon: 'Eye' as const,
      onClick: (request: Request) => onViewRequest(request)
    }
  ];

  return (
    <GenericTable<Request>
      data={transformedData}
      columns={columns}
      searchPlaceholder="Search requests by ID or subject..."
      searchParamName="query"
      searchDebounceMs={300}
      onSearch={handleSearch}
      rowKey="id"
      pagination={{
        currentPage: page,
        totalPages: Math.ceil((data?.count || 0) / PAGE_SIZE),
        totalItems: data?.count || 0,
        itemsPerPage: PAGE_SIZE,
        startItem: (page - 1) * PAGE_SIZE + 1,
        endItem: Math.min(page * PAGE_SIZE, data?.count || 0),
      }}
      onPageChange={handlePageChange}
      actions={actions}
      actionsType="icons"
      filterPanel={
        <RequestTrackerFilterPanel
          currentFilters={currentFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          remoteUtilityId={remoteUtilityId}
        />
      }
      emptyMessage="No requests found matching your search criteria"
    />
  );
};