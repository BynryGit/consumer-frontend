// hooks/shared/useGlobalUser.ts

import { authApi } from "@features/auth";
import { UserProfile } from "@features/auth/types";
import { coreApi } from "@features/core/api";
import { useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { useTenantId } from "@shared/selectors/globalSelectors";



const CACHED_PROFILE_KEY = "utility";

export const useGlobalUtility = () => {
  const tenantId=useTenantId()
  const queryKey = QueryKeyFactory.global.utilities.selected();

  return useSmartQuery<UserProfile>(
    queryKey,
    async () => {
      // Check localStorage cache
      const stored = localStorage.getItem(CACHED_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as any;
        return parsed;
      }

      // Fallback to API
      const profile = await coreApi.getUtility(tenantId);
      localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    },
   
  );
};

