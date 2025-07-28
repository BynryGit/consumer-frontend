import React, { useMemo, useState, useEffect } from 'react';
import { Badge } from '@shared/ui/badge';
import GenericTable from '@shared/components/GenericTable';
import { TableColumn } from '@shared/types/table';
import PaymentModal from '../PaymentModal';
import { BillingKPICards } from '../billingKpiCard/BillingKpiCard';
import { useConsumerBillDetails } from '@features/billingPayment/hooks';
import { useDownloadBillTemplate } from '@features/billingPayment/hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from "@shared/utils/constants";
import { toast } from "sonner";

// Bill interface
interface Bill {
  id: string;
  downloadID: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
}

// Bill filters interface
interface BillFilters {
  remoteUtilityId: string;
  remoteConsumerNumber: any;
  isPaginationRequired: any;
  isBillSummary: any;
  page?: number;
  limit?: number;
  search_data?: string;
}

const BillsTable = () => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  
  const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();

  // Add the download hook
  const downloadBillTemplate = useDownloadBillTemplate();

  // Compute filters using useMemo
  const filters = useMemo((): BillFilters => {
    const urlFilters: BillFilters = {
      remoteUtilityId: remoteUtilityId,
      remoteConsumerNumber: remoteConsumerNumber,
      isPaginationRequired: "True",
      isBillSummary: "True",
      page: page,
      limit: PAGE_SIZE,
    };

    // Parse search query
    const queryParam = searchParams.get("query");
    if (queryParam) {
      urlFilters.search_data = queryParam;
    }

    return urlFilters;
  }, [remoteUtilityId, remoteConsumerNumber, searchParams, page]);

  // Update page when URL page param changes
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam, 10));
    }
  }, [searchParams]);

  const { data: billDetailsData } = useConsumerBillDetails(filters);

  const bills: Bill[] = useMemo(() => {
    if (!billDetailsData?.results?.billData) return [];
    
    return billDetailsData.results.billData.map((billData: any) => ({
      downloadID: billData.id,
      id: billData.invoiceNo,
      date: billData.createdDate,
      amount: billData.totalAmountPayable,
      type: 'Combined',
      status: parseFloat(billData.outstandingBalance) > 0 ? 'Unpaid' : 'Paid',
      dueDate: billData.dueDate
    }));
  }, [billDetailsData]);

  // Extract bill summary data
  const billSummary = useMemo(() => {
    return billDetailsData?.results?.billSummary;
  }, [billDetailsData]);

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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    setPage(newPage);
  };

  const handlePayNow = (bill: Bill) => {
    setSelectedBill(bill);
    setIsPaymentModalOpen(true);
  };

  // Updated download handler
  const handleDownloadBill = (bill: Bill) => {
    downloadBillTemplate.mutate({
      billId: bill.downloadID,
    }, {
      onSuccess: () => {
        toast.success("Bill downloaded successfully");
      },
      onError: (error) => {
        console.error("Download failed:", error);
        toast.error("Failed to download bill");
      }
    });
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedBill(null);
  };

  // Define table columns
  const columns: TableColumn<Bill>[] = [
    {
      key: 'id',
      header: 'Bill',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Issue Date',
      sortable: true,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
    },
  ];

  // Define table actions
  const actions = [
    {
      label: 'Pay Now',
      icon: 'CreditCard' as const,
      onClick: (bill: Bill) => handlePayNow(bill),
      disabled: (bill: Bill) => bill.status === 'Paid'
    },
    {
      label: 'Download',
      icon: 'Download' as const,
      onClick: (bill: Bill) => handleDownloadBill(bill),
      disabled: (bill: Bill) => downloadBillTemplate.isPending
    }
  ];

  return (
    <div className="space-y-6">
      <BillingKPICards 
        billSummary={billSummary}
      />

      <GenericTable<Bill>
        data={bills}
        columns={columns}
        rowKey="id"
        actions={actions}
        actionsType="icons"
        searchPlaceholder="Search bills by invoice number, amount..."
        searchParamName="query"
        searchDebounceMs={300}
        onSearch={handleSearch}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil((billDetailsData?.count || 0) / PAGE_SIZE),
          totalItems: billDetailsData?.count || 0,
          itemsPerPage: PAGE_SIZE,
          startItem: (page - 1) * PAGE_SIZE + 1,
          endItem: Math.min(page * PAGE_SIZE, billDetailsData?.count || 0),
        }}
        onPageChange={handlePageChange}
        emptyMessage="No bills found"
      />

      <PaymentModal 
        bill={selectedBill}
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        paymentType="bill" // Add the payment type prop
      />
    </div>
  );
};

export default BillsTable;