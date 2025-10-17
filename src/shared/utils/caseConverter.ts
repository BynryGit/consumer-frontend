import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * Converts a snake_case string to camelCase
 */
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Checks if a field name indicates it's a currency field
 */
const isCurrencyField = (fieldName: string): boolean => {
  const currencyPatterns = [
    "amount",
    "price",
    "cost",
    "fee",
    "total",
    "subtotal",
    "balance",
    "charge",
  ];
  const lowerFieldName = fieldName.toLowerCase();

  // Exclude fields that contain currency-like words but are not actual currency values
  const exclusions = [
    "display",
    "mode",
    "method",
    "type",
    "status",
    "category",
    "name",
    "meters"
  ];
  const hasExclusion = exclusions.some((exclusion) =>
    lowerFieldName.includes(exclusion)
  );

  if (hasExclusion) {
    return false;
  }

  // Special handling for 'payment' - only consider it currency if it's specifically about amounts
  if (lowerFieldName.includes("payment")) {
    return (
      lowerFieldName.includes("amount") ||
      lowerFieldName.includes("total") ||
      lowerFieldName.includes("balance") ||
      lowerFieldName.includes("fee") ||
      lowerFieldName === "payment"
    ); // exact match for just 'payment'
  }

  return currencyPatterns.some((pattern) => lowerFieldName.includes(pattern));
};
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
/**
 * Type mapping configuration
 */
interface TypeMapping {
  [key: string]: {
    type: string;
    transform?: (value: any) => any;
  };
}

/**
 * Default type mappings for common fields
 */
const defaultTypeMappings: TypeMapping = {
  id: { type: "number", transform: Number },
  // status: { type: "number", transform: Number },
  isVip: { type: "boolean", transform: Boolean },
  isAutoPay: { type: "boolean", transform: Boolean },
  isEBill: { type: "boolean", transform: Boolean },
  isPaperedBill: { type: "boolean", transform: Boolean },
  createdDate: { type: "string" },
  registrationDate: { type: "string" },
  approveDate: { type: "string" },
  connectDate: { type: "string" },
  activateDate: { type: "string" },
  date: { type: "string" },
};

/**
 * Recursively converts all snake_case keys in an object to camelCase and applies type transformations
 */
const convertToCamelCase = (
  data: any,
  typeMappings: TypeMapping = defaultTypeMappings
): any => {
  if (Array.isArray(data)) {
    return data.map((item) => convertToCamelCase(item, typeMappings));
  }

  if (data !== null && typeof data === "object") {
    const converted: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      // Convert the key to camelCase
      const camelKey = toCamelCase(key);

      // Apply type transformation if mapping exists
      if (typeMappings[camelKey]) {
        const { transform } = typeMappings[camelKey];
        converted[camelKey] = transform ? transform(value) : value;
      } else {
        // Recursively convert nested objects and arrays
        converted[camelKey] = convertToCamelCase(value, typeMappings);
      }
    });

    return converted;
  }

  return data;
};

/**
 * Recursively converts all camelCase keys in an object to snake_case
 */
const convertToSnakeCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => convertToSnakeCase(item));
  }

  if (data !== null && typeof data === "object") {
    const converted: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      const snakeKey = toSnakeCase(key);
      converted[snakeKey] = convertToSnakeCase(value);
    });

    return converted;
  }

  return data;
};

/**
 * Creates a type-safe response transformer for a specific type
 */
export const createResponseTransformer = <T>(
  typeMappings: TypeMapping = {}
) => {
  return (response: AxiosResponse): T => {
    const convertedData = convertToCamelCase(response.data, {
      ...defaultTypeMappings,
      ...typeMappings,
    });
    return convertedData as T;
  };
};

/**
 * Axios response interceptor to convert snake_case to camelCase
 */
export const snakeToCamelCaseInterceptor = (
  response: AxiosResponse
): AxiosResponse => {
  if (response.data) {
    response.data = convertToCamelCase(response.data);
  }
  return response;
};

/**
 * Axios request interceptor to convert camelCase to snake_case
 */
export const camelToSnakeCaseInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (config.data) {
    config.data = convertToSnakeCase(config.data);
  }

  if (config.params) {
    config.params = convertToSnakeCase(config.params);
  }

  return config;
};

export const convertKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = toSnakeCase(key);
      acc[newKey] = convertKeysToSnakeCase(value);
      return acc;
    }, {} as any);
  }

  return obj;
};

export { toCamelCase, toSnakeCase, convertToCamelCase, convertToSnakeCase };
