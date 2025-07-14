import { QueryStringParameters, UrlBuilder } from "./url-builder";

// Define API types
export type ApiType =
  | "auth"
  | "cx"
  | "star"
  | "receipt"
  | "consumerWeb";

// Define API base URLs
export const API_BASE_URLS: Record<ApiType, string> = {
  auth: import.meta.env.VITE_AUTH_API_ENDPOINT || "",
  cx: import.meta.env.VITE_CX_API_ENDPOINT || "",
  star: import.meta.env.VITE_STAR_API_ENDPOINT || "",
  receipt: import.meta.env.VITE_RECEIPT_API_ENDPOINT || "",
  consumerWeb: import.meta.env.VITE_CONSUMER_WEB_API_ENDPOINT || "",
};

export class ApiEndpoints {
  // Create basic URL
  static createUrl(
    apiType: ApiType,
    action: string,
    isMockAPI: boolean = false
  ): string {
    const baseUrl = isMockAPI
      ? import.meta.env.VITE_API_MOCK_ENDPOINT
      : API_BASE_URLS[apiType];

    const urlBuilder = new UrlBuilder(baseUrl || "", `${action}/`);
    return urlBuilder.toString();
  }

  // Create URL with query parameters
  static createUrlWithQueryParameters(
    apiType: ApiType,
    action: string,
    queryStringHandler?: (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder = new UrlBuilder(API_BASE_URLS[apiType], `${action}/`);

    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }

    return urlBuilder.toString();
  }

  // Create URL with path variables
  static createUrlWithPathVariables(
    apiType: ApiType,
    action: string,
    pathVariables: any[] = []
  ): string {
    const encodedPathVariables = pathVariables
      .filter(Boolean)
      .map((variable) => `/${encodeURIComponent(variable.toString())}`)
      .join("");

    const urlBuilder = new UrlBuilder(
      API_BASE_URLS[apiType],
      `${action}${encodedPathVariables}/`
    );

    return urlBuilder.toString();
  }

  // Create URL with both path and query variables
  static createUrlWithPathAndQueryVariables(
    apiType: ApiType,
    action: string,
    pathVariables: any[] = [],
    queryStringHandler?: (queryStringParameters: QueryStringParameters) => void
  ): string {
    const encodedPathVariables = pathVariables
      .filter(Boolean)
      .map((variable) => `/${encodeURIComponent(variable.toString())}`)
      .join("");

    const urlBuilder = new UrlBuilder(
      API_BASE_URLS[apiType],
      `${action}${encodedPathVariables}/`
    );

    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }

    return urlBuilder.toString();
  }
}
