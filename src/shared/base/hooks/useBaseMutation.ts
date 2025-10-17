import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export interface UseBaseMutationOptions<TData, TError, TVariables> extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useBaseMutation<TData, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseBaseMutationOptions<TData, TError, TVariables> = {}
) {
  const {
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = 'Operation completed successfully',
    ...mutationOptions
  } = options;

  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...mutationOptions,
  });
} 