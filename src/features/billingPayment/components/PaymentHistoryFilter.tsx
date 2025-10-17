import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { usePaymentStatus, usePaymentPayType } from "../hooks"; // adjust path as needed

interface PaymentFilters {
  status?: number[];
  paymentType?: number[];
}

interface PaymentFilterPanelProps {
  currentFilters?: PaymentFilters;
  onApplyFilters: (filters: Partial<PaymentFilters>) => void;
  onResetFilters: () => void;
  remoteUtilityId: string;
}

export const PaymentFilterPanel: React.FC<PaymentFilterPanelProps> = ({
  currentFilters = {},
  onApplyFilters,
  onResetFilters,
  remoteUtilityId,
}) => {
  // Fetch status and payment types
  const { data: statusResponse } = usePaymentStatus({
    remote_utility_id: remoteUtilityId,
  });
  const { data: paymentTypeResponse } = usePaymentPayType({
    remote_utility_id: remoteUtilityId,
  });

  // Extract the result arrays from the API responses
  const statuses = statusResponse?.result || [];
  const paymentTypes = paymentTypeResponse?.result || [];

  // Local state for temporary filter values
  const [tempFilters, setTempFilters] = useState<{
    status: number[];
    paymentType: number[];
  }>({
    status: currentFilters?.status || [],
    paymentType: currentFilters?.paymentType || [],
  });

  // Convert numeric values to string for form
  const selectedStatusValue =
    tempFilters.status.length > 0
      ? String(tempFilters.status[0])
      : "ALL_STATUS";

  const selectedPaymentTypeValue =
    tempFilters.paymentType.length > 0
      ? String(tempFilters.paymentType[0])
      : "ALL_PAYMENT_TYPES";

  // Initialize form with current filter values
  const form = useForm({
    defaultValues: {
      status: selectedStatusValue,
      paymentType: selectedPaymentTypeValue,
    },
  });

  // Update temp filters when current filters change
  useEffect(() => {
    const newTempFilters = {
      status: currentFilters?.status || [],
      paymentType: currentFilters?.paymentType || [],
    };

    setTempFilters(newTempFilters);

    // Update form values
    const newSelectedStatusValue =
      newTempFilters.status.length > 0
        ? String(newTempFilters.status[0])
        : "ALL_STATUS";

    const newSelectedPaymentTypeValue =
      newTempFilters.paymentType.length > 0
        ? String(newTempFilters.paymentType[0])
        : "ALL_PAYMENT_TYPES";

    form.setValue("status", newSelectedStatusValue);
    form.setValue("paymentType", newSelectedPaymentTypeValue);
  }, [currentFilters, form]);

  // Update form when tempFilters change
  useEffect(() => {
    const newSelectedStatusValue =
      tempFilters.status.length > 0
        ? String(tempFilters.status[0])
        : "ALL_STATUS";

    const newSelectedPaymentTypeValue =
      tempFilters.paymentType.length > 0
        ? String(tempFilters.paymentType[0])
        : "ALL_PAYMENT_TYPES";

    form.setValue("status", newSelectedStatusValue);
    form.setValue("paymentType", newSelectedPaymentTypeValue);
  }, [tempFilters, form]);

  const handleStatusChange = (value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      status: value === "ALL_STATUS" ? [] : [Number(value)],
    }));
  };

  const handlePaymentTypeChange = (value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      paymentType: value === "ALL_PAYMENT_TYPES" ? [] : [Number(value)],
    }));
  };

  const handleApplyFilters = () => {
    const filtersToApply: Partial<PaymentFilters> = {};

    if (tempFilters.status.length > 0) {
      filtersToApply.status = tempFilters.status;
    }
    if (tempFilters.paymentType.length > 0) {
      filtersToApply.paymentType = tempFilters.paymentType;
    }

    onApplyFilters(filtersToApply);
  };

  const handleResetFilters = () => {
    setTempFilters({
      status: [],
      paymentType: [],
    });
    onResetFilters();
  };

  const handleSubmit = (data: any) => {
    handleApplyFilters();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select
                value={selectedStatusValue}
                onValueChange={(value) => {
                  field.onChange(value);
                  handleStatusChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL_STATUS">All Status</SelectItem>
                    {statuses.map((status: any) => (
                      <SelectItem key={status.key} value={String(status.key)}>
                        {status.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Payment Type</Label>
          <Controller
            name="paymentType"
            control={form.control}
            render={({ field }) => (
              <Select
                value={selectedPaymentTypeValue}
                onValueChange={(value) => {
                  field.onChange(value);
                  handlePaymentTypeChange(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ALL_PAYMENT_TYPES">
                      All Payment Types
                    </SelectItem>
                    {paymentTypes.map((paymentType: any) => (
                      <SelectItem key={paymentType.key} value={String(paymentType.key)}>
                        {paymentType.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </div>
    </form>
  );
};