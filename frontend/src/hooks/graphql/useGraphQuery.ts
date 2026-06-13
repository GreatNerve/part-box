"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useSession } from "next-auth/react";

import { graphRequest } from "@/lib/graphql/client";

type UseGraphQueryOptions<TData, TVariables> = {
  queryKey: unknown[];
  document: TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
  enabled?: boolean;
} & Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">;

export function useGraphQuery<TData, TVariables extends object>(
  options: UseGraphQueryOptions<TData, TVariables>,
) {
  const { data: session, status } = useSession();
  const { queryKey, document, variables, enabled = true, ...rest } = options;

  return useQuery({
    ...rest,
    queryKey: [...queryKey, session?.accessToken],
    enabled: enabled && status === "authenticated" && !!session?.accessToken,
    queryFn: async () => graphRequest(document, variables, session?.accessToken),
  });
}
