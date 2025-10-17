import React from "react";
import { useIsFetching } from "@tanstack/react-query";
import { getLoadingTypeForRequest } from './loadingConfig';

const LoadingInterceptor: React.FC = () => {
  const isFetching = useIsFetching();
  const [loadingType, setLoadingType] = React.useState<'skeleton' | 'basic'>('basic');
  const [isDropdownRequest, setIsDropdownRequest] = React.useState(false);

  React.useEffect(() => {
    console.log('isFetching');
    const handleLoadingStart = (event: CustomEvent<{ method: string; url?: string }>) => {
      const type = getLoadingTypeForRequest(event.detail.method as any, event.detail.url);
      setLoadingType(type);
      setIsDropdownRequest(!!event.detail.url);
    };

    window.addEventListener('api-loading-start', handleLoadingStart as EventListener);
    return () => {
      window.removeEventListener('api-loading-start', handleLoadingStart as EventListener);
    };
  }, []);

  // Don't show full-screen loading for dropdown requests
  if (!isFetching || isDropdownRequest) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingInterceptor;