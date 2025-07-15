import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';

import { TableColumn } from '@shared/types/table';
import CreditNoteDialog from './CreditNoteDialog';
import GenericTable from '@shared/components/GenericTable';

// Credit Note interface
interface CreditNote {
  id: string;
  consumer: string;
  consumerId: string;
  amount: number;
  remaining: number;
  reason: string;
  status: string;
  createdDate: string;
  linkedPayment: string;
}

// Sample credit notes data
const creditNotesData: CreditNote[] = [
  {
    id: 'CN-10001',
    consumer: 'John Doe',
    consumerId: 'WL-10001',
    amount: 45.50,
    remaining: 45.50,
    reason: 'Overpayment',
    status: 'Active',
    createdDate: '2025-04-20',
    linkedPayment: 'R-5001'
  },
  {
    id: 'CN-10002',
    consumer: 'Jane Smith',
    consumerId: 'WL-10002',
    amount: 25.00,
    remaining: 0.00,
    reason: 'Billing Adjustment',
    status: 'Applied',
    createdDate: '2025-04-18',
    linkedPayment: 'R-5002'
  },
  {
    id: 'CN-10003',
    consumer: 'Michael Brown',
    consumerId: 'WL-10003',
    amount: 75.20,
    remaining: 45.20,
    reason: 'Duplicate Payment',
    status: 'Active',
    createdDate: '2025-04-15',
    linkedPayment: 'R-5003'
  }
];

const CreditNotes = () => {
  const [filteredData, setFilteredData] = useState<CreditNote[]>(creditNotesData);
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Handle search functionality
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredData(creditNotesData);
      return;
    }

    const filtered = creditNotesData.filter(note => 
      note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.consumer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>;
      case 'Applied':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Applied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setIsDetailModalOpen(true);
  };

  // Define table columns
  const columns: TableColumn<CreditNote>[] = [
    {
      key: 'id',
      header: 'Credit Note #',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono font-medium text-blue-600">
          {value}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold">
          ${value.toFixed(2)}
        </span>
      )
    },
    {
      key: 'remaining',
      header: 'Remaining',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-green-600">
          ${value.toFixed(2)}
        </span>
      )
    },
    {
      key: 'reason',
      header: 'Reason',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value: string) => getStatusBadge(value)
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      key: 'linkedPayment',
      header: 'Linked Payment',
      render: (value: string) => (
        <span className="font-mono text-sm text-blue-600">
          {value}
        </span>
      )
    }
  ];

  // Define table actions
  const actions = [
    {
      label: 'View Details',
      icon: 'Eye' as const,
      onClick: (creditNote: CreditNote) => handleViewDetails(creditNote)
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Credit Notes
          </CardTitle>
          <CardDescription className="pb-4">
            View and manage your credit notes and adjustments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GenericTable<CreditNote>
            data={filteredData}
            columns={columns}
            rowKey="id"
            actions={actions}
            actionsType="icons"
            searchPlaceholder="Search credit notes by ID, consumer, or reason..."
            onSearch={handleSearch}
            emptyMessage="No credit notes found"
            getRowClassName={(row) => "hover:bg-muted/50"}
          />
        </CardContent>
      </Card>

      {/* Credit Note Detail Modal */}
      <CreditNoteDialog 
        creditNote={selectedCreditNote} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
    </>
  );
};

export default CreditNotes;