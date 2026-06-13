import * as jspb from 'google-protobuf'

import * as v1_common_pb from '../v1/common_pb'; // proto import: "v1/common.proto"


export class BoxQuantityMessage extends jspb.Message {
  getBox(): string;
  setBox(value: string): BoxQuantityMessage;

  getQuantity(): number;
  setQuantity(value: number): BoxQuantityMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoxQuantityMessage.AsObject;
  static toObject(includeInstance: boolean, msg: BoxQuantityMessage): BoxQuantityMessage.AsObject;
  static serializeBinaryToWriter(message: BoxQuantityMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoxQuantityMessage;
  static deserializeBinaryFromReader(message: BoxQuantityMessage, reader: jspb.BinaryReader): BoxQuantityMessage;
}

export namespace BoxQuantityMessage {
  export type AsObject = {
    box: string,
    quantity: number,
  }
}

export class ComponentMessage extends jspb.Message {
  getId(): string;
  setId(value: string): ComponentMessage;

  getName(): string;
  setName(value: string): ComponentMessage;

  getCategoryId(): string;
  setCategoryId(value: string): ComponentMessage;

  getCategoryName(): string;
  setCategoryName(value: string): ComponentMessage;

  getLowStockThreshold(): number;
  setLowStockThreshold(value: number): ComponentMessage;

  getDatasheetUrl(): string;
  setDatasheetUrl(value: string): ComponentMessage;

  getTotalQty(): number;
  setTotalQty(value: number): ComponentMessage;

  getBoxQuantitiesList(): Array<BoxQuantityMessage>;
  setBoxQuantitiesList(value: Array<BoxQuantityMessage>): ComponentMessage;
  clearBoxQuantitiesList(): ComponentMessage;
  addBoxQuantities(value?: BoxQuantityMessage, index?: number): BoxQuantityMessage;

  getUpdatedAt(): string;
  setUpdatedAt(value: string): ComponentMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComponentMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ComponentMessage): ComponentMessage.AsObject;
  static serializeBinaryToWriter(message: ComponentMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComponentMessage;
  static deserializeBinaryFromReader(message: ComponentMessage, reader: jspb.BinaryReader): ComponentMessage;
}

export namespace ComponentMessage {
  export type AsObject = {
    id: string,
    name: string,
    categoryId: string,
    categoryName: string,
    lowStockThreshold: number,
    datasheetUrl: string,
    totalQty: number,
    boxQuantitiesList: Array<BoxQuantityMessage.AsObject>,
    updatedAt: string,
  }
}

export class InventoryLogMessage extends jspb.Message {
  getId(): string;
  setId(value: string): InventoryLogMessage;

  getComponentId(): string;
  setComponentId(value: string): InventoryLogMessage;

  getType(): InventoryLogType;
  setType(value: InventoryLogType): InventoryLogMessage;

  getQuantity(): number;
  setQuantity(value: number): InventoryLogMessage;

  getBox(): string;
  setBox(value: string): InventoryLogMessage;

  getFromBox(): string;
  setFromBox(value: string): InventoryLogMessage;

  getReason(): string;
  setReason(value: string): InventoryLogMessage;

  getRelatedLogId(): string;
  setRelatedLogId(value: string): InventoryLogMessage;

  getCreatedAt(): string;
  setCreatedAt(value: string): InventoryLogMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InventoryLogMessage.AsObject;
  static toObject(includeInstance: boolean, msg: InventoryLogMessage): InventoryLogMessage.AsObject;
  static serializeBinaryToWriter(message: InventoryLogMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InventoryLogMessage;
  static deserializeBinaryFromReader(message: InventoryLogMessage, reader: jspb.BinaryReader): InventoryLogMessage;
}

export namespace InventoryLogMessage {
  export type AsObject = {
    id: string,
    componentId: string,
    type: InventoryLogType,
    quantity: number,
    box: string,
    fromBox: string,
    reason: string,
    relatedLogId: string,
    createdAt: string,
  }
}

export class ListComponentsRequest extends jspb.Message {
  getSearch(): string;
  setSearch(value: string): ListComponentsRequest;

  getCategoryId(): string;
  setCategoryId(value: string): ListComponentsRequest;

  getBox(): string;
  setBox(value: string): ListComponentsRequest;

  getLimit(): number;
  setLimit(value: number): ListComponentsRequest;

  getOffset(): number;
  setOffset(value: number): ListComponentsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListComponentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListComponentsRequest): ListComponentsRequest.AsObject;
  static serializeBinaryToWriter(message: ListComponentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListComponentsRequest;
  static deserializeBinaryFromReader(message: ListComponentsRequest, reader: jspb.BinaryReader): ListComponentsRequest;
}

export namespace ListComponentsRequest {
  export type AsObject = {
    search: string,
    categoryId: string,
    box: string,
    limit: number,
    offset: number,
  }
}

export class ListComponentsResponse extends jspb.Message {
  getItemsList(): Array<ComponentMessage>;
  setItemsList(value: Array<ComponentMessage>): ListComponentsResponse;
  clearItemsList(): ListComponentsResponse;
  addItems(value?: ComponentMessage, index?: number): ComponentMessage;

