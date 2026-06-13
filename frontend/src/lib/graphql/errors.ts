export type ValidationErrorPayload = {
  code: string;
  message: string;
  fieldErrors?: { field: string; message: string }[] | null;
};

export function isValidationError(value: unknown): value is ValidationErrorPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as ValidationErrorPayload).code === "string"
  );
}

export function getGraphQLErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
