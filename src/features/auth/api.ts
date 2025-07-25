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

  forgotPassword: async (email: any): Promise<void> => {
    const response = await authApiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      {
        email: email,
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

   ForgotPassword:async(
    payload:forgotPassword
   ):Promise<any>=>{
    const response=await authApiClient.post<any>(
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



