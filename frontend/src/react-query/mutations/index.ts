import {
  grpcApplyInventoryLog,
  grpcCreateCategory,
  grpcCreateComponent,
  grpcUpdateCategory,
  grpcUpdateComponent,
} from "@/lib/grpc/mutations";
import type { InventoryLogType } from "@/lib/graphql/documents";
import { useGrpcMutation } from "@/hooks/grpc/useGrpcMutation";

export function useCreateCategoryMutation() {
  return useGrpcMutation({
    mutationFn: (variables: { input: { name: string; lowStockThreshold?: number } }, token) =>
      grpcCreateCategory(variables.input, token),
  });
}

export function useUpdateCategoryMutation() {
  return useGrpcMutation({
    mutationFn: (
      variables: {
        input: {
          id: string;
          name?: string | null;
          lowStockThreshold?: number | null;
        };
      },
      token,
    ) => grpcUpdateCategory(variables.input, token),
  });
}

export function useCreateComponentMutation() {
  return useGrpcMutation({
    mutationFn: (
      variables: {
        input: {
          name: string;
          categoryId: string;
          datasheetUrl?: string | null;
          initialBoxQuantities?: { box: string; quantity: number }[] | null;
        };
      },
      token,
    ) => grpcCreateComponent(variables.input, token),
  });
}

export function useUpdateComponentMutation() {
  return useGrpcMutation({
    mutationFn: (
      variables: {
        input: {
          id: string;
          name?: string | null;
          categoryId?: string | null;
          datasheetUrl?: string | null;
        };
      },
      token,
    ) => grpcUpdateComponent(variables.input, token),
  });
}

export function useApplyInventoryLogMutation() {
  return useGrpcMutation({
    mutationFn: (
      variables: {
        input: {
          componentId: string;
          type: InventoryLogType;
          quantity: number;
          box: string;
          fromBox?: string | null;
          reason?: string | null;
          relatedLogId?: string | null;
        };
      },
      token,
    ) => grpcApplyInventoryLog(variables.input, token),
  });
}
