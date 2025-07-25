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


export const useUpdateFaqStatus= () => {
  return useSmartMutation(
    (payload: AddHelpfullPayload) =>
      faqsApi.addHelpful(payload),
  
  );
};