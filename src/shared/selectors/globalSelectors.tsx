import { useGlobalUserProfile } from "@shared/hooks/useGlobalUser";
import { useGlobalUtility } from "@shared/hooks/useGlobalUtility";

export const useTenantId = () => {
  const { data: userProfile } = useGlobalUserProfile();
  return userProfile?.utility?.tenant?.id?.toString() ?? null;
};
export const useUserName = () => {
  const { data: userProfile } = useGlobalUserProfile();
  return userProfile?.user?.name ?? null;
};

export const useCurrency = () => {
  const { data: userProfile } = useGlobalUserProfile();
  return userProfile?.utility?.tenant?.currency?.toString() ?? null;
};

export const useCountry = () => {
  const { data: userProfile } = useGlobalUserProfile();
  return (
    userProfile?.utility?.tenant?.extraDataMap?.country?.toString() ?? null
  );
};

export const useRemoteUtilityId = () => {
  const { data: utility } = useGlobalUtility();
  return String(utility?.id ?? "");
};

export const useUserId = () => {
  const { data: userProfile } = useGlobalUserProfile();
  console.log("Data of user", userProfile);
  return userProfile?.id.toString() ?? null;
};
    