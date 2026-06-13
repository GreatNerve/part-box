import strawberry
from graphql import GraphQLError

from app.api.graphql.auth_types import ValidationErrorType
from app.api.graphql.component_types import (
    BoxQuantityType,
    ComponentConnection,
    ComponentSortFieldGQL,
    ComponentType,
    InventoryLogConnection,
    InventoryLogTypeGQL,
    InventoryLogTypeGQLObject,
    SortDirectionGQL,
)
from app.api.graphql.context import GraphQLContext
from app.models import InventoryLogType
from app.schemas.component import ComponentFilterInput, ComponentSortField, ComponentSortInput, PaginationInput, SortDirection
from app.schemas.inventory_log import InventoryLogFilterInput
from app.services import component as component_service
from app.services import inventory_log as inventory_log_service


def _require_user_id(info: strawberry.Info[GraphQLContext]):
    if info.context.user_id is None:
        raise GraphQLError("Authentication required.", extensions={"code": "UNAUTHENTICATED"})
    return info.context.user_id


def _map_component(item) -> ComponentType:
    return ComponentType(
        id=item.id,
        name=item.name,
        category_id=item.category_id,
        category_name=item.category_name,
        low_stock_threshold=item.low_stock_threshold,
        datasheet_url=item.datasheet_url,
        total_qty=item.total_qty,
        box_quantities=[
            BoxQuantityType(box=row.box, quantity=row.quantity) for row in item.box_quantities
        ],
        updated_at=item.updated_at,
    )


def _map_log(item) -> InventoryLogTypeGQLObject:
    log_type = item.type.value if hasattr(item.type, "value") else item.type
    return InventoryLogTypeGQLObject(
        id=item.id,
        component_id=item.component_id,
        component_name=item.component_name,
        type=InventoryLogTypeGQL(log_type),
        quantity=item.quantity,
        box=item.box,
        from_box=item.from_box,
        reason=item.reason,
        related_log_id=item.related_log_id,
        created_at=item.created_at,
    )


@strawberry.input
class ComponentSortInputGQL:
    field: ComponentSortFieldGQL
    direction: SortDirectionGQL = SortDirectionGQL.ASC


@strawberry.input
class ComponentFilterInputGQL:
    search: str | None = None
    category_id: strawberry.ID | None = None
    box: str | None = None
    sort: ComponentSortInputGQL | None = None


@strawberry.input
class PaginationInputGQL:
    limit: int = 20
    offset: int = 0


@strawberry.input
class InventoryLogFilterInputGQL:
    search: str | None = None
    type: InventoryLogTypeGQL | None = None
    box: str | None = None
    component_id: strawberry.ID | None = None


def _map_log_filter(filter_input: InventoryLogFilterInputGQL | None) -> InventoryLogFilterInput | None:
    if filter_input is None:
        return None
    return InventoryLogFilterInput(
        search=filter_input.search,
        type=InventoryLogType(filter_input.type.value) if filter_input.type else None,
        box=filter_input.box,
        component_id=filter_input.component_id,
    )


def _map_filter(filter_input: ComponentFilterInputGQL | None) -> ComponentFilterInput | None:
    if filter_input is None:
        return None
    sort = None
    if filter_input.sort:
        sort = ComponentSortInput(
            field=ComponentSortField(filter_input.sort.field.value),
            direction=SortDirection(filter_input.sort.direction.value),
        )
    return ComponentFilterInput(
        search=filter_input.search,
        category_id=filter_input.category_id,
        box=filter_input.box,
        sort=sort,
    )


@strawberry.type
class ComponentQuery:
    @strawberry.field
    async def components(
        self,
        info: strawberry.Info[GraphQLContext],
        filter: ComponentFilterInputGQL | None = None,
        pagination: PaginationInputGQL | None = None,
    ) -> ComponentConnection:
        user_id = _require_user_id(info)
        page = pagination or PaginationInputGQL()
        result = await component_service.list_components(
            user_id,
            _map_filter(filter),
            PaginationInput(limit=page.limit, offset=page.offset),
        )
        return ComponentConnection(
            items=[_map_component(item) for item in result.items],
            total_count=result.total_count,
            limit=result.limit,
            offset=result.offset,
        )

    @strawberry.field
    async def component(
        self,
        info: strawberry.Info[GraphQLContext],
        id: strawberry.ID,
    ) -> ComponentType | None:
        user_id = _require_user_id(info)
        item = await component_service.get_component(user_id, id)
        if item is None:
            return None
        return _map_component(item)

    @strawberry.field
    async def component_logs(
        self,
        info: strawberry.Info[GraphQLContext],
        component_id: strawberry.ID,
        pagination: PaginationInputGQL | None = None,
    ) -> InventoryLogConnection:
        user_id = _require_user_id(info)
        page = pagination or PaginationInputGQL()
        result = await inventory_log_service.list_component_logs(
            user_id,
            component_id,
            PaginationInput(limit=page.limit, offset=page.offset),
        )
        return InventoryLogConnection(
            items=[_map_log(item) for item in result.items],
            total_count=result.total_count,
            limit=result.limit,
            offset=result.offset,
        )

    @strawberry.field
    async def inventory_logs(
        self,
        info: strawberry.Info[GraphQLContext],
        filter: InventoryLogFilterInputGQL | None = None,
        pagination: PaginationInputGQL | None = None,
    ) -> InventoryLogConnection:
        user_id = _require_user_id(info)
        page = pagination or PaginationInputGQL()
        result = await inventory_log_service.list_inventory_logs(
            user_id,
            _map_log_filter(filter),
            PaginationInput(limit=page.limit, offset=page.offset),
        )
        return InventoryLogConnection(
            items=[_map_log(item) for item in result.items],
            total_count=result.total_count,
            limit=result.limit,
            offset=result.offset,
        )
