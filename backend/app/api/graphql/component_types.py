from datetime import datetime
from enum import Enum
from uuid import UUID

import strawberry

from app.models import InventoryLogType


@strawberry.enum
class InventoryLogTypeGQL(Enum):
    ADD_STOCK = InventoryLogType.ADD_STOCK.value
    USE = InventoryLogType.USE.value
    RETURN = InventoryLogType.RETURN.value
    LOST = InventoryLogType.LOST.value
    BURN = InventoryLogType.BURN.value
    DEFECTIVE = InventoryLogType.DEFECTIVE.value


@strawberry.enum
class ComponentSortFieldGQL(Enum):
    NAME = "NAME"
    CATEGORY = "CATEGORY"
    TOTAL_QTY = "TOTAL_QTY"
    UPDATED_AT = "UPDATED_AT"


@strawberry.enum
class SortDirectionGQL(Enum):
    ASC = "ASC"
    DESC = "DESC"


@strawberry.type
class BoxQuantityType:
    box: str
    quantity: int


@strawberry.type
class ComponentType:
    id: UUID
    name: str
    category_id: UUID
    category_name: str
    datasheet_url: str | None
    total_qty: int
    box_quantities: list[BoxQuantityType]
    updated_at: datetime


@strawberry.type
class ComponentConnection:
    items: list[ComponentType]
    total_count: int
    limit: int
    offset: int


@strawberry.type
class InventoryLogTypeGQLObject:
    id: UUID
    component_id: UUID
    type: InventoryLogTypeGQL
    quantity: int
    box: str
    reason: str | None
    related_log_id: UUID | None
    created_at: datetime


@strawberry.type
class InventoryLogConnection:
    items: list[InventoryLogTypeGQLObject]
    total_count: int
    limit: int
    offset: int


@strawberry.type
class DeleteComponentSuccess:
    deleted: bool


@strawberry.type
class ApplyInventoryLogSuccess:
    log: InventoryLogTypeGQLObject
    component: ComponentType
