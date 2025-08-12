import React, { useMemo, useState, useEffect } from "react";
import { Badge } from "@shared/ui/badge";
import GenericTable from "@shared/components/GenericTable";
import { TableColumn } from "@shared/types/table";
import PaymentModal from "../PaymentModal";
import { BillingKPICards } from "../billingKpiCard/BillingKpiCard";
import {
  useConsumerBillDetails,
  usePSPConfig,
} from "@features/billingPayment/hooks";
import { useDownloadBillTemplate } from "@features/billingPayment/hooks";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "@shared/utils/constants";
import { useToast } from "@shared/hooks/use-toast"; // Changed from sonner
import { logEvent } from "@shared/analytics/analytics";

// Bill interface
interface Bill {
  id: string;
  downloadID: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  dueDate: string;
  outstandingAmount: number;
  billIndex: number;
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
  const { toast } = useToast(); // Added custom toast hook
  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();
  const navigate = useNavigate();

  // Add the download hook
  const downloadBillTemplate = useDownloadBillTemplate();
  const { data: pspConfig, refetch: refetchPspConfig } =
    usePSPConfig(remoteUtilityId);

  const activePsp = pspConfig?.find(
    (item) =>
      item.isActive && item.verificationStatus?.toLowerCase() === "verified"
  );
  const activePspUtilityId = activePsp?.pspUtilityId;
  const activePspName = activePsp?.organizationName;

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

  const { data: billDetailsData, refetch } = useConsumerBillDetails(filters);

  const bills: Bill[] = useMemo(() => {
    if (!billDetailsData?.results?.billData) return [];

    return billDetailsData.results.billData.map(
      (billData: any, index: number) => ({
        downloadID: billData.id,
        id: billData.invoiceNo,
        billId: billData.id,
        date: billData.createdDate,
        amount: billData.billAmount,
        outstandingAmount: billData.outstandingBalance,
        status: billData.outstandingBalance > 0 ? "Unpaid" : "Paid",
        dueDate: billData.dueDate,
        type: billData.type || "",
        billIndex: index,
      })
    );
  }, [billDetailsData]);

  // Extract bill summary data
  const billSummary = useMemo(() => {
    return billDetailsData?.results?.billSummary;
  }, [billDetailsData]);
  useEffect(() => {
    logEvent("Bills Tab Viewed");
  }, []);
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

  const handlePayNow = (bill: any) => {
    console.log("debug bill selected", bill);
    setSelectedBill({ ...bill, activePspUtilityId, activePspName });
    setIsPaymentModalOpen(true);
  };

  // Updated download handler with custom toast
  const handleDownloadBill = (bill: Bill) => {
    downloadBillTemplate.mutate(
      {
        billId: bill.downloadID,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Bill downloaded successfully",
          });
        },
        onError: (error) => {
          console.error("Download failed:", error);
          toast({
            title: "Download Failed",
            description: "Failed to download bill. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedBill(null);
    localStorage.removeItem("billForPayment");
    // Clear ?status=success from the URL
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete("status");
    navigate(`?${updatedParams.toString()}`, { replace: true });
  };

  // Add this function to handle successful payment
  const handlePaymentSuccess = () => {
    // Refetch the bill data to update the status and outstanding amounts
    if (refetch) {
      refetch();
    }
    // Close the modal
    handlePaymentModalClose();
  };

  // Define table columns
  const columns: TableColumn<Bill>[] = [
    {
      key: "id",
      header: "Bill Number",
      sortable: true,
    },
    {
      key: "date",
      header: "Issue Date",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
    },
    {
      key: "outstandingAmount",
      header: "Outstanding Amount",
      sortable: true,
    },
    {
      key: "dueDate",
      header: "Due Date",
    },
  ];

  // Define table actions
  const actions = [
    {
      label: "Pay Now",
      icon: "CreditCard" as const,
      onClick: (bill: any) => handlePayNow(bill),
      disabled: (bill: any) => bill.status === "Paid" || bill.billIndex !== 0,
    },
    {
      label: "Download",
      icon: "Download" as const,
      onClick: (bill: Bill) => handleDownloadBill(bill),
      disabled: (bill: Bill) => downloadBillTemplate.isPending,
    },
  ];

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) {
      const storedBill = localStorage.getItem("billForPayment");
      if (storedBill) {
        const parsedBill = JSON.parse(storedBill);
        setSelectedBill(parsedBill);
        setIsPaymentModalOpen(true);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <BillingKPICards billSummary={billSummary} />

      <GenericTable
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
        onPaymentSuccess={handlePaymentSuccess}
        paymentType="bill"
        status={searchParams.get("status")}
        activePspId={activePspUtilityId}
        activePspName={activePspName}
      />
    </div>
  );
};

export default BillsTable;
