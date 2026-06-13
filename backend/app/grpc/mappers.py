from v1 import common_pb2

from app.schemas.user import ValidationErrorDTO


def validation_error_message(error: ValidationErrorDTO) -> common_pb2.ValidationErrorMessage:
    field_errors = []
    if error.field_errors:
        field_errors = [
            common_pb2.FieldErrorMessage(field=item["field"], message=item["message"])
            for item in error.field_errors
        ]
    return common_pb2.ValidationErrorMessage(
        code=error.code,
        message=error.message,
        field_errors=field_errors,
    )
