import * as jspb from 'google-protobuf'

import * as v1_common_pb from '../v1/common_pb'; // proto import: "v1/common.proto"


export class CategoryMessage extends jspb.Message {
  getId(): string;
  setId(value: string): CategoryMessage;

  getName(): string;
  setName(value: string): CategoryMessage;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): CategoryMessage;

  getLowStockThreshold(): number;
  setLowStockThreshold(value: number): CategoryMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CategoryMessage.AsObject;
  static toObject(includeInstance: boolean, msg: CategoryMessage): CategoryMessage.AsObject;
  static serializeBinaryToWriter(message: CategoryMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CategoryMessage;
  static deserializeBinaryFromReader(message: CategoryMessage, reader: jspb.BinaryReader): CategoryMessage;
}

export namespace CategoryMessage {
  export type AsObject = {
    id: string,
    name: string,
    isDefault: boolean,
    lowStockThreshold: number,
  }
}

export class CreateCategoryRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateCategoryRequest;

  getLowStockThreshold(): number;
  setLowStockThreshold(value: number): CreateCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCategoryRequest): CreateCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: CreateCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCategoryRequest;
  static deserializeBinaryFromReader(message: CreateCategoryRequest, reader: jspb.BinaryReader): CreateCategoryRequest;
}

export namespace CreateCategoryRequest {
  export type AsObject = {
    name: string,
    lowStockThreshold: number,
  }
}

export class CreateCategoryResponse extends jspb.Message {
  getCategory(): CategoryMessage | undefined;
  setCategory(value?: CategoryMessage): CreateCategoryResponse;
  hasCategory(): boolean;
  clearCategory(): CreateCategoryResponse;

  getError(): v1_common_pb.ValidationErrorMessage | undefined;
  setError(value?: v1_common_pb.ValidationErrorMessage): CreateCategoryResponse;
  hasError(): boolean;
  clearError(): CreateCategoryResponse;

  getResultCase(): CreateCategoryResponse.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCategoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCategoryResponse): CreateCategoryResponse.AsObject;
  static serializeBinaryToWriter(message: CreateCategoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCategoryResponse;
  static deserializeBinaryFromReader(message: CreateCategoryResponse, reader: jspb.BinaryReader): CreateCategoryResponse;
}

export namespace CreateCategoryResponse {
  export type AsObject = {
    category?: CategoryMessage.AsObject,
    error?: v1_common_pb.ValidationErrorMessage.AsObject,
  }

  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    CATEGORY = 1,
    ERROR = 2,
  }
}

export class UpdateCategoryRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateCategoryRequest;

  getName(): string;
  setName(value: string): UpdateCategoryRequest;

  getLowStockThreshold(): number;
  setLowStockThreshold(value: number): UpdateCategoryRequest;

  getHasName(): boolean;
  setHasName(value: boolean): UpdateCategoryRequest;

  getHasLowStockThreshold(): boolean;
  setHasLowStockThreshold(value: boolean): UpdateCategoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCategoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCategoryRequest): UpdateCategoryRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateCategoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCategoryRequest;
  static deserializeBinaryFromReader(message: UpdateCategoryRequest, reader: jspb.BinaryReader): UpdateCategoryRequest;
}

export namespace UpdateCategoryRequest {
  export type AsObject = {
    id: string,
    name: string,
    lowStockThreshold: number,
    hasName: boolean,
    hasLowStockThreshold: boolean,
  }
}

export class UpdateCategoryResponse extends jspb.Message {
  getCategory(): CategoryMessage | undefined;
  setCategory(value?: CategoryMessage): UpdateCategoryResponse;
  hasCategory(): boolean;
  clearCategory(): UpdateCategoryResponse;

  getError(): v1_common_pb.ValidationErrorMessage | undefined;
  setError(value?: v1_common_pb.ValidationErrorMessage): UpdateCategoryResponse;
  hasError(): boolean;
  clearError(): UpdateCategoryResponse;

  getResultCase(): UpdateCategoryResponse.ResultCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateCategoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateCategoryResponse): UpdateCategoryResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateCategoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateCategoryResponse;
  static deserializeBinaryFromReader(message: UpdateCategoryResponse, reader: jspb.BinaryReader): UpdateCategoryResponse;
}

export namespace UpdateCategoryResponse {
  export type AsObject = {
    category?: CategoryMessage.AsObject,
    error?: v1_common_pb.ValidationErrorMessage.AsObject,
  }

  export enum ResultCase { 
    RESULT_NOT_SET = 0,
    CATEGORY = 1,
    ERROR = 2,
  }
}

