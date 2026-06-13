from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserDTO(BaseModel):
    id: UUID
    email: EmailStr
    display_name: str | None = None
    created_at: datetime


class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(default=None, max_length=255)


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthTokenDTO(BaseModel):
    token: str
    user: UserDTO


class ValidationErrorDTO(BaseModel):
    code: str
    message: str
    field_errors: list[dict[str, str]] | None = None
