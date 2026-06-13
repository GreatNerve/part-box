import { GraphQLClient } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

import { getGraphqlUrl } from "@/lib/config";

export function getGraphQLClient(accessToken?: string | null): GraphQLClient {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return new GraphQLClient(getGraphqlUrl(), { headers });
}

type RequestFn = <TData, TVariables extends object>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
) => Promise<TData>;

export async function graphRequest<TData, TVariables extends object>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  accessToken?: string | null,
): Promise<TData> {
  const client = getGraphQLClient(accessToken);
  const request = client.request.bind(client) as RequestFn;
  return request(document, variables);
}
