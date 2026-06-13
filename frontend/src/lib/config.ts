export function getGraphqlUrl(): string {
  return process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://127.0.0.1:8000/graphql";
}

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}
