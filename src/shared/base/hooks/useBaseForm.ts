import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

export function useBaseForm({
  initialValues,
  mutationFn,
  mutationOptions = {},
  validateFieldValue = (name, value) => (!value ? `${String(name)} is required` : undefined),
  onSuccess,
  onError,
  resolver,
}) {
  // Use react-hook-form for form state
  const form = useForm({
    defaultValues: initialValues,
    resolver,
  });

  // Custom mutation logic
  const mutation = useMutation({
    mutationFn,
    ...mutationOptions,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  // Custom validation logic (optional, for manual validation)
  function validateField(name, value) {
    return validateFieldValue(name, value);
  }

  // Custom submit handler that runs mutation
  function handleBaseSubmit(onValid, onInvalid) {
    return form.handleSubmit(async (values) => {
      // Optionally run custom validation here
      // If valid, run mutation
      mutation.mutate(values);
      if (onValid) onValid(values);
    }, onInvalid);
  }

  return {
    ...form,
    mutation,
    validateField,
    handleBaseSubmit,
  };
} 