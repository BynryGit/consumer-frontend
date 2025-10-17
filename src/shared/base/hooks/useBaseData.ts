import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function useBaseData({
  queryKey,
  queryFn,
  queryOptions = {},
  onDataLoaded,
  onError,
  initialData,
  variables,
}) {
  const [data, setData] = useState(initialData);
  const {
    data: queryData,
    error,
    isLoading,
    ...queryRest
  } = useQuery({
    queryKey,
    queryFn: () => queryFn(variables),
    initialData,
    ...queryOptions,
  });

  useEffect(() => {
    if (queryData) {
      setData(queryData);
      onDataLoaded?.(queryData);
    }
    if (error) {
      onError?.(error);
    }
  }, [queryData, error]);

  return {
    data,
    error,
    isLoading,
    ...queryRest,
  };
} 