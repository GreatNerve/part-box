from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field, HttpUrl

from app.models import InventoryLogType


class BoxQuantityDTO(BaseModel):
    box: str
    quantity: int


class ComponentDTO(BaseModel):
    id: UUID
    name: str
    category_id: UUID
    category_name: str
    low_stock_threshold: int
    datasheet_url: str | None = None
    total_qty: int
    box_quantities: list[BoxQuantityDTO]
    updated_at: datetime


class ComponentSortField(str, Enum):
    NAME = "NAME"
    CATEGORY = "CATEGORY"
    TOTAL_QTY = "TOTAL_QTY"
    UPDATED_AT = "UPDATED_AT"


class SortDirection(str, Enum):
    ASC = "ASC"
    DESC = "DESC"


class ComponentSortInput(BaseModel):
    field: ComponentSortField
    direction: SortDirection = SortDirection.ASC


class ComponentFilterInput(BaseModel):
    search: str | None = None
    category_id: UUID | None = None
    box: str | None = None
    sort: ComponentSortInput | None = None


class BoxQuantityInput(BaseModel):
    box: str = Field(min_length=1, max_length=255)
    quantity: int = Field(ge=0)


class CreateComponentInput(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category_id: UUID
    datasheet_url: HttpUrl | None = None
    initial_box_quantities: list[BoxQuantityInput] = Field(default_factory=list)


class UpdateComponentInput(BaseModel):
    id: UUID
    name: str | None = Field(default=None, min_length=1, max_length=255)
    category_id: UUID | None = None
    datasheet_url: HttpUrl | None = None


class PaginationInput(BaseModel):
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class ComponentConnectionDTO(BaseModel):
    items: list[ComponentDTO]
    total_count: int
    limit: int
    offset: int
