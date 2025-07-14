import { ApiEndpoints } from "@shared/api/api-endpoints";

import { Utility, UtilityResponse } from "./types";
import { authApiClient } from "@shared/api/clients/apiClientFactory";
// Add your feature-specific API calls here
export const coreApi = {
  getUtility: async (tenantId: string): Promise<Utility[]> => {
    if (!tenantId) {
      return [];
    }
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "auth",
      "get-utility",
      (qs) => {
        qs.push("tenant_id", tenantId.toString());
      }
    );
    const response = await authApiClient.get<UtilityResponse>(url);
    return response.data.result;
  },
};
