import React from 'react';

import { useToast } from '../providers/ToastProvider';
import { AppError } from '../types/error.types';
import { processError, getErrorMessage, isAuthError, isBusinessError, isNetworkError } from '../utils/errorProcessor';

interface WithErrorHandlingProps {
  onError?: (error: AppError) => void;
}

export const withErrorHandling = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithErrorHandling(props: P & WithErrorHandlingProps) {
    const toast = useToast();

    const handleError = (error: unknown) => {
      const processedError = processError(error);
      
      // Show error toast
      toast.error(getErrorMessage(processedError));

      // Log error to monitoring service
      console.error('Error caught by middleware:', processedError);

      // Handle specific error types
      if (isAuthError(processedError) && props.onError) {
        props.onError(processedError);
        return;
      }

      if (isBusinessError(processedError) && props.onError) {
        props.onError(processedError);
        return;
      }

      if (isNetworkError(processedError) && props.onError) {
        props.onError(processedError);
        return;
      }

      // Call onError callback if provided
      if (props.onError) {
        props.onError(processedError);
      }
    };

    return <WrappedComponent {...props} onError={handleError} />;
  };
};

// Hook for using error handling
export const useErrorHandling = () => {
  const toast = useToast();

  const handleError = (error: unknown) => {
    const processedError = processError(error);
    toast.error(getErrorMessage(processedError));
    return processedError;
  };

  return { handleError };
}; 