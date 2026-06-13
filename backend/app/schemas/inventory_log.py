from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.models import InventoryLogType
from app.schemas.component import ComponentDTO


class InventoryLogDTO(BaseModel):
    id: UUID
    component_id: UUID
    component_name: str | None = None
    type: InventoryLogType
    quantity: int
    box: str
    from_box: str | None = None
    reason: str | None = None
    related_log_id: UUID | None = None
    created_at: datetime


class ApplyInventoryLogInput(BaseModel):
    component_id: UUID
    type: InventoryLogType
    quantity: int = Field(ge=1)
    box: str = Field(min_length=1, max_length=255)
    from_box: str | None = Field(default=None, max_length=255)
    reason: str | None = Field(default=None, max_length=1000)
    related_log_id: UUID | None = None


class ApplyInventoryLogSuccessDTO(BaseModel):
    log: InventoryLogDTO
    component: ComponentDTO


class InventoryLogFilterInput(BaseModel):
    search: str | None = None
    type: InventoryLogType | None = None
    box: str | None = None
    component_id: UUID | None = None


class InventoryLogConnectionDTO(BaseModel):
    items: list[InventoryLogDTO]
    total_count: int
    limit: int
    offset: int
