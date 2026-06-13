import type { InventoryLogType } from "@/lib/graphql/documents";
import {
  CATEGORIES_QUERY,
  COMPONENTS_QUERY,
  COMPONENT_LOGS_QUERY,
  COMPONENT_QUERY,
  INVENTORY_LOGS_QUERY,
  ME_QUERY,
} from "@/lib/graphql/documents";
import { useGraphQuery } from "@/hooks/graphql/useGraphQuery";

export function useMeQuery() {
  return useGraphQuery({
    queryKey: ["me"],
    document: ME_QUERY,
  });
}

export function useCategoriesQuery(enabled = true) {
  return useGraphQuery({
    queryKey: ["categories"],
    document: CATEGORIES_QUERY,
    enabled,
  });
}

export function useComponentsQuery(params?: {
  search?: string;
  categoryId?: string;
  box?: string;
  limit?: number;
  offset?: number;
}) {
  return useGraphQuery({
    queryKey: ["components", params ?? {}],
    document: COMPONENTS_QUERY,
    variables: {
      filter: {
        search: params?.search ?? null,
        categoryId: params?.categoryId ?? null,
        box: params?.box ?? null,
      },
      pagination: {
        limit: params?.limit ?? 20,
        offset: params?.offset ?? 0,
      },
    },
  });
}

export function useComponentQuery(id: string, enabled = true) {
  return useGraphQuery({
    queryKey: ["component", id],
    document: COMPONENT_QUERY,
    variables: { id },
    enabled: !!id && enabled,
  });
}

export function useComponentLogsQuery(
  componentId: string,
  pagination?: { limit?: number; offset?: number },
) {
  return useGraphQuery({
    queryKey: ["componentLogs", componentId, pagination ?? {}],
    document: COMPONENT_LOGS_QUERY,
    variables: {
      componentId,
      pagination: pagination ?? { limit: 20, offset: 0 },
    },
    enabled: !!componentId,
  });
}

export function useInventoryLogsQuery(params?: {
  search?: string;
  type?: InventoryLogType;
  box?: string;
  componentId?: string;
  limit?: number;
  offset?: number;
}) {
  return useGraphQuery({
    queryKey: ["inventoryLogs", params ?? {}],
    document: INVENTORY_LOGS_QUERY,
    variables: {
      filter: {
        search: params?.search ?? null,
        type: params?.type ?? null,
        box: params?.box ?? null,
        componentId: params?.componentId ?? null,
      },
      pagination: {
        limit: params?.limit ?? 30,
        offset: params?.offset ?? 0,
      },
    },
  });
}
