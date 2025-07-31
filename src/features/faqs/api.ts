import { ApiEndpoints } from "@shared/api/api-endpoints";
import { onboardingApiClient } from "@shared/api/clients/apiClientFactory";
import { AddHelpfullPayload } from "./types";


// Add your feature-specific API calls here
// Updated API file - add this to your existing faqsApi
export const faqsApi = {
  getFaq: async (params: {
    remote_utility_id: string;
    show_inactive: any;
    faq_category: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "onboarding",
      "config-map/faq",
      (qs) => {
        qs.push("remote_utility_id", params.remote_utility_id);
        qs.push("show_inactive", params.show_inactive);
        qs.push("faq_category", params.faq_category);
      }
    );
    const response = await onboardingApiClient.get(url);
    return response.data;
  },

  // NEW: Search FAQ across all categories
  searchFaq: async (params: {
    search_data: string;
    remote_utility_id: string;
  }): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "onboarding",
      "search/onboarding_config",
      (qs) => {
        qs.push("search_field", "faq");
        qs.push("search_data", params.search_data);
        qs.push("remote_utility_id", params.remote_utility_id);
      }
    );
    const response = await onboardingApiClient.get(url);
    return response.data;
  },

  addHelpful: async (payload: AddHelpfullPayload): Promise<any> => {
    const url = ApiEndpoints.createUrl("onboarding", "config-map/faq");
    const response = await onboardingApiClient.patch(url, payload);
    return response.data;
  },
};
