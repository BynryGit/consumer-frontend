import {
  camelToSnakeCaseInterceptor,
  snakeToCamelCaseInterceptor,
} from "@shared/utils/caseConverter";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
import { getAuthToken } from "../../auth/authUtils";
import { API_BASE_URLS, ApiType } from "../api-endpoints";
import { queryClient } from "../queries/queryClient";

// Create a custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiClientConfig {
  timeout?: number;
  retries?: number;
  offlineSupport?: boolean;
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
}

const SERVICE_CONFIGS: Record<ApiType, ApiClientConfig> = {
  auth: {
    timeout: 30000,
    retries: 1,
    requiresAuth: true,
  },
  cx: {
    timeout: 60000,
    retries: 3,
    offlineSupport: true,
    requiresAuth: true,
  },
   bx: {
    timeout: 60000,
    retries: 3,
    offlineSupport: true,
    requiresAuth: true,
  },
   onboarding: {
    timeout: 45000,
    retries: 2,
    requiresAuth: true,
  },
    activityLog: {
    timeout: 30000,
    retries: 1,
    requiresAuth: true,
  },
  star: {
    timeout: 30000,
    retries: 2,
    requiresAuth: true,
  },
  consumerWeb: {
    timeout: 60000,
    retries: 3,
    offlineSupport: true,
    requiresAuth: true,
  },
    communication: {
    timeout: 40000,
    retries: 5,
    requiresAuth: true,
  },
  receipt: {
    timeout: 30000,
    retries: 2,
    requiresAuth: true,
  },
};

// Optimized request deduplication with automatic cleanup
const pendingRequests = new Map<string, Promise<any>>();
const requestTimestamps = new Map<string, number>();
const REQUEST_CACHE_TTL = 30000; // 30 seconds

const createRequestKey = (method: string, url: string, data?: any): string => {
  return `${method}:${url}:${JSON.stringify(data || {})}`;
};

// Cleanup expired pending requests for better performance
const cleanupExpiredRequests = () => {
  const now = Date.now();
  for (const [key, timestamp] of requestTimestamps.entries()) {
    if (now - timestamp > REQUEST_CACHE_TTL) {
      pendingRequests.delete(key);
      requestTimestamps.delete(key);
    }
  }
};

// Service-specific error handler
const handleServiceError = (
  serviceType: ApiType,
  status: number,
  data?: any,
  url?: string
) => {
  const servicePrefix = `[${serviceType.toUpperCase()}]`;
  const nonAuthUrls = ["/login", "/forgot-password", "/reset-password", "/"];

  switch (status) {
    case 400:
      toast.error(`${servicePrefix} Bad request. Please check your input.`);
      break;
    case 401:
      // Handle unauthorized access
      // Only handle 401 if it's not an auth service request or if it's not a non-auth URL
      if (
        serviceType !== "auth" ||
        (url &&
          !nonAuthUrls.some(
            (authUrl) => url === authUrl || url.endsWith(authUrl)
          ))
      ) {
        toast.error("Session expired. Please login again.");
        // Clear all localStorage items
        localStorage.clear();
        sessionStorage.clear();
        // Clear React Query cache
        queryClient.clear();
        // Clear any other cached data
        if (window.caches) {
          caches.keys().then((cacheNames) => {
            cacheNames.forEach((cacheName) => {
              caches.delete(cacheName);
            });
          });
        }
        // Redirect to login page
        window.location.href = "/login";
      }
      break;
    case 403:
      toast.error(
        `${servicePrefix} You do not have permission to perform this action.`
      );
      break;
    case 404:
      toast.error(`${servicePrefix} The requested resource was not found.`);
      break;
    case 422:
      toast.error(
        `${servicePrefix} ${
          data?.message || "Validation error. Please check your input."
        }`
      );
      break;
    case 429:
      toast.error(
        `${servicePrefix} Too many requests. Please try again later.`
      );
      break;
    case 500:
      if (serviceType === "cx") {
        toast.error("CX service temporarily unavailable. Working offline.");
      } else {
        toast.error(
          `${servicePrefix} An internal server error occurred. Please try again later.`
        );
      }
      break;
    case 502:
      toast.error(`${servicePrefix} Bad gateway. Please try again later.`);
      break;
    case 503:
      toast.error(
        `${servicePrefix} Service unavailable. Please try again later.`
      );
      break;
    case 504:
      toast.error(`${servicePrefix} Gateway timeout. Please try again later.`);
      break;
    default:
      toast.error(
        data?.message || `${servicePrefix} An unexpected error occurred`
      );
  }
};


