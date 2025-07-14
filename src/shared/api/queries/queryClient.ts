import { QueryClient } from '@tanstack/react-query';

// Create a client with default settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
}); 