  getTotalCount(): number;
  setTotalCount(value: number): ListComponentsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListComponentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListComponentsResponse): ListComponentsResponse.AsObject;
  static serializeBinaryToWriter(message: ListComponentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListComponentsResponse;
  static deserializeBinaryFromReader(message: ListComponentsResponse, reader: jspb.BinaryReader): ListComponentsResponse;
}

export namespace ListComponentsResponse {
  export type AsObject = {
    itemsList: Array<ComponentMessage.AsObject>,
    totalCount: number,
  }
}

export class BoxQuantityInput extends jspb.Message {
  getBox(): string;
  setBox(value: string): BoxQuantityInput;

  getQuantity(): number;
  setQuantity(value: number): BoxQuantityInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoxQuantityInput.AsObject;
  static toObject(includeInstance: boolean, msg: BoxQuantityInput): BoxQuantityInput.AsObject;
  static serializeBinaryToWriter(message: BoxQuantityInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoxQuantityInput;
  static deserializeBinaryFromReader(message: BoxQuantityInput, reader: jspb.BinaryReader): BoxQuantityInput;
}

export namespace BoxQuantityInput {
  export type AsObject = {
    box: string,
    quantity: number,
  }
}

export class CreateComponentRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateComponentRequest;

  getCategoryId(): string;
  setCategoryId(value: string): CreateComponentRequest;

  getDatasheetUrl(): string;
  setDatasheetUrl(value: string): CreateComponentRequest;

  getInitialBoxQuantitiesList(): Array<BoxQuantityInput>;
  setInitialBoxQuantitiesList(value: Array<BoxQuantityInput>): CreateComponentRequest;
  clearInitialBoxQuantitiesList(): CreateComponentRequest;
  addInitialBoxQuantities(value?: BoxQuantityInput, index?: number): BoxQuantityInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateComponentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateComponentRequest): CreateComponentRequest.AsObject;
  static serializeBinaryToWriter(message: CreateComponentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateComponentRequest;
  static deserializeBinaryFromReader(message: CreateComponentRequest, reader: jspb.BinaryReader): CreateComponentRequest;
}

export namespace CreateComponentRequest {
  export type AsObject = {
    name: string,
    categoryId: string,
    datasheetUrl: string,
    initialBoxQuantitiesList: Array<BoxQuantityInput.AsObject>,
  }
}

export class CreateComponentResponse extends jspb.Message {
  getComponent(): ComponentMessage | undefined;
  setComponent(value?: ComponentMessage): CreateComponentResponse;
  hasComponent(): boolean;
  clearComponent(): CreateComponentResponse;

  getError(): v1_common_pb.ValidationErrorMessage | undefined;
  setError(value?: v1_common_pb.ValidationErrorMessage): CreateComponentResponse;
  hasError(): boolean;
  clearError(): CreateComponentResponse;

  getResultCase(): CreateComponentResponse.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateComponentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateComponentResponse): CreateComponentResponse.AsObject;
  static serializeBinaryToWriter(message: CreateComponentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateComponentResponse;
  static deserializeBinaryFromReader(message: CreateComponentResponse, reader: jspb.BinaryReader): CreateComponentResponse;
}

export namespace CreateComponentResponse {
  export type AsObject = {
    component?: ComponentMessage.AsObject,
    error?: v1_common_pb.ValidationErrorMessage.AsObject,
  }

  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    COMPONENT = 1,
    ERROR = 2,
  }
}

export class UpdateComponentRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateComponentRequest;

  getName(): string;
  setName(value: string): UpdateComponentRequest;

  getCategoryId(): string;
  setCategoryId(value: string): UpdateComponentRequest;

  getDatasheetUrl(): string;
  setDatasheetUrl(value: string): UpdateComponentRequest;

  getHasName(): boolean;
  setHasName(value: boolean): UpdateComponentRequest;

  getHasCategoryId(): boolean;
  setHasCategoryId(value: boolean): UpdateComponentRequest;

  getHasDatasheetUrl(): boolean;
  setHasDatasheetUrl(value: boolean): UpdateComponentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateComponentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateComponentRequest): UpdateComponentRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateComponentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateComponentRequest;
  static deserializeBinaryFromReader(message: UpdateComponentRequest, reader: jspb.BinaryReader): UpdateComponentRequest;
}

export namespace UpdateComponentRequest {
  export type AsObject = {
    id: string,
    name: string,
    categoryId: string,
    datasheetUrl: string,
    hasName: boolean,
    hasCategoryId: boolean,
    hasDatasheetUrl: boolean,
  }
}

export class UpdateComponentResponse extends jspb.Message {
  getComponent(): ComponentMessage | undefined;
  setComponent(value?: ComponentMessage): UpdateComponentResponse;
  hasComponent(): boolean;
  clearComponent(): UpdateComponentResponse;

