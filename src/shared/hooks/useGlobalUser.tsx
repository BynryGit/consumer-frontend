// hooks/shared/useGlobalUser.ts


// import { authApi } from "@features/auth/api";
import { UserProfile } from "@features/auth/types";
import { useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";



const CACHED_PROFILE_KEY = "cached_user_profile";

export const useGlobalUserProfile = () => {
  const queryKey = QueryKeyFactory.global.user.profile();

  return useSmartQuery<UserProfile>(
    queryKey,
    async () => {
      // Check localStorage cache
      const stored = localStorage.getItem(CACHED_PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        return parsed;
      }

      // Fallback to API
      // const profile = await authApi.getUserProfile();
      // localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(profile));
      // return profile;
    },
   
  );
};

