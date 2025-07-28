import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Input } from "@shared/ui/input";
import {
  Search,
  Calendar,
  DollarSign,
  Eye,
  CreditCard,
  FileText,
  Wrench,
  CalendarDays,
  User,
  ChevronDown,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { usePayementHistory } from "../hooks";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { PaymentFilterPanel } from "./PaymentHistoryFilter";
import { useSearchParams } from "react-router-dom";

interface PaymentFilters {
  status?: number[];
  paymentType?: number[];
  search_data?: string;
}

interface PaymentHistoryFilters {
  remote_utility_id: string;
  consumer_id: string;
  page: any;
  limit: any;
  search_data?: string;
}

const PaymentHistory = () => {
  const { remoteUtilityId, consumerId } = getLoginDataFromStorage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Compute filters using useMemo
  const filters = useMemo((): PaymentHistoryFilters => {
    const urlFilters: PaymentHistoryFilters = {
      remote_utility_id: remoteUtilityId,
      consumer_id: consumerId,
      page: 1,
      limit: 20,
    };

    // Parse search query
    const queryParam = searchParams.get("query");
    if (queryParam) {
      urlFilters.search_data = queryParam;
    }

    return urlFilters;
  }, [remoteUtilityId, consumerId, searchParams]);

  const { data } = usePayementHistory(filters);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [itemsPerLoad] = useState(5);
  const [currentFilters, setCurrentFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [showFilters, setShowFilters] = useState(false);

  // Handle search functionality
  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue);
    const params = new URLSearchParams(searchParams);

    if (searchValue.trim()) {
      params.set("query", searchValue);
    } else {
      params.delete("query");
    }

    setSearchParams(params);
    setVisibleCount(5); // Reset visible count when searching
  };

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map API response to component format
  const mapApiToComponentData = (apiResults) => {
    if (!apiResults || !Array.isArray(apiResults)) return [];

    return apiResults.map((payment) => ({
      id: payment.id,
      date: payment.paymentDate,
      amount: payment.amount,
      method: payment.paymentMode,
      status: payment.paymentReceivedStatus,
      statusKey: payment.status,
      billNumber: payment.remoteBillId,
      serviceId: null,
      installmentNo: null,
      paymentType: payment.paymentPayTypeDisplay,
      paymentTypeKey: payment.paymentPayType,
      recordedBy: payment.createdUserRemoteName,
      paymentChannel: payment.paymentChannel,
      transactionId: payment.transactionId,
      consumerInfo: payment.consumer,
      
    }));
  };

  const paymentsData = mapApiToComponentData(data?.results);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + itemsPerLoad, filteredPayments.length)
    );
  };

  const handleApplyFilters = (filters: Partial<PaymentFilters>) => {
    setCurrentFilters(filters);
    setVisibleCount(5); // Reset visible count when applying filters
  };

  const handleResetFilters = () => {
    setCurrentFilters({});
    setVisibleCount(5); // Reset visible count when resetting filters
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CREDIT":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case "Bill Payment":
        return <FileText className="h-4 w-4" />;
      case "Service Payment":
        return <Wrench className="h-4 w-4" />;
      case "Installment Payment":
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Apply filters locally (for non-search filters)
  const filteredPayments = paymentsData.filter((payment) => {
    // Status filter
    if (currentFilters.status && currentFilters.status.length > 0) {
      if (!currentFilters.status.includes(payment.statusKey)) {
        return false;
      }
    }

    // Payment type filter
    if (currentFilters.paymentType && currentFilters.paymentType.length > 0) {
      if (!currentFilters.paymentType.includes(payment.paymentTypeKey)) {
        return false;
      }
    }

    return true;
  });

  const visiblePayments = filteredPayments.slice(0, visibleCount);
  const hasMorePayments = visibleCount < filteredPayments.length;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by payment ID, transaction ID, amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardContent>
            <PaymentFilterPanel
              currentFilters={currentFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              remoteUtilityId={remoteUtilityId}
            />
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="pb-2">Payment History</CardTitle>
              <CardDescription className="pb-4">
                View all your payment transactions and details
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Showing {visibleCount} of {filteredPayments.length} payments
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {visiblePayments.map((payment) => (
            <div
              key={payment.id}
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getPaymentTypeIcon(payment.paymentType)}
                      <h3 className="font-semibold">PAY-{payment.id}</h3>
                    </div>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                    <Badge variant="outline">{payment.paymentType}</Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-bold text-xl flex items-center gap-1">
                        <DollarSign className="h-5 w-5" />
                        {payment.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Method
                      </p>
                      <p className="font-medium flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {payment.method}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Payment Channel
                      </p>
                      <p className="font-medium">{payment.paymentChannel}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-end h-full ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(payment)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {hasMorePayments && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                className="flex items-center gap-2"
              >
                <ChevronDown className="h-4 w-4" />
                Load More Payments
              </Button>
            </div>
          )}

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No payments found matching the selected filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Complete information about payment PAY-{selectedPayment?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              {/* Payment Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Payment ID
                      </label>
                      <p className="text-lg font-semibold">
                        PAY-{selectedPayment.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Amount
                      </label>
                      <p className="text-2xl font-bold text-green-600">
                        ${selectedPayment.amount}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Payment Date
                      </label>
                      <p className="font-semibold">
                        {new Date(selectedPayment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Payment Method
                      </label>
                      <p className="font-semibold">{selectedPayment.method}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Status
                      </label>
                      <div className="mt-1">
                        <Badge
                          className={getStatusColor(selectedPayment.status)}
                        >
                          {selectedPayment.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Payment Type
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
                          {getPaymentTypeIcon(selectedPayment.paymentType)}
                          {selectedPayment.paymentType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Bill Number
                      </label>
                      <p className="font-semibold text-blue-600">
                        {selectedPayment.paymentChannel}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Recorded By
                      </label>
                      <p className="font-semibold flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedPayment.recordedBy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;