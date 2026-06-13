from datetime import datetime
from uuid import UUID

import strawberry


@strawberry.type
class UserType:
    id: UUID
    email: str
    display_name: str | None
    created_at: datetime


@strawberry.type
class AuthPayload:
    token: str
    user: UserType


@strawberry.type
class FieldErrorType:
    field: str
    message: str


@strawberry.type
class ValidationErrorType:
    code: str
    message: str
    field_errors: list[FieldErrorType] | None = None
