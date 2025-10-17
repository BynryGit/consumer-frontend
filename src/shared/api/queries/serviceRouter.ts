import { QueryClient } from "@tanstack/react-query";
import {
  QueryKeyFactory,
  EntityType,
  ModuleType,
} from "../queries/queryKeyFactory";
import { globalQueryClient, moduleQueryClients } from "./queryClients";

export class ServiceRouter {
  // Determine which query client to use based on query key
  static getQueryClient(queryKey: unknown[]): QueryClient {
    // Check if it's a global key (shared across modules)
    if (QueryKeyFactory.isGlobalKey(queryKey)) {
      return globalQueryClient;
    }

    // Check if it's a module-specific key
    const module = QueryKeyFactory.getModuleFromKey(queryKey);
    if (module && moduleQueryClients[module]) {
      return moduleQueryClients[module];
    }

    // Default to global client
    return globalQueryClient;
  }

  // Determine which API service to use
  static getServiceType(queryKey: unknown[]): string {
    const entity = QueryKeyFactory.getEntityFromKey(queryKey);
    const module = QueryKeyFactory.getModuleFromKey(queryKey);

    // Module-specific routing
    if (module) {
      return module;
    }

    // Entity-based routing for global data
    switch (entity) {
      case "user":
      case "organization":
        return "auth";
      case "meter":
      case "consumer":
        return "mx";
      case "workorder":
        return "wx";
      case "billing":
        return "bx";
      case "utility":
        return "onboarding";
      default:
        return "auth"; // fallback
    }
  }

  // Smart invalidation - invalidate related queries across modules
  // static invalidateRelatedQueries(queryKey: unknown[], sourceModule?: string) {
  //   const entity = QueryKeyFactory.getEntityFromKey(queryKey);

  //   // If it's global data, invalidate across all relevant modules
  //   if (QueryKeyFactory.isGlobalKey(queryKey)) {
  //     // Invalidate in global client
  //     globalQueryClient.invalidateQueries({ queryKey });

  //     // Also invalidate in module clients that might have cached this data
  //     Object.values(moduleQueryClients).forEach(client => {
  //       client.invalidateQueries({ queryKey });
  //     });
  //   } else {
  //     // Module-specific invalidation
  //     const module = QueryKeyFactory.getModuleFromKey(queryKey);
  //     if (module && moduleQueryClients[module]) {
  //       moduleQueryClients[module].invalidateQueries({ queryKey });
  //     }
  //   }

  //   // Handle cross-module dependencies
  //   this.handleCrossModuleDependencies(entity, queryKey);
  // }
  static invalidateRelatedQueries(queryKey: unknown[], sourceModule?: string) {
    const entity = QueryKeyFactory.getEntityFromKey(queryKey);

    const matchByPrefix = (targetKey: readonly unknown[]) =>
      targetKey.length >= queryKey.length &&
      queryKey.every(
        (keyPart, i) => JSON.stringify(keyPart) === JSON.stringify(targetKey[i])
      );

    if (QueryKeyFactory.isGlobalKey(queryKey)) {
      globalQueryClient.invalidateQueries({
        predicate: (query) => matchByPrefix(query.queryKey),
      });

      Object.values(moduleQueryClients).forEach((client) => {
        client.invalidateQueries({
          predicate: (query) => matchByPrefix(query.queryKey),
        });
      });
    } else {
      const module = QueryKeyFactory.getModuleFromKey(queryKey);

      if (module && moduleQueryClients[module]) {
        moduleQueryClients[module].invalidateQueries({
          predicate: (query) => matchByPrefix(query.queryKey),
        });
      }
    }

    this.handleCrossModuleDependencies(entity, queryKey);
  }

  private static handleCrossModuleDependencies(
    entity: EntityType | null,
    queryKey: unknown[]
  ) {
    switch (entity) {
      case "user":
        // User changes affect onboarding, all other modules
        moduleQueryClients.onboarding?.invalidateQueries({
          predicate: (query) => query.queryKey.includes("user"),
        });
        break;

      case "meter":
        // Meter changes affect CX, BX modules
        moduleQueryClients.cx?.invalidateQueries({
          predicate: (query) => query.queryKey.includes("meter"),
        });
        moduleQueryClients.bx?.invalidateQueries({
          predicate: (query) => query.queryKey.includes("meter"),
        });
        break;

      case "workorder":
        // Workorder changes affect CX module
        moduleQueryClients.cx?.invalidateQueries({
          predicate: (query) => query.queryKey.includes("workorder"),
        });
        break;
    }
  }
}
