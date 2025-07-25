// Add your feature-specific types here
export interface billingPaymentState {
  // Define your state types
}


// Types
export interface ConsumerBillResponse {
  success: boolean;
  message: string;
  data: ConsumerBill[];
  totalRecords?: number;
}

export interface ConsumerBill {
  id: number;
  billNumber: string;
  billDate: string;
  dueDate: string;
  billAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  meterReading?: MeterReading;
  consumerDetails?: ConsumerDetails;
}

export interface MeterReading {
  previousReading: number;
  currentReading: number;
  consumption: number;
  readingDate: string;
}

export interface ConsumerDetails {
  consumerNumber: string;
  consumerName: string;
  address: string;
  connectionType: string;
}

export interface PaymentExtraData {
  reference_no: string;
  bill_amount: number;
  payment_amount: number;
  outstanding_amount: number;
  excess_refund: number;
  additional_notes: string;
}

export interface PaymentPayload {
  id: number;
  transaction_id: string;
  receipt_no: string;
  amount: string;
  payment_mode: string;
  payment_channel: string;
  payment_type: string | null;
  payment_subtype: string | null;
  payment_pay_type: number;
  payment_pay_type_display: string;
  payment_date: string; // e.g. "03-Jun-2025"
  settlement_date: string | null;
  status: string;
  is_active: boolean;
  is_deleted: boolean;
  is_payment_consiled: boolean;
  consumer: number;
  created_date: string; // e.g. "23-Jul-2025"
  remote_bill_id: string | null;
  remote_utility_id: number;
  extra_data: PaymentExtraData;
  consumer_support_request: number | null;
  source: number;
  payment_received_status: number;
  credit_note_reason: string | null;
  payment_installment: number;
}