  getError(): v1_common_pb.ValidationErrorMessage | undefined;
  setError(value?: v1_common_pb.ValidationErrorMessage): UpdateComponentResponse;
  hasError(): boolean;
  clearError(): UpdateComponentResponse;

  getResultCase(): UpdateComponentResponse.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateComponentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateComponentResponse): UpdateComponentResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateComponentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateComponentResponse;
  static deserializeBinaryFromReader(message: UpdateComponentResponse, reader: jspb.BinaryReader): UpdateComponentResponse;
}

export namespace UpdateComponentResponse {
  export type AsObject = {
    component?: ComponentMessage.AsObject,
    error?: v1_common_pb.ValidationErrorMessage.AsObject,
  }

  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    COMPONENT = 1,
    ERROR = 2,
  }
}

export class ApplyInventoryLogRequest extends jspb.Message {
  getComponentId(): string;
  setComponentId(value: string): ApplyInventoryLogRequest;

  getType(): InventoryLogType;
  setType(value: InventoryLogType): ApplyInventoryLogRequest;

  getQuantity(): number;
  setQuantity(value: number): ApplyInventoryLogRequest;

  getBox(): string;
  setBox(value: string): ApplyInventoryLogRequest;

  getFromBox(): string;
  setFromBox(value: string): ApplyInventoryLogRequest;

  getReason(): string;
  setReason(value: string): ApplyInventoryLogRequest;

  getRelatedLogId(): string;
  setRelatedLogId(value: string): ApplyInventoryLogRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyInventoryLogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyInventoryLogRequest): ApplyInventoryLogRequest.AsObject;
  static serializeBinaryToWriter(message: ApplyInventoryLogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyInventoryLogRequest;
  static deserializeBinaryFromReader(message: ApplyInventoryLogRequest, reader: jspb.BinaryReader): ApplyInventoryLogRequest;
}

export namespace ApplyInventoryLogRequest {
  export type AsObject = {
    componentId: string,
    type: InventoryLogType,
    quantity: number,
    box: string,
    fromBox: string,
    reason: string,
    relatedLogId: string,
  }
}

export class ApplyInventoryLogSuccess extends jspb.Message {
  getLog(): InventoryLogMessage | undefined;
  setLog(value?: InventoryLogMessage): ApplyInventoryLogSuccess;
  hasLog(): boolean;
  clearLog(): ApplyInventoryLogSuccess;

  getComponent(): ComponentMessage | undefined;
  setComponent(value?: ComponentMessage): ApplyInventoryLogSuccess;
  hasComponent(): boolean;
  clearComponent(): ApplyInventoryLogSuccess;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyInventoryLogSuccess.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyInventoryLogSuccess): ApplyInventoryLogSuccess.AsObject;
  static serializeBinaryToWriter(message: ApplyInventoryLogSuccess, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyInventoryLogSuccess;
  static deserializeBinaryFromReader(message: ApplyInventoryLogSuccess, reader: jspb.BinaryReader): ApplyInventoryLogSuccess;
}

export namespace ApplyInventoryLogSuccess {
  export type AsObject = {
    log?: InventoryLogMessage.AsObject,
    component?: ComponentMessage.AsObject,
  }
}

export class ApplyInventoryLogResponse extends jspb.Message {
  getSuccess(): ApplyInventoryLogSuccess | undefined;
  setSuccess(value?: ApplyInventoryLogSuccess): ApplyInventoryLogResponse;
  hasSuccess(): boolean;
  clearSuccess(): ApplyInventoryLogResponse;

  getError(): v1_common_pb.ValidationErrorMessage | undefined;
  setError(value?: v1_common_pb.ValidationErrorMessage): ApplyInventoryLogResponse;
  hasError(): boolean;
  clearError(): ApplyInventoryLogResponse;

  getResultCase(): ApplyInventoryLogResponse.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApplyInventoryLogResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ApplyInventoryLogResponse): ApplyInventoryLogResponse.AsObject;
  static serializeBinaryToWriter(message: ApplyInventoryLogResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApplyInventoryLogResponse;
  static deserializeBinaryFromReader(message: ApplyInventoryLogResponse, reader: jspb.BinaryReader): ApplyInventoryLogResponse;
}

export namespace ApplyInventoryLogResponse {
  export type AsObject = {
    success?: ApplyInventoryLogSuccess.AsObject,
    error?: v1_common_pb.ValidationErrorMessage.AsObject,
  }

  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    SUCCESS = 1,
    ERROR = 2,
  }
}

export enum InventoryLogType { 
  INVENTORY_LOG_TYPE_UNSPECIFIED = 0,
  ADD_STOCK = 1,
  USE = 2,
  RETURN = 3,
  LOST = 4,
  BURN = 5,
  DEFECTIVE = 6,
  REALLOCATE = 7,
}
