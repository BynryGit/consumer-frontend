import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { globalQueryClient, moduleQueryClients } from "../queries/queryClients";

// Global Query Provider (wraps entire app)
export const GlobalQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={globalQueryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

// Module-specific providers (used within specific modules)
export const ModuleQueryProvider: React.FC<{
  module: keyof typeof moduleQueryClients;
  children: React.ReactNode;
}> = ({ module, children }) => {
  const moduleClient = moduleQueryClients[module];

  if (!moduleClient) {
    console.warn(`No query client found for module: ${module}`);
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={moduleClient}>{children}</QueryClientProvider>
  );
};
