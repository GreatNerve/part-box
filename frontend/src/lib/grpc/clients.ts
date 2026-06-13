import { getGrpcWebUrl } from "@/lib/config";
import { AuthServiceClient } from "@/lib/grpc/gen/v1/AuthServiceClientPb";
import { CategoryServiceClient } from "@/lib/grpc/gen/v1/CategoryServiceClientPb";
import { InventoryServiceClient } from "@/lib/grpc/gen/v1/InventoryServiceClientPb";

let authClient: AuthServiceClient | null = null;
let categoryClient: CategoryServiceClient | null = null;
let inventoryClient: InventoryServiceClient | null = null;

function grpcWebHost(): string {
  return getGrpcWebUrl();
}

export function getAuthClient(): AuthServiceClient {
  if (!authClient) {
    authClient = new AuthServiceClient(grpcWebHost(), null, null);
  }
  return authClient;
}

export function getCategoryClient(): CategoryServiceClient {
  if (!categoryClient) {
    categoryClient = new CategoryServiceClient(grpcWebHost(), null, null);
  }
  return categoryClient;
}

export function getInventoryClient(): InventoryServiceClient {
  if (!inventoryClient) {
    inventoryClient = new InventoryServiceClient(grpcWebHost(), null, null);
  }
  return inventoryClient;
}

export function authMetadata(accessToken?: string | null): { authorization: string } | null {
  if (!accessToken) {
    return null;
  }
  return { authorization: `Bearer ${accessToken}` };
}
