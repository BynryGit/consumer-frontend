// hooks/useConsumerBill.ts
import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { useToast } from "@shared/hooks/use-toast";
import { billingApi } from "./api";
import { PaymentPayload } from "./types";

// Alternative simpler hook if you prefer individual parameters
export const useConsumerBillDetails = (params: {
  remoteUtilityId: string;
  remoteConsumerNumber: any;
  isPaginationRequired: any;
  isBillSummary: any;
}) => {
  return useSmartQuery(QueryKeyFactory.module.cx.billing.billData(params), () =>
    billingApi.getConsumerBillDetails(params)
  );
};

export const usePaymentAgreementDetail = (params: {
  remote_utility_id: string;
  consumer_id: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.billing.paymentAgreementDetail(params),
    () => billingApi.getPaymentAgreementDetail(params)
  );
};

export const useCreditNoteList = (params: {
  remote_utility_id: string;
  consumer_id: string;
  payment_pay_type: any;
  page: any;
  limit: any;
  search_data?: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.billing.creditNoteList(params),
    () => billingApi.getCreditNoteList(params)
  );
};  
export const useServicesData = (params: {
  remote_utility_id: string;
  consumer_id: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.billing.servicesData(params),
    () => billingApi.getServicesData(params),
      {
      enabled: !!params.remote_utility_id,
     
      staleTime: 10 * 60 * 1000,
    }
  );
  
};

export const usePayBill = () => {
  return useSmartMutation(
    (payload: PaymentPayload) =>
      billingApi.payBill(payload),
  
  );
};
export const useDownloadBillTemplate = () => {
  return useSmartMutation(
    (params: { billId: string }) => billingApi.downloadBillTemplate(params),
    {
      onSuccess: (blob, variables) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Try to determine file type from blob
        const contentType = blob.type;
        let extension = "pdf"; // default

        if (
          contentType.includes("excel") ||
          contentType.includes("spreadsheet")
        ) {
          extension = "xlsx";
        } else if (contentType.includes("csv")) {
          extension = "csv";
        } else if (contentType.includes("pdf")) {
          extension = "pdf";
        }

        link.download = `bill_${variables.billId}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
    }
  );
};

export const usePayementHistory = (params: {
  remote_utility_id: string;
  consumer_id: string;
  page: any;
  limit: any;
  search_data?: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.billing.paymentHistory(params),
    () => billingApi.getPaymentHistory(params)
  );
};

export const usePaymentStatus = (params: { remote_utility_id: string }) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.billing.paymentStatus(params),
    () => billingApi.getPaymentStatus(params)
  );
};
export const usePaymentPayType = (params: { remote_utility_id: string }) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.billing.paymentPayType(params),
    () => billingApi.getPaymentPayType(params)
  );
};

export const usePSPConfig = (remoteUtilityId: string) =>
  useSmartQuery(
    QueryKeyFactory.module.payments.pspConfig(),
    () =>
      billingApi.getPSPConfigurationDetails(remoteUtilityId),
    {
      enabled: !!remoteUtilityId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
    }
  );

export const useConnectPaymentMethod = (payload?: any) => {
  return useSmartMutation(billingApi.connectPaymentMethod, {
    ...payload,
    onSuccess: () => {},
  });
};
