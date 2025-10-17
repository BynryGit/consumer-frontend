import { useSmartQuery, useSmartMutation } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { toast, useToast } from "@shared/hooks/use-toast";
import { onboardingApi } from "@features/onboarding/utility-setup/api";

import {
  useRemoteUtilityId,
} from "@shared/selectors/globalSelectors";

// Hook to get all active utility services
export const useActiveUtilityServices = () => {
  const utilityID = useRemoteUtilityId();
  const key = QueryKeyFactory.global.utility.activeUtility();
  return useSmartQuery(key as unknown[], () =>
    onboardingApi.getActiveUtilityService(utilityID)
  );
};
