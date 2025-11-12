import {
  ConsumerWebLoginPayload,
  ConsumerWebLoginResponse,
  forgotPassword,
  LoginCredentials,
  LoginResponse,
  UserProfile,
} from "./types";
import { API_ENDPOINTS } from "../../shared/api/endpoints";

import {
  authApiClient,
  cxApiClient,
  consumerApiClient,
} from "@shared/api/clients/apiClientFactory";
import { ApiEndpoints } from "@shared/api/api-endpoints";
import axios from "axios";
import ForgotPassword from "./components/ForgotPassword";

// Add your feature-specific API calls here
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await authApiClient.post(API_ENDPOINTS.auth.login, {
      user: credentials,
    });
    return response.data;
  },

  forgotPassword: async (email: any,role: string): Promise<void> => {
    const response = await authApiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      {
        email: email,
        role: role
      }
    );
    return response.data;
  },

  getResetPassword: async (email: any, role: any): Promise<void> => {
    const response = await authApiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      {
        email: email,
        role: role
      }
    );
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    const response = await authApiClient.post(
      API_ENDPOINTS.auth.resetPassword,
      {
        token,
        password,
      }
    );
    return response.data;
  },

  // NEW METHOD: Reset password with URL parameters (for email links)
  resetPasswordWithParams: async (
    payload: { password: string, email: any },
    queryParams: { et: string; code: string }
  ): Promise<any> => {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "auth",
      "auth/reset-password",
      (query) => {
        query.push("et", queryParams.et);
        query.push("code", queryParams.code);
      }
    );

    const response = await authApiClient.post(url, payload);
    return response.data;
  },

  getUserProfile: async (): Promise<UserProfile> => {
    const response = await authApiClient.get(API_ENDPOINTS.auth.profile);
    return response.data.result;
  },

  logout: async (): Promise<void> => {
    const response = await authApiClient.post(API_ENDPOINTS.auth.logout, {});
    return response.data;
  },

  loginConsumerWeb: async (
    payload: ConsumerWebLoginPayload
  ): Promise<ConsumerWebLoginResponse> => {
    const response = await consumerApiClient.post<ConsumerWebLoginResponse>(
      "/login/",
      payload
    );
    return response.data;
  },

  ForgotPassword: async (
    payload: forgotPassword
  ): Promise<any> => {
    const response = await authApiClient.post<any>(
      "user/auth/forgot-password",
      payload
    );
    return response.data;
  },

  // Consumer Web Login - GET (check login status or get login info)
  getConsumerWebLogin: async (): Promise<any> => {
    const response = await cxApiClient.get(`consumer-web/login/`);
    return response.data;
  },

  // User Utility - GET
  getUserUtility: async (params: { tenant_alias: string }): Promise<any> => {
    const response = await authApiClient.get(
      `utility/?tenant_alias=${params.tenant_alias}`
    );
    return response.data;
  },
};

// STANDALONE FUNCTIONS (keep these for backward compatibility)
export const forgotPasswordApi = async (payload: {
  email: string;
}): Promise<any> => {
  const url = ApiEndpoints.createUrl("auth", "auth/forgot-password");
  const response = await authApiClient.post(url, payload);
  return response.data;
};

// This is the function used by your PasswordSetup component
export const resetPassword = async (
  payload: { password: string, email: any },
  queryParams: { et: string; code: string }
): Promise<any> => {
  const url = ApiEndpoints.createUrlWithQueryParameters(
    "auth",
    "auth/reset-password",
    (query) => {
      query.push("et", queryParams.et);
      query.push("code", queryParams.code);
    }
  );

  const response = await authApiClient.post(url, payload);
  return response.data;
};

export const getNscResponseTimeConfiguration = async (
  remote_utility_id: string
): Promise<any> => {
  try {
    const url = ApiEndpoints.createUrlWithQueryParameters(
      "cx",
      "nsc-connection-configuration",
      (query) => {
        query.push("remote_utility_id", remote_utility_id);
      }
    );
    const response = await cxApiClient.get(url);
    const result = response.data.result || response.data;
    // :white_check_mark: Automatically store in localStorage after successful fetch
    if (result) {
      localStorage.setItem("NSC-Configuration", JSON.stringify(result));
      console.log(":white_check_mark: NSC configuration saved to localStorage");
    }
    return result;
  } catch (error) {
    console.error(":x: Failed to fetch NSC configuration:", error);
    throw error; // rethrow so hook/query can handle it
  }
};










