from uuid import UUID

from tortoise.transactions import in_transaction

from app.models import Category, Component, ComponentBoxQuantity, InventoryLogType
from app.schemas.component import (
    BoxQuantityDTO,
    ComponentConnectionDTO,
    ComponentDTO,
    ComponentFilterInput,
    ComponentSortField,
    CreateComponentInput,
    PaginationInput,
    SortDirection,
    UpdateComponentInput,
)
from app.schemas.user import ValidationErrorDTO


async def component_to_dto(component: Component) -> ComponentDTO:
    await component.fetch_related("category", "box_quantities")
    box_quantities = [
        BoxQuantityDTO(box=row.box, quantity=row.quantity) for row in component.box_quantities
    ]
    return ComponentDTO(
        id=component.id,
        name=component.name,
        category_id=component.category_id,
        category_name=component.category.name,
        datasheet_url=component.datasheet_url,
        total_qty=sum(row.quantity for row in box_quantities),
        box_quantities=box_quantities,
        updated_at=component.updated_at,
    )


def _validation(code: str, message: str, field: str | None = None) -> ValidationErrorDTO:
    field_errors = None
    if field:
        field_errors = [{"field": field, "message": message}]
    return ValidationErrorDTO(code=code, message=message, field_errors=field_errors)


async def list_components(
    user_id: UUID,
    filter_input: ComponentFilterInput | None,
    pagination: PaginationInput | None,
) -> ComponentConnectionDTO:
    pagination = pagination or PaginationInput()
    query = Component.filter(user_id=user_id).prefetch_related("category", "box_quantities")

    if filter_input:
        if filter_input.search:
            query = query.filter(name__icontains=filter_input.search)
        if filter_input.category_id:
            query = query.filter(category_id=filter_input.category_id)
        if filter_input.box:
            query = query.filter(
                box_quantities__box=filter_input.box,
                box_quantities__quantity__gt=0,
            ).distinct()

    components = await query

    if filter_input and filter_input.sort:
        sort = filter_input.sort
        reverse = sort.direction == SortDirection.DESC
        if sort.field == ComponentSortField.NAME:
            components.sort(key=lambda item: item.name.lower(), reverse=reverse)
        elif sort.field == ComponentSortField.CATEGORY:
            components.sort(
                key=lambda item: item.category.name.lower() if item.category else "",
                reverse=reverse,
            )
        elif sort.field == ComponentSortField.UPDATED_AT:
            components.sort(key=lambda item: item.updated_at, reverse=reverse)
        elif sort.field == ComponentSortField.TOTAL_QTY:
            components.sort(
                key=lambda item: sum(row.quantity for row in item.box_quantities),
                reverse=reverse,
            )
    else:
        components.sort(key=lambda item: item.name.lower())

    total_count = len(components)
    page = components[pagination.offset : pagination.offset + pagination.limit]
    items = [await component_to_dto(component) for component in page]

    return ComponentConnectionDTO(
        items=items,
        total_count=total_count,
        limit=pagination.limit,
        offset=pagination.offset,
    )


async def get_component(user_id: UUID, component_id: UUID) -> ComponentDTO | None:
    component = await Component.get_or_none(id=component_id, user_id=user_id)
    if component is None:
        return None
    return await component_to_dto(component)


async def create_component(
    user_id: UUID,
    input_data: CreateComponentInput,
) -> ComponentDTO | ValidationErrorDTO:
    category = await Category.get_or_none(id=input_data.category_id, user_id=user_id)
    if category is None:
        return _validation("NOT_FOUND", "Category not found.", "categoryId")

    name = input_data.name.strip()
    if await Component.filter(user_id=user_id, name=name).exists():
        return _validation(
            "DUPLICATE_COMPONENT_NAME",
            "A component with this name already exists.",
            "name",
        )

    datasheet_url = str(input_data.datasheet_url) if input_data.datasheet_url else None

    async with in_transaction():
        component = await Component.create(
            user_id=user_id,
            category_id=category.id,
            name=name,
            datasheet_url=datasheet_url,
        )

        if input_data.initial_box_quantities:
            from app.schemas.inventory_log import ApplyInventoryLogInput
            from app.services import inventory_log as inventory_log_service

            for box_row in input_data.initial_box_quantities:
                if box_row.quantity <= 0:
                    continue
                result = await inventory_log_service.apply_inventory_log(
                    user_id,
                    ApplyInventoryLogInput(
                        component_id=component.id,
                        type=InventoryLogType.ADD_STOCK,
                        quantity=box_row.quantity,
                        box=box_row.box.strip(),
                        reason="Initial stock",
                    ),
                )
                if isinstance(result, ValidationErrorDTO):
                    raise ValueError(result.message)

    return await component_to_dto(await Component.get(id=component.id))


async def update_component(
    user_id: UUID,
    input_data: UpdateComponentInput,
) -> ComponentDTO | ValidationErrorDTO:
    component = await Component.get_or_none(id=input_data.id, user_id=user_id)
    if component is None:
        return _validation("NOT_FOUND", "Component not found.", "id")

    if input_data.name is not None:
        name = input_data.name.strip()
        duplicate = await Component.filter(user_id=user_id, name=name).exclude(id=component.id).exists()
        if duplicate:
            return _validation(
                "DUPLICATE_COMPONENT_NAME",
                "A component with this name already exists.",
                "name",
            )
        component.name = name

    if input_data.category_id is not None:
        category = await Category.get_or_none(id=input_data.category_id, user_id=user_id)
        if category is None:
            return _validation("NOT_FOUND", "Category not found.", "categoryId")
        component.category_id = category.id

    if input_data.datasheet_url is not None:
        component.datasheet_url = str(input_data.datasheet_url)

    await component.save()
    return await component_to_dto(component)


async def delete_component(
    user_id: UUID,
    component_id: UUID,
) -> bool | ValidationErrorDTO:
    component = await Component.get_or_none(id=component_id, user_id=user_id)
    if component is None:
        return _validation("NOT_FOUND", "Component not found.", "id")

    await component.delete()
    return True
