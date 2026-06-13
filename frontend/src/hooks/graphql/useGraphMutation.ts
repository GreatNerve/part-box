"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useSession } from "next-auth/react";

import { graphRequest } from "@/lib/graphql/client";

type UseGraphMutationOptions<TData, TVariables> = {
  document: TypedDocumentNode<TData, TVariables>;
} & Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">;

export function useGraphMutation<TData, TVariables extends object>(
  options: UseGraphMutationOptions<TData, TVariables>,
) {
  const { data: session } = useSession();
  const { document, ...rest } = options;

  return useMutation({
    ...rest,
    mutationFn: async (variables: TVariables) =>
      graphRequest(document, variables, session?.accessToken),
  });
}
