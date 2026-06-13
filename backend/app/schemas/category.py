from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class CategoryDTO(BaseModel):
    id: UUID
    name: str
    is_default: bool
    low_stock_threshold: int
    created_at: datetime


class CreateCategoryInput(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    low_stock_threshold: int = Field(default=5, ge=0)


class UpdateCategoryInput(BaseModel):
    id: UUID
    name: str | None = Field(default=None, min_length=1, max_length=255)
    low_stock_threshold: int | None = Field(default=None, ge=0)
