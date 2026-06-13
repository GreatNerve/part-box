export function getGraphqlUrl(): string {
  // Server-side (SSR, NextAuth): internal Docker network URL when set
  if (typeof window === "undefined" && process.env.GRAPHQL_URL) {
    return process.env.GRAPHQL_URL;
  }

  return process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://127.0.0.1:8000/graphql";
}

/** Browser or server → Envoy gRPC-Web proxy */
export function getGrpcWebUrl(): string {
  if (typeof window === "undefined" && process.env.GRPC_WEB_URL) {
    return process.env.GRPC_WEB_URL;
  }

  return process.env.NEXT_PUBLIC_GRPC_WEB_URL ?? "http://127.0.0.1:8080";
}

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}