const createServiceInterceptors = (
  serviceType: ApiType,
  config: ApiClientConfig
) => {
  // FIXED: Expanded list of URLs that should NOT have auth tokens
  const nonAuthUrls = [
    "/login", 
    "/forgot-password", 
    "/reset-password",
    "/auth/login",           // Add this - your actual endpoint
    "/auth/forgot-password", 
    "/auth/reset-password",
    "auth/login",            // Without leading slash
    "auth/forgot-password",
    "auth/reset-password",
    "/signup",               // If you have signup
    "/register"              // If you have register
  ];
  
  const retryCount = new Map<string, number>();

  return {
    request: async (requestConfig: InternalAxiosRequestConfig) => {
      console.log(
        `[${serviceType.toUpperCase()}] Making request to:`,
        requestConfig.url
      );

      // Cleanup expired requests periodically
      if (Math.random() < 0.1) {
        cleanupExpiredRequests();
      }

      // Check for duplicate requests
      const requestKey = createRequestKey(
        requestConfig.method || "GET",
        requestConfig.url || "",
        requestConfig.data
      );

      if (pendingRequests.has(requestKey)) {
        console.log(
          `[${serviceType.toUpperCase()}] Duplicate request detected, reusing existing request`
        );

        const pendingPromise = pendingRequests.get(requestKey);

        if (pendingPromise) {
          try {
            return await pendingPromise;
          } catch (error) {
            pendingRequests.delete(requestKey);
            requestTimestamps.delete(requestKey);
          }
        }
      }

      // FIXED: Better logic for checking public auth URLs
      const url = requestConfig.url || "";
      const isPublicAuthUrl = nonAuthUrls.some(
        (authUrl) => {
          // Check if URL matches exactly, ends with, or contains the auth URL
          const exactMatch = url === authUrl;
          const endsWithMatch = url.endsWith(authUrl);
          const containsMatch = url.includes(authUrl);
          
          const isMatch = exactMatch || endsWithMatch || containsMatch;
          
          if (isMatch) {
            console.log(`🔓 Public URL detected: ${url} matches ${authUrl}`);
          }
          
          return isMatch;
        }
      );

      console.log(
        "=== AUTH CHECK ===",
        {
          url,
          isPublicAuthUrl,
          requiresAuth: config.requiresAuth,
          serviceType,
          willAddToken: config.requiresAuth && !isPublicAuthUrl
        }
      );

      // FIXED: Only add token for endpoints that require auth AND are not public auth URLs
      if (config.requiresAuth && !isPublicAuthUrl) {
        const token = getAuthToken();
        console.log(
          "🔐 Adding auth token:",
          token ? "Token found" : "No token found"
        );

        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
          console.log("✅ Authorization header added");
        } else {
          console.warn("⚠️ No auth token available for protected endpoint:", url);
        }
      } else {
        console.log("🚫 SKIPPING auth token for endpoint:", url);
        // Explicitly remove any Authorization header that might be set
        if (requestConfig.headers.Authorization) {
          delete requestConfig.headers.Authorization;
          console.log("🗑️ Removed existing Authorization header");
        }
      }

      // Check if the request data is FormData OR if responseType is blob
      const isFormData = requestConfig.data instanceof FormData;
      const isBlobResponse = requestConfig.responseType === "blob";

      // Only set Content-Type for non-FormData requests and non-blob responses
      if (!isFormData && !isBlobResponse) {
        requestConfig.headers["Content-Type"] = "application/json";
      }

      // Add custom headers if needed
      if (config.customHeaders) {
        Object.assign(requestConfig.headers, config.customHeaders);
      }

      // Check if the URL contains any dropdown-related keywords
      const isDropdownRequest = requestConfig.url
        ?.toLowerCase()
        .match(/(isdropdown)/);

      // Dispatch loading start event with method and URL
      if (requestConfig.method) {
        window.dispatchEvent(
          new CustomEvent("", {
            detail: {
              method: requestConfig.method.toUpperCase(),
              url: isDropdownRequest ? requestConfig.url : undefined,
            },
          })
        );
      }

      // CX offline support
      if (serviceType === "cx" && config.offlineSupport) {
        if (!navigator.onLine) {
          console.log("[CX] Offline detected, queueing request");
        }
      }

      // Track this request
      requestTimestamps.set(requestKey, Date.now());

      // Only apply camelToSnakeCaseInterceptor for non-FormData requests
      if (isFormData) {
        console.log(
          "[FormData] Skipping camelToSnakeCase conversion for FormData"
        );
        return requestConfig;
      } else {
        return camelToSnakeCaseInterceptor(requestConfig);
      }
    },

    response: (response: AxiosResponse) => {
      console.log(`[${serviceType.toUpperCase()}] Response received:`, {
        status: response.status,
        url: response.config.url,
        contentType: response.headers["content-type"],
      });

      const requestKey = createRequestKey(
        response.config.method || "GET",
        response.config.url || "",
        response.config.data
      );

      retryCount.delete(requestKey);
      pendingRequests.delete(requestKey);
      requestTimestamps.delete(requestKey);

      window.dispatchEvent(new CustomEvent("api-loading-end"));

      const isBlobResponse = response.config.responseType === "blob";
      if (isBlobResponse) {
        console.log(
          "[Blob Response] Skipping snakeToCamelCase conversion for blob data"
        );
        return response;
      }

      return snakeToCamelCaseInterceptor(response);
    },

    error: async (error: AxiosError) => {
      console.error(`[${serviceType.toUpperCase()}] API Error:`, {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
      });

      if (error.config && error.response?.status) {
        const requestKey = createRequestKey(
          error.config.method || "GET",
          error.config.url || "",
          error.config.data
        );

        const currentRetries = retryCount.get(requestKey) || 0;
        const maxRetries = config.retries || 1;
        const status = error.response.status;

        const shouldRetry =
          (status >= 500 || status === 429) && currentRetries < maxRetries;

        if (shouldRetry) {
          retryCount.set(requestKey, currentRetries + 1);
          console.log(
            `[${serviceType.toUpperCase()}] Retrying request (${
              currentRetries + 1
            }/${maxRetries}) for status ${status}`
          );

          const delay = Math.min(1000 * Math.pow(2, currentRetries), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));

          return axios(error.config);
        }

        retryCount.delete(requestKey);
      }

      if (error.config) {
        const requestKey = createRequestKey(
          error.config.method || "GET",
          error.config.url || "",
          error.config.data
        );

        pendingRequests.delete(requestKey);
        requestTimestamps.delete(requestKey);
        retryCount.delete(requestKey);
      }

      window.dispatchEvent(new CustomEvent("api-loading-end"));

      const data = error.response?.data as { message?: string; code?: string };
      const status = error.response?.status || 0;


      const apiError = new ApiError(
        status,
        data?.message || error.message || "An unexpected error occurred",
        data
      );

      throw apiError;
    },
  };  
};

