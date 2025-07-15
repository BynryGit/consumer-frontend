import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'; 
import { Badge } from '@shared/ui/badge';
import { ListFilter } from 'lucide-react';
import GenericTable from '@shared/components/GenericTable';
import { TableColumn } from '@shared/types/table';

// Request interface
interface Request {
  id: string;
  subject: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
  lastUpdated: string;
}

interface RequestTrackerTableProps {
  onViewRequest: (request: Request) => void;
}

export const RequestTrackerTable: React.FC<RequestTrackerTableProps> = ({ 
  onViewRequest 
}) => {
  // Mock data - keeping data in table component only
  const mockRequests: Request[] = [
    {
      id: 'SR-345621',
      subject: 'Power outage on Main Street',
      type: 'service',
      status: 'open',
      priority: 'high',
      createdAt: '2025-04-08T14:30:00',
      lastUpdated: '2025-04-08T14:30:00'
    },
    {
      id: 'SR-346892',
      subject: 'Installation of new electrical meter',
      type: 'service',
      status: 'rejected',
      priority: 'medium',
      createdAt: '2025-04-07T10:15:00',
      lastUpdated: '2025-04-07T16:30:00'
    },
    {
      id: 'CR-342189',
      subject: 'Billing dispute for March statement',
      type: 'complaint',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2025-04-06T09:15:00',
      lastUpdated: '2025-04-07T11:30:00'
    },
    {
      id: 'DR-341007',
      subject: 'Request disconnection due to relocation',
      type: 'disconnection',
      status: 'waiting',
      priority: 'low',
      createdAt: '2025-04-05T16:45:00',
      lastUpdated: '2025-04-06T10:20:00'
    },
    {
      id: 'RR-339654',
      subject: 'Reconnect service after payment',
      type: 'reconnection',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2025-04-03T11:30:00',
      lastUpdated: '2025-04-04T15:45:00'
    },
    {
      id: 'TR-337201',
      subject: 'Transfer service to new apartment',
      type: 'transfer',
      status: 'closed',
      priority: 'high',
      createdAt: '2025-04-01T08:20:00',
      lastUpdated: '2025-04-03T09:10:00'
    },
    {
      id: 'SR-344123',
      subject: 'Water pressure issue in apartment building',
      type: 'service',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2025-04-02T09:15:00',
      lastUpdated: '2025-04-08T10:30:00'
    },
    {
      id: 'CR-343456',
      subject: 'Overcharged for gas usage in February',
      type: 'complaint',
      status: 'waiting',
      priority: 'low',
      createdAt: '2025-03-28T14:20:00',
      lastUpdated: '2025-04-01T16:45:00'
    }
  ];

  const [filteredData, setFilteredData] = useState<Request[]>(mockRequests);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    let filtered = mockRequests;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    setFilteredData(filtered);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status);
    let filtered = mockRequests;
    
    if (status) {
      filtered = filtered.filter(request => request.status === status);
    }
    
    setFilteredData(filtered);
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'waiting':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Waiting</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Service';
      case 'complaint': return 'Complaint';
      case 'disconnection': return 'Disconnection';
      case 'reconnection': return 'Reconnection';
      case 'transfer': return 'Transfer';
      default: return type;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Define table columns - keeping only original columns
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

  // Filter panel component
  const filterPanel = (
    <div className="flex items-center gap-2">
      <ListFilter className="h-4 w-4 text-muted-foreground" />
      <Select
        value={statusFilter || "all"}
        onValueChange={(value) => handleStatusFilterChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="waiting">Waiting</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      {statusFilter && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Status: {statusFilter}
          <button
            onClick={() => handleStatusFilterChange(null)}
            className="ml-1 hover:text-destructive"
            title="Clear filter"
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );

  // Update filtered data when component mounts
  React.useEffect(() => {
    setFilteredData(mockRequests);
  }, []);

 
  return (
    <GenericTable<Request>
      data={filteredData}
      columns={columns}
      rowKey="id"
      actions={actions}
      actionsType="icons"
      searchPlaceholder="Search requests by ID or subject..."
      onSearch={handleSearch}
      filters={filterPanel}
      emptyMessage="No requests found matching your search criteria"
    />
  );
};