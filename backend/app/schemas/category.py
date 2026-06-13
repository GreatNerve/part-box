from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl


class CategoryDTO(BaseModel):
    id: UUID
    name: str
    is_default: bool
    created_at: datetime


class CreateCategoryInput(BaseModel):
    name: str = Field(min_length=1, max_length=255)
