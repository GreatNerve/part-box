import * as jspb from 'google-protobuf'



export class FieldErrorMessage extends jspb.Message {
  getField(): string;
  setField(value: string): FieldErrorMessage;

  getMessage(): string;
  setMessage(value: string): FieldErrorMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldErrorMessage.AsObject;
  static toObject(includeInstance: boolean, msg: FieldErrorMessage): FieldErrorMessage.AsObject;
  static serializeBinaryToWriter(message: FieldErrorMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldErrorMessage;
  static deserializeBinaryFromReader(message: FieldErrorMessage, reader: jspb.BinaryReader): FieldErrorMessage;
}

export namespace FieldErrorMessage {
  export type AsObject = {
    field: string,
    message: string,
  }
}

export class ValidationErrorMessage extends jspb.Message {
  getCode(): string;
  setCode(value: string): ValidationErrorMessage;

  getMessage(): string;
  setMessage(value: string): ValidationErrorMessage;

  getFieldErrorsList(): Array<FieldErrorMessage>;
  setFieldErrorsList(value: Array<FieldErrorMessage>): ValidationErrorMessage;
  clearFieldErrorsList(): ValidationErrorMessage;
  addFieldErrors(value?: FieldErrorMessage, index?: number): FieldErrorMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationErrorMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationErrorMessage): ValidationErrorMessage.AsObject;
  static serializeBinaryToWriter(message: ValidationErrorMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationErrorMessage;
  static deserializeBinaryFromReader(message: ValidationErrorMessage, reader: jspb.BinaryReader): ValidationErrorMessage;
}

export namespace ValidationErrorMessage {
  export type AsObject = {
    code: string,
    message: string,
    fieldErrorsList: Array<FieldErrorMessage.AsObject>,
  }
}

