import type { RpcError } from "grpc-web";

import type {
  Category,
  Component,
  InventoryLog,
  InventoryLogType,
  ValidationErrorPayload,
} from "@/lib/graphql/documents";
import type { ValidationErrorMessage } from "@/lib/grpc/gen/v1/common_pb";

export function mapValidationError(error: ValidationErrorMessage): ValidationErrorPayload {
  return {
    code: error.getCode(),
    message: error.getMessage(),
    fieldErrors: error.getFieldErrorsList().map((item) => ({
      field: item.getField(),
      message: item.getMessage(),
    })),
  };
}

export function mapCategory(category: {
  getId(): string;
  getName(): string;
  getIsDefault(): boolean;
  getLowStockThreshold(): number;
}): Category {
  return {
    id: category.getId(),
    name: category.getName(),
    isDefault: category.getIsDefault(),
    lowStockThreshold: category.getLowStockThreshold(),
  };
}

export function mapComponent(component: {
  getId(): string;
  getName(): string;
  getCategoryId(): string;
  getCategoryName(): string;
  getLowStockThreshold(): number;
  getDatasheetUrl(): string;
  getTotalQty(): number;
  getUpdatedAt(): string;
  getBoxQuantitiesList(): Array<{ getBox(): string; getQuantity(): number }>;
}): Component {
  return {
    id: component.getId(),
    name: component.getName(),
    categoryId: component.getCategoryId(),
    categoryName: component.getCategoryName(),
    lowStockThreshold: component.getLowStockThreshold(),
    datasheetUrl: component.getDatasheetUrl() || null,
    totalQty: component.getTotalQty(),
    updatedAt: component.getUpdatedAt(),
    boxQuantities: component.getBoxQuantitiesList().map((row) => ({
      box: row.getBox(),
      quantity: row.getQuantity(),
    })),
  };
}

export function mapInventoryLog(log: {
  getId(): string;
  getComponentId(): string;
  getType(): number;
  getQuantity(): number;
  getBox(): string;
  getFromBox(): string;
  getReason(): string;
  getRelatedLogId(): string;
  getCreatedAt(): string;
}): InventoryLog {
  return {
    id: log.getId(),
    componentId: log.getComponentId(),
    type: inventoryLogTypeFromProto(log.getType()),
    quantity: log.getQuantity(),
    box: log.getBox(),
    fromBox: log.getFromBox() || null,
    reason: log.getReason() || null,
    relatedLogId: log.getRelatedLogId() || null,
    createdAt: log.getCreatedAt(),
  };
}

const PROTO_TO_LOG_TYPE: Record<number, InventoryLogType> = {
  1: "ADD_STOCK",
  2: "USE",
  3: "RETURN",
  4: "LOST",
  5: "BURN",
  6: "DEFECTIVE",
  7: "REALLOCATE",
};

const LOG_TYPE_TO_PROTO: Record<InventoryLogType, number> = {
  ADD_STOCK: 1,
  USE: 2,
  RETURN: 3,
  LOST: 4,
  BURN: 5,
  DEFECTIVE: 6,
  REALLOCATE: 7,
};

export function inventoryLogTypeToProto(type: InventoryLogType): number {
  return LOG_TYPE_TO_PROTO[type];
}

export function inventoryLogTypeFromProto(type: number): InventoryLogType {
  return PROTO_TO_LOG_TYPE[type] ?? "ADD_STOCK";
}

export function getGrpcErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = Number((error as RpcError).code);
    if (code === 16) {
      // grpc.status.UNAUTHENTICATED
      return "Invalid email or password.";
    }
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as RpcError).message);
    if (message.includes("upstream connect error") || message.includes("no healthy upstream")) {
      return "Auth service is unavailable. Start gRPC (uv run inventory-grpc) and Envoy on :8080.";
    }
    return message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
