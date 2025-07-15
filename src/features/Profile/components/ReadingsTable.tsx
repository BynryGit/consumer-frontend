import React from 'react';
import { Badge } from '@shared/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import GenericTable from '@shared/components/GenericTable';
import { TableColumn } from '@shared/types/table';


interface Reading {
  date: string;
  reading: string;
  status: string;
}

interface ReadingsTableProps {
  readings: Reading[];
}

const ReadingsTable: React.FC<ReadingsTableProps> = ({ readings }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Under Review':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: TableColumn<Reading>[] = [
    {
      key: 'date',
      header: 'Reading Date',
      sortable: false
    },
    {
      key: 'reading',
      header: 'Reading',
      sortable: false
    },
    {
      key: 'status',
      header: 'Status',
      sortable: false,
      render: (value: string, row: Reading) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(value)}
          <Badge className={`text-xs ${getStatusColor(value)}`}>
            {value}
          </Badge>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <GenericTable
        data={readings}
        columns={columns}
        rowKey="date"
        loading={false}
        emptyMessage="No readings available"
      />
    </div>
  );
};

export default ReadingsTable;