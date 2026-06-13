import {
  APPLY_INVENTORY_LOG_MUTATION,
  CREATE_CATEGORY_MUTATION,
  CREATE_COMPONENT_MUTATION,
  UPDATE_CATEGORY_MUTATION,
  UPDATE_COMPONENT_MUTATION,
} from "@/lib/graphql/documents";
import { useGraphMutation } from "@/hooks/graphql/useGraphMutation";

export function useCreateCategoryMutation() {
  return useGraphMutation({
    document: CREATE_CATEGORY_MUTATION,
  });
}

export function useUpdateCategoryMutation() {
  return useGraphMutation({
    document: UPDATE_CATEGORY_MUTATION,
  });
}

export function useCreateComponentMutation() {
  return useGraphMutation({
    document: CREATE_COMPONENT_MUTATION,
  });
}

export function useUpdateComponentMutation() {
  return useGraphMutation({
    document: UPDATE_COMPONENT_MUTATION,
  });
}

export function useApplyInventoryLogMutation() {
  return useGraphMutation({
    document: APPLY_INVENTORY_LOG_MUTATION,
  });
}
