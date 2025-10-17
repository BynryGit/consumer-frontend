import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { createServiceApiClient } from "../clients/apiClientFactory";
import { ApiResponse } from "../../../core/types";

interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: any;
}

export const handleApiError = (error: any) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    const status = error.response?.status || 0;

    return {
      message: data?.message || error.message || "An unexpected error occurred",
      code: data?.code || `HTTP_${status}`,
      status,
      details: data?.details || error.response?.data,
    };
  }

  return {
    message: error.message || "An unexpected error occurred",
    code: error.code || "UNKNOWN_ERROR",
    status: error.status || 0,
    details: error.details,
  };
};

// Create service-specific API clients

// Service-specific API clients
const authApiClient = createServiceApiClient("auth");
const cxApiClient = createServiceApiClient("cx");
// ... other service clients

// Service router - determines which client to use
const getApiClientForService = (serviceType: string) => {
  const clients = {
    auth: authApiClient,
    cx: cxApiClient,
  };
  return clients[serviceType] || authApiClient; // fallback
};

// Generic API functions - FIXED for .result structure
export const apiGet = async <T>(
  url: string,
  serviceType: string = "auth",
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = getApiClientForService(serviceType);
    const response: AxiosResponse<any> = await client.get(url, config);

    if (!response.data) {
      throw new Error("No data received from server");
    }

    const data = response.data;

    // Try to auto-detect result wrapper
    if ("result" in data) {
      return data.result;
    } else if ("results" in data && "count" in data) {
      return data; // paginated data, return full object
    } else {
      return data; // fallback: return whatever came
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiPost = async <T>(
  url: string,
  data?: any,
  serviceType: string = "auth",
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = getApiClientForService(serviceType);
    const response: AxiosResponse<ApiResponse<T>> = await client.post(
      url,
      data,
      config
    );

    if (!response.data) {
      throw new Error("No data received from server");
    }

    const responseData = response.data;

    // Try to auto-detect result wrapper for single item responses
    if ("result" in responseData && responseData.result !== undefined) {
      return responseData.result;
    } else if ("data" in responseData && responseData.data !== undefined) {
      return responseData.data;
    } else {
      return responseData as T; // Fallback: assume response is the data itself
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiPut = async <T>(
  url: string,
  data?: any,
  serviceType: string = "auth",
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = getApiClientForService(serviceType);
    const response: AxiosResponse<ApiResponse<T>> = await client.put(
      url,
      data,
      config
    );

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiPatch = async <T>(
  url: string,
  data?: any,
  serviceType: string = "auth",
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = getApiClientForService(serviceType);
    const response: AxiosResponse<ApiResponse<T>> = await client.patch(
      url,
      data,
      config
    );

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const apiDelete = async <T>(
  url: string,
  serviceType: string = "auth",
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const client = getApiClientForService(serviceType);
    const response: AxiosResponse<ApiResponse<T>> = await client.delete(
      url,
      config
    );

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
