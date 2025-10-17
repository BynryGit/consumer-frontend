export interface BaseError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiError extends BaseError {
  status: number;
  timestamp: string;
}

export interface ValidationError extends BaseError {
  field: string;
  constraints: Record<string, string>;
}

export interface BusinessError extends BaseError {
  severity: 'warning' | 'error' | 'critical';
}

export interface AuthError extends BaseError {
  type: 'unauthorized' | 'forbidden' | 'expired' | 'invalid';
}

export interface NetworkError extends BaseError {
  type: 'timeout' | 'offline' | 'server_error';
}

export type AppError = ApiError | ValidationError | BusinessError | AuthError | NetworkError;

export interface ErrorHandler {
  handleError: (error: unknown) => void;
  resetError: () => void;
}

export interface ErrorState {
  hasError: boolean;
  error: AppError | null;
} 