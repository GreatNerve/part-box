import {
  ApplyInventoryLogRequest,
  BoxQuantityInput,
  CreateComponentRequest,
  InventoryLogType as InventoryLogTypeProto,
  UpdateComponentRequest,
} from "@/lib/grpc/gen/v1/inventory_pb";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/grpc/gen/v1/category_pb";
import { RegisterRequest, LoginRequest } from "@/lib/grpc/gen/v1/auth_pb";
import {
  authMetadata,
  getAuthClient,
  getCategoryClient,
  getInventoryClient,
} from "@/lib/grpc/clients";
import {
  inventoryLogTypeToProto,
  mapCategory,
  mapComponent,
  mapInventoryLog,
  mapValidationError,
} from "@/lib/grpc/mappers";
import type {
  Category,
  Component,
  InventoryLogType,
  ValidationErrorPayload,
} from "@/lib/graphql/documents";

export async function grpcRegister(input: {
  email: string;
  password: string;
  displayName?: string | null;
}) {
  const request = new RegisterRequest();
  request.setEmail(input.email);
  request.setPassword(input.password);
  request.setDisplayName(input.displayName ?? "");

  const response = await getAuthClient().register(request, null);
  return {
    token: response.getToken(),
    user: {
      id: response.getUser()?.getId() ?? "",
      email: response.getUser()?.getEmail() ?? "",
      displayName: response.getUser()?.getDisplayName() || null,
    },
  };
}

export async function grpcLogin(input: { email: string; password: string }) {
  const request = new LoginRequest();
  request.setEmail(input.email);
  request.setPassword(input.password);

  const response = await getAuthClient().login(request, null);
  return {
    token: response.getToken(),
    user: {
      id: response.getUser()?.getId() ?? "",
      email: response.getUser()?.getEmail() ?? "",
      displayName: response.getUser()?.getDisplayName() || null,
    },
  };
}

export async function grpcCreateCategory(
  input: { name: string; lowStockThreshold?: number },
  accessToken?: string | null,
): Promise<{ createCategory: Category | ValidationErrorPayload }> {
  const request = new CreateCategoryRequest();
  request.setName(input.name);
  request.setLowStockThreshold(input.lowStockThreshold ?? 5);

  const response = await getCategoryClient().createCategory(
    request,
    authMetadata(accessToken),
  );

  if (response.hasError() && response.getError()) {
    return { createCategory: mapValidationError(response.getError()!) };
  }

  const category = response.getCategory();
  if (!category) {
    throw new Error("Empty create category response.");
  }

  return { createCategory: mapCategory(category) };
}

export async function grpcUpdateCategory(
  input: {
    id: string;
    name?: string | null;
    lowStockThreshold?: number | null;
  },
  accessToken?: string | null,
): Promise<{ updateCategory: Category | ValidationErrorPayload }> {
  const request = new UpdateCategoryRequest();
  request.setId(input.id);

  if (input.name !== undefined && input.name !== null) {
    request.setName(input.name);
    request.setHasName(true);
  }

  if (input.lowStockThreshold !== undefined && input.lowStockThreshold !== null) {
    request.setLowStockThreshold(input.lowStockThreshold);
    request.setHasLowStockThreshold(true);
  }

  const response = await getCategoryClient().updateCategory(
    request,
    authMetadata(accessToken),
  );

  if (response.hasError() && response.getError()) {
    return { updateCategory: mapValidationError(response.getError()!) };
  }

  const category = response.getCategory();
  if (!category) {
    throw new Error("Empty update category response.");
  }

  return { updateCategory: mapCategory(category) };
}

export async function grpcCreateComponent(
  input: {
    name: string;
    categoryId: string;
    datasheetUrl?: string | null;
    initialBoxQuantities?: { box: string; quantity: number }[] | null;
  },
  accessToken?: string | null,
): Promise<{ createComponent: Component | ValidationErrorPayload }> {
  const request = new CreateComponentRequest();
  request.setName(input.name);
  request.setCategoryId(input.categoryId);
  request.setDatasheetUrl(input.datasheetUrl ?? "");

  for (const row of input.initialBoxQuantities ?? []) {
    const boxQuantity = new BoxQuantityInput();
    boxQuantity.setBox(row.box);
    boxQuantity.setQuantity(row.quantity);
    request.addInitialBoxQuantities(boxQuantity);
  }

  const response = await getInventoryClient().createComponent(
    request,
    authMetadata(accessToken),
  );

  if (response.hasError() && response.getError()) {
    return { createComponent: mapValidationError(response.getError()!) };
  }

  const component = response.getComponent();
  if (!component) {
    throw new Error("Empty create component response.");
  }

  return { createComponent: mapComponent(component) };
}

export async function grpcUpdateComponent(
  input: {
    id: string;
    name?: string | null;
    categoryId?: string | null;
    datasheetUrl?: string | null;
  },
  accessToken?: string | null,
): Promise<{ updateComponent: Component | ValidationErrorPayload }> {
  const request = new UpdateComponentRequest();
  request.setId(input.id);

  if (input.name !== undefined && input.name !== null) {
    request.setName(input.name);
    request.setHasName(true);
  }

  if (input.categoryId !== undefined && input.categoryId !== null) {
    request.setCategoryId(input.categoryId);
    request.setHasCategoryId(true);
  }

  if (input.datasheetUrl !== undefined && input.datasheetUrl !== null) {
    request.setDatasheetUrl(input.datasheetUrl);
    request.setHasDatasheetUrl(true);
  }

  const response = await getInventoryClient().updateComponent(
    request,
    authMetadata(accessToken),
  );

  if (response.hasError() && response.getError()) {
    return { updateComponent: mapValidationError(response.getError()!) };
  }

  const component = response.getComponent();
  if (!component) {
    throw new Error("Empty update component response.");
  }

  return { updateComponent: mapComponent(component) };
}

export async function grpcApplyInventoryLog(
  input: {
    componentId: string;
    type: InventoryLogType;
    quantity: number;
    box: string;
    fromBox?: string | null;
    reason?: string | null;
    relatedLogId?: string | null;
  },
  accessToken?: string | null,
): Promise<{
  applyInventoryLog:
    | { log: ReturnType<typeof mapInventoryLog>; component: Component }
    | ValidationErrorPayload;
}> {
  const request = new ApplyInventoryLogRequest();
  request.setComponentId(input.componentId);
  request.setType(inventoryLogTypeToProto(input.type) as InventoryLogTypeProto);
  request.setQuantity(input.quantity);
  request.setBox(input.box);
  request.setFromBox(input.fromBox ?? "");
  request.setReason(input.reason ?? "");
  request.setRelatedLogId(input.relatedLogId ?? "");

  const response = await getInventoryClient().applyInventoryLog(
    request,
    authMetadata(accessToken),
  );

  if (response.hasError() && response.getError()) {
    return { applyInventoryLog: mapValidationError(response.getError()!) };
  }

  const success = response.getSuccess();
  if (!success?.getLog() || !success.getComponent()) {
    throw new Error("Empty apply inventory log response.");
  }

  return {
    applyInventoryLog: {
      log: mapInventoryLog(success.getLog()!),
      component: mapComponent(success.getComponent()!),
    },
  };
}
