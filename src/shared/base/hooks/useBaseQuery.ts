import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useBaseQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
} 