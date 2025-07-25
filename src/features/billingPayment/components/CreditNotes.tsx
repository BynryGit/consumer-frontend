import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { TableColumn } from "@shared/types/table";
import CreditNoteDialog from "./CreditNoteDialog";
import GenericTable from "@shared/components/GenericTable";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useCreditNoteList } from "../hooks";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "@shared/utils/constants";

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

// Credit Note filters interface
interface CreditNoteFilters {
  remote_utility_id: string;
  consumer_id: string;
  payment_pay_type: any;
  page: any;
  limit: any;
  search_data?: string;
}

const CreditNotes = () => {
  const { remoteUtilityId, consumerId } = getLoginDataFromStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  // Compute filters using useMemo
  const filters = useMemo((): CreditNoteFilters => {
    const urlFilters: CreditNoteFilters = {
      remote_utility_id: "699",
      consumer_id: "174825",
      payment_pay_type: "3",
      page: page,
      limit: PAGE_SIZE,
    };

    // Parse search query
    const queryParam = searchParams.get("query");
    if (queryParam) {
      urlFilters.search_data = queryParam;
    }

    return urlFilters;
  }, [searchParams, page]);

  // Update page when URL page param changes
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam, 10));
    }
  }, [searchParams]);

  const { data } = useCreditNoteList(filters);

  const transformedData: CreditNote[] = data?.results?.map((item: any) => ({
    id: item.receiptNo,
    consumer: item.consumerName,
    consumerId: item.consumerNo,
    amount: item.amount,
    remaining: 0,
    reason: item.creditNoteReason,
    status: item.paymentReceivedStatus,
    createdDate: item.createdDate,
    linkedPayment: item.referenceReceiptNo,
  })) || [];

  const [selectedCreditNote, setSelectedCreditNote] =
    useState<CreditNote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const getStatusBadge = (status: string) => {
    return <Badge variant="outline">N/A</Badge>;
  };

  const handleViewDetails = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setIsDetailModalOpen(true);
  };

  // Define table columns
  const columns: TableColumn<CreditNote>[] = [
    {
      key: "id",
      header: "Credit Note #",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
    },
    {
      key: "remaining",
      header: "Remaining",
      sortable: true,
    },
    {
      key: "reason",
      header: "Reason",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
    },
    {
      key: "createdDate",
      header: "Created Date",
      sortable: true,
    },
    {
      key: "linkedPayment",
      header: "Linked Payment",
    },
  ];

  // Define table actions
  const actions = [
    {
      label: "View Details",
      icon: "Eye" as const,
      onClick: (creditNote: CreditNote) => handleViewDetails(creditNote),
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
            data={transformedData}
            columns={columns}
            rowKey="id"
            actions={actions}
            actionsType="icons"
            searchPlaceholder="Search credit notes by ID, reason, or amount..."
            searchParamName="query"
            searchDebounceMs={300}
            onSearch={handleSearch}
            pagination={{
              currentPage: page,
              totalPages: Math.ceil((data?.count || 0) / PAGE_SIZE),
              totalItems: data?.count || 0,
              itemsPerPage: PAGE_SIZE,
              startItem: (page - 1) * PAGE_SIZE + 1,
              endItem: Math.min(page * PAGE_SIZE, data?.count || 0),
            }}
            onPageChange={handlePageChange}
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