import { QueryClient } from "@tanstack/react-query";

// Global query client for shared data
export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes for shared data
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Module-specific query clients with different configurations
export const moduleQueryClients = {
  auth: new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000, // 15 minutes - auth data changes less
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }),

  cx: new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes - CX data changes frequently
        retry: 3,
        refetchOnWindowFocus: true,
        refetchInterval: 30000, // Auto-refresh every 30 seconds
      },
    },
  }),

  onboarding: new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }),

  notification: new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds - real-time data
        retry: 5,
        refetchOnWindowFocus: true,
        refetchInterval: 10000, // Auto-refresh every 10 seconds
      },
    },
  }),

  // Other modules with standard config
  bx: new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }),

  // Add other modules as needed
};
