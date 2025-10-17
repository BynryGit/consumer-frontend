import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { ServiceRouter } from "./serviceRouter";
import {
  QueryKeyFactory,
  EntityType,
  ModuleType,
} from "../queries/queryKeyFactory";

// // Enhanced useQuery that automatically routes to correct client
// export const useSmartQuery = <TData, TError = Error>(
//   queryKey: unknown[],
//   queryFn: () => Promise<TData>,
//   options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
// ) => {
//   const queryClient = ServiceRouter.getQueryClient(queryKey);

//   return useQuery({
//     queryKey,
//     queryFn,
//     ...options,
//   }, queryClient);
// };

export const useSmartQuery = <TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> => {
  return useQuery({
    queryKey,
    queryFn,
     // Set default options to prevent immediate stale state
    staleTime: 2 * 60 * 1000, // 2 minutes default
    gcTime: 5 * 60 * 1000, // 5 minutes default (previously cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options, // Allow overriding defaults
  });
};

// Enhanced useMutation with smart invalidation
export const useSmartMutation = <TData, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables> & {
    invalidateKeys?: unknown[][];
    optimisticUpdate?: {
      queryKey: unknown[];
      updater: (oldData: any, variables: TVariables) => any;
    };
  }
) => {
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Handle invalidation
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          ServiceRouter.invalidateRelatedQueries(key);
        });
      }

      // Call original onSuccess
      options?.onSuccess?.(data, variables, context);
    },
    onMutate: async (variables) => {
      // Handle optimistic updates
      if (options?.optimisticUpdate) {
        const { queryKey, updater } = options.optimisticUpdate;
        const queryClient = ServiceRouter.getQueryClient(queryKey);

        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData(queryKey);

        queryClient.setQueryData(queryKey, (old: any) =>
          updater(old, variables)
        );

        return { previousData };
      }

      // Call original onMutate
      return options?.onMutate?.(variables);
    },
    onError: (error, variables, context) => {
      // Rollback optimistic updates
      if (options?.optimisticUpdate && context !== undefined) {
        const { queryKey } = options.optimisticUpdate;
        const queryClient = ServiceRouter.getQueryClient(queryKey);
        queryClient.setQueryData(queryKey, context);
      }

      // Call original onError
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// Convenience hooks for common patterns
export const useGlobalData = <TData>(
  entity: EntityType,
  action: string,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) => {
  const queryKey = [entity, action];
  return useSmartQuery(queryKey, queryFn, options);
};

export const useModuleData = <TData>(
  module: ModuleType,
  action: string,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">
) => {
  const queryKey = [module, action];
  return useSmartQuery(queryKey, queryFn, options);
};