export const createServiceApiClient = (serviceType: ApiType): AxiosInstance => {
  const config = SERVICE_CONFIGS[serviceType];
  const baseURL = API_BASE_URLS[serviceType];

  if (!baseURL) {
    throw new Error(`No base URL configured for service: ${serviceType}`);
  }
  const client = axios.create({
    baseURL,
    timeout: config.timeout || 30000,
    headers: {
      ...config.customHeaders,
    },
    validateStatus: (status) => status >= 200 && status < 300,
  });

  // Add service-specific interceptors
  const serviceInterceptors = createServiceInterceptors(serviceType, config);

  // Request interceptor
  client.interceptors.request.use(serviceInterceptors.request, (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  });

  // Response interceptor
  client.interceptors.response.use(
    serviceInterceptors.response,
    serviceInterceptors.error
  );

  // Add request tracking for deduplication
  const originalRequest = client.request;
  client.request = function (config) {
    const requestKey = createRequestKey(
      config.method || "GET",
      config.url || "",
      config.data
    );

    const requestPromise = originalRequest.call(this, config);
    pendingRequests.set(requestKey, requestPromise);

    // Auto-cleanup when request completes
    requestPromise.finally(() => {
      pendingRequests.delete(requestKey);
      requestTimestamps.delete(requestKey);
    });

    return requestPromise;
  };

  return client;
};

// Create a default API client for backward compatibility
export const defaultApiClient = createServiceApiClient("auth");

// Export pre-configured clients
export const authApiClient = createServiceApiClient("auth");
export const cxApiClient = createServiceApiClient("cx");
export const bxApiClient = createServiceApiClient("bx");
export const starApiClient = createServiceApiClient("star");
export const onboardingApiClient = createServiceApiClient("onboarding");
export const receiptApiClient = createServiceApiClient("receipt");
export const activityLogApiClient = createServiceApiClient("activityLog");
export const consumerApiClient = createServiceApiClient("consumerWeb");
export const communicationApiClient = createServiceApiClient("communication");

// export const consumerWebClient = createServiceApiClient("consumerWeb");
