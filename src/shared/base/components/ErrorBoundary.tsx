import React, { Component, ErrorInfo, ReactNode } from 'react';

import { useToast } from '../providers/ToastProvider';
import { AppError } from '../types/error.types';
import { processError, getErrorMessage } from '../utils/errorProcessor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    const processedError = processError(error);
    return { hasError: true, error: processedError };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    const processedError = processError(error);
    console.error('Error caught by boundary:', processedError, errorInfo);
    if (this.props.onError) {
      this.props.onError(processedError);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={this.handleReset}
              >
                Try again
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary context
export const useErrorBoundary = () => {
  const toast = useToast();

  const handleError = (error: unknown) => {
    const processedError = processError(error);
    toast.error(getErrorMessage(processedError));
  };

  return { handleError };
}; 