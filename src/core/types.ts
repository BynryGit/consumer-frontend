// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  result?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  results: T[];
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Feature Flag Types
export interface FeatureFlags {
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  [key: string]: boolean;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Route Types
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  auth?: boolean;
  children?: RouteConfig[];
}
