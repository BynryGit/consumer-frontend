import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { faqsApi } from "./api";
import { AddHelpfullPayload } from "./types";

export const useFaqData = (params: {
  remote_utility_id: string;
   show_inactive:any;
    faq_category:string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.faqs.faqData(params),
    () => faqsApi.getFaq(params)
  );
};
export const useFaqSearch = (params: {
  search_data: string;
  remote_utility_id: string;  
}, options?: { enabled?: boolean }) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.faqs.searchFaq(params),
    () => faqsApi.searchFaq(params),
    {
      enabled: options?.enabled !== false && params.search_data.length > 0,
      staleTime: 30000, // Cache search results for 30 seconds
    }
  );
};

export const useUpdateFaqStatus= () => {
  return useSmartMutation(
    (payload: AddHelpfullPayload) =>
      faqsApi.addHelpful(payload),
  
  );
};