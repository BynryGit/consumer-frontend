import { AxiosError } from 'axios';

import {
  ApiError,
  ValidationError,
  BusinessError,
  AuthError,
  NetworkError,
  AppError,
} from '../types/error.types';

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'status' in error &&
    'timestamp' in error
  );
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'field' in error &&
    'constraints' in error
  );
};

export const isBusinessError = (error: unknown): error is BusinessError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'severity' in error
  );
};

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'type' in error
  );
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'type' in error
  );
};

export function processError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    return {
      code: 'API_ERROR',
      message: error.response?.data?.message || error.message,
      type: 'server_error',
      details: error,
    } as NetworkError;
  }

  if (isApiError(error)) {
    return error;
  }

  if (isValidationError(error)) {
    return error;
  }

  if (isBusinessError(error)) {
    return error;
  }

  if (isAuthError(error)) {
    return error;
  }

  if (isNetworkError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      type: 'server_error',
      details: error,
    } as NetworkError;
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    type: 'server_error',
    details: error,
  } as NetworkError;
}

export function getErrorMessage(error: unknown): string {
  const processedError = processError(error);
  return processedError.message;
}

export function getErrorCode(error: unknown): string {
  const processedError = processError(error);
  return processedError.code;
} 