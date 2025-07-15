import React, { useState } from 'react';
import { Badge } from '@shared/ui/badge';
import GenericTable from '@shared/components/GenericTable';
import { TableColumn } from '@shared/types/table';
import PaymentModal from '../PaymentModal';
import { BillingKPICards } from '../billingKpiCard/BillingKpiCard';
import { BillsFilter } from '../billFilterPanel/BillsFilter';

// Bill interface
interface Bill {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
}

// Simulated bill data
const bills: Bill[] = [
  { id: 'INV-001', date: '2025-03-10', amount: 78.45, type: 'Electric', status: 'Unpaid', dueDate: '2025-04-15' },
  { id: 'INV-002', date: '2025-03-08', amount: 42.30, type: 'Water', status: 'Paid', dueDate: '2025-04-13' },
  { id: 'INV-003', date: '2025-02-10', amount: 105.75, type: 'Electric', status: 'Paid', dueDate: '2025-03-15' },
  { id: 'INV-004', date: '2025-02-08', amount: 38.20, type: 'Water', status: 'Paid', dueDate: '2025-03-13' },
  { id: 'INV-005', date: '2025-01-10', amount: 92.65, type: 'Gas', status: 'Paid', dueDate: '2025-02-15' },
  { id: 'INV-006', date: '2025-01-08', amount: 45.10, type: 'Water', status: 'Paid', dueDate: '2025-02-13' },
];

const BillsTable = () => {
  const [filteredData, setFilteredData] = useState<Bill[]>(bills);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Get unique bill types for filter options
  const availableTypes = Array.from(new Set(bills.map(bill => bill.type)));

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    let filtered = bills;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bill => 
        bill.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        bill.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(bill => bill.type === filterType);
    }
    
    setFilteredData(filtered);
  };

  // Handle type filter change
  const handleFilterChange = (type: string | null) => {
    setFilterType(type);
    let filtered = bills;
    
    // Apply search term if there's an active search
    // In a real app, you'd want to store the search term to reapply it here
    
    if (type) {
      filtered = filtered.filter(bill => bill.type === type);
    }
    
    setFilteredData(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'Unpaid':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Unpaid</Badge>;
      case 'Processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePayNow = (bill: Bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handleViewBill = (bill: Bill) => {
    console.log('Viewing bill:', bill.id);
  };

  const handleDownloadBill = (bill: Bill) => {
    console.log('Downloading bill:', bill.id);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedBill(null);
  };

  // Define table columns
  const columns: TableColumn<Bill>[] = [
    {
      key: 'id',
      header: 'Bill #',
      sortable: true,
      width: 'w-[100px]'
    },
    {
      key: 'date',
      header: 'Issue Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className={`utility-${value.toLowerCase()}`}>
          {value}
        </Badge>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`,
      width: 'text-right'
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => getStatusBadge(value)
    }
  ];

  // Define table actions
  const actions = [
    {
      label: 'View Bill',
      icon: 'Eye' as const,
      onClick: (bill: Bill) => handleViewBill(bill)
    },
    {
      label: 'Pay Now',
      icon: 'CreditCard' as const,
      onClick: (bill: Bill) => handlePayNow(bill),
      disabled: (bill: Bill) => bill.status === 'Paid'
    },
    {
      label: 'Download',
      icon: 'Download' as const,
      onClick: (bill: Bill) => handleDownloadBill(bill)
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <BillingKPICards bills={bills} />

      {/* Generic Table with separated filter component */}
      <GenericTable<Bill>
        data={filteredData}
        columns={columns}
        rowKey="id"
        actions={actions}
        actionsType="icons"
        searchPlaceholder="Search bills by ID or type..."
        onSearch={handleSearch}
        filters={
          <BillsFilter 
            filterType={filterType}
            onFilterChange={handleFilterChange}
            availableTypes={availableTypes}
          />
        }
        emptyMessage="No bills found"
      />

      <PaymentModal 
        bill={selectedBill}
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
      />
    </div>
  );
};

export default BillsTable;