import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "./api";
import type { ConsumerWebLoginPayload, forgotPassword, UserProfile } from "./types";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { globalQueryClient } from "@shared/api/queries/queryClients";
import { toast } from "sonner";
import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";

interface User {
  id: string;
  email: string;
  token: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  userProfile: UserProfile | undefined;
  isProfileLoading: boolean;
  profileError: Error | null;
}

const CACHED_PROFILE_KEY = "cached_user_profile";

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      if (!user) {
        setUser({ id: "", email: "", token });
      }
    }
  }, [user]);

  // React Query hook for user profile
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      // First check if we have cached data in React Query
      const cachedData = queryClient.getQueryData(["userProfile"]);
      if (cachedData) {
        return cachedData as UserProfile;
      }

      // Then check localStorage
      const storedProfile = localStorage.getItem(CACHED_PROFILE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as UserProfile;
        // Update React Query cache with localStorage data
        queryClient.setQueryData(["userProfile"], parsedProfile);
        return parsedProfile;
      }

      // If no cached data, fetch from API
      const response = await authApi.getUserProfile();
      // Store in localStorage as backup
      localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(response));
      return response;
    },
    enabled: !!user, // Only fetch when user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Check and fetch profile on mount if needed
  useEffect(() => {
    const checkAndFetchProfile = async () => {
      const token = localStorage.getItem("auth_token");
      if (token && !userProfile && !isProfileLoading) {
        try {
          await refetchProfile();
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          // If profile fetch fails, clear auth state
          localStorage.removeItem("auth_token");
          localStorage.removeItem(CACHED_PROFILE_KEY);
          setUser(null);
          queryClient.clear();
        }
      }
    };

    checkAndFetchProfile();
  }, [userProfile, isProfileLoading, refetchProfile, queryClient]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authApi.login({ email, password });
        localStorage.setItem("auth_token", response.user.token);
        setUser(response.user);
        console.log("Response", response);

        const profile = await authApi.getUserProfile();

        // Save in globalQueryClient (because profile is shared data)
        const key = QueryKeyFactory.global.user.profile();
        globalQueryClient.setQueryData(key, profile);

        // Save to localStorage
        localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(profile));

        navigate("/onboarding/system-admin/dashboard");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred during login";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      console.log('called to logout');
      localStorage.clear();
      // Clear React Query cache on logout
      queryClient.clear();
      navigate("/login");
    }
  }, [navigate, queryClient]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.forgotPassword(email);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during password reset";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.resetPassword(token, password);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during password reset";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    forgotPassword,
    resetPassword,
    userProfile,
    isProfileLoading,
    profileError,
  };
};

// Consumer Web Login Hook
export const useConsumerWebLogin = () => {
  return useSmartMutation(
    (payload: ConsumerWebLoginPayload) => authApi.loginConsumerWeb(payload),
    {
      onSuccess: (data) => {
        toast.success("Login successful");
      },
      onError: (error: any) => {
        toast.error(`Login failed: ${error.message}`);
      },
    }
  );
};

// Forgot Password Hook
export const useForgotPassword = () => {
  return useSmartMutation(
    (payload: { email: string,role: string }) => authApi.forgotPassword(payload.email,payload.role),
    {
      onSuccess: (data) => {
        toast.success("Password reset email sent successfully");
      },
      onError: (error: any) => {
        toast.error(`Failed to send reset email: ${error.message}`);
      },
    }
  );
};

// Reset Password Hook (Used for both signup and forgot password flows)
// This is used by your SignUp component
export const useResetPassword = () => {
  return useSmartMutation(
    (payload: { email: string, role: any }) => authApi.getResetPassword(payload.email, payload.role),
    {
      onSuccess: (data) => {
        toast.success("Password setup email sent successfully");
      },
      onError: (error: any) => {
        toast.error(`Failed to send setup email: ${error.message}`);
      },
    }
  );
};

// NEW HOOK: Password Reset with URL Parameters
// This is used by your PasswordSetup component when processing the email link
export const usePasswordResetWithParams = () => {
  return useSmartMutation(
    (payload: { 
      password: string, 
      email: string,
      code: string,
      et: string 
    }) => {
      return authApi.resetPasswordWithParams(
        { password: payload.password, email: payload.email },
        { et: payload.et, code: payload.code }
      );
    },
    {
      onSuccess: (data) => {
        toast.success("Password has been set successfully");
      },
      onError: (error: any) => {
        toast.error(`Failed to set password: ${error.message}`);
      },
    }
  );
};

// Consumer Web Login Status Hook
export const useConsumerWebLoginStatus = () => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.login.consumerWebLoginStatus(),
    () => authApi.getConsumerWebLogin(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: false,
      enabled: !!localStorage.getItem('access_token'), // Only fetch if token exists
    }
  );
};

// User Utility Hook
export const useUserUtility = (params: { tenant_alias: string }) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.login.userUtility(params),
    () => authApi.getUserUtility(params),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes - utility info doesn't change often
      refetchInterval: false,
    }
  );
};