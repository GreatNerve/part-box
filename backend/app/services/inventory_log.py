from uuid import UUID

from tortoise.functions import Sum
from tortoise.transactions import in_transaction

from app.models import Component, ComponentBoxQuantity, InventoryLog, InventoryLogType
from app.schemas.component import PaginationInput
from app.schemas.inventory_log import (
    ApplyInventoryLogInput,
    ApplyInventoryLogSuccessDTO,
    InventoryLogConnectionDTO,
    InventoryLogDTO,
    InventoryLogFilterInput,
)
from app.schemas.user import ValidationErrorDTO
from app.services.component import component_to_dto


def _validation(code: str, message: str, field: str | None = None) -> ValidationErrorDTO:
    field_errors = None
    if field:
        field_errors = [{"field": field, "message": message}]
    return ValidationErrorDTO(code=code, message=message, field_errors=field_errors)


def log_to_dto(log: InventoryLog, component_name: str | None = None) -> InventoryLogDTO:
    name = component_name
    if name is None and hasattr(log, "component") and log.component:
        name = log.component.name
    return InventoryLogDTO(
        id=log.id,
        component_id=log.component_id,
        component_name=name,
        type=log.type,
        quantity=log.quantity,
        box=log.box,
        from_box=log.from_box,
        reason=log.reason,
        related_log_id=log.related_log_id,
        created_at=log.created_at,
    )


async def _returned_qty_for_use(use_log_id: UUID) -> int:
    result = await InventoryLog.filter(
        related_log_id=use_log_id,
        type=InventoryLogType.RETURN,
    ).annotate(total=Sum("quantity")).values("total")
    if not result or result[0]["total"] is None:
        return 0
    return int(result[0]["total"])


async def _get_box_quantity(component_id: UUID, box: str) -> ComponentBoxQuantity | None:
    return await ComponentBoxQuantity.get_or_none(component_id=component_id, box=box)


async def _set_box_quantity(component_id: UUID, box: str, quantity: int) -> None:
    box_row = await _get_box_quantity(component_id, box)
    if box_row is None:
        if quantity > 0:
            await ComponentBoxQuantity.create(
                component_id=component_id,
                box=box,
                quantity=quantity,
            )
        return
    if quantity <= 0:
        await box_row.delete()
    else:
        box_row.quantity = quantity
        await box_row.save()


async def apply_inventory_log(
    user_id: UUID,
    input_data: ApplyInventoryLogInput,
) -> ApplyInventoryLogSuccessDTO | ValidationErrorDTO:
    component = await Component.get_or_none(id=input_data.component_id, user_id=user_id)
    if component is None:
        return _validation("NOT_FOUND", "Component not found.", "componentId")

    to_box = input_data.box.strip()
    log_type = input_data.type
    quantity = input_data.quantity

    related_log: InventoryLog | None = None
    if log_type == InventoryLogType.RETURN:
        if input_data.related_log_id is None:
            return _validation(
                "INVALID_RETURN_LINK",
                "Return logs must reference a use log.",
                "relatedLogId",
            )
        related_log = await InventoryLog.get_or_none(
            id=input_data.related_log_id,
            user_id=user_id,
            component_id=component.id,
            type=InventoryLogType.USE,
        )
        if related_log is None:
            return _validation(
                "INVALID_RETURN_LINK",
                "Use log not found for this component.",
                "relatedLogId",
            )
        already_returned = await _returned_qty_for_use(related_log.id)
        if already_returned + quantity > related_log.quantity:
            return _validation(
                "RETURN_QTY_EXCEEDED",
                "Return quantity exceeds remaining used quantity.",
                "quantity",
            )

    if log_type == InventoryLogType.REALLOCATE:
        from_box = (input_data.from_box or "").strip()
        if not from_box:
            return _validation("VALIDATION_ERROR", "Source box is required.", "fromBox")
        if from_box.lower() == to_box.lower():
            return _validation(
                "VALIDATION_ERROR",
                "Source and destination boxes must differ.",
                "fromBox",
            )

        async with in_transaction():
            from_row = await _get_box_quantity(component.id, from_box)
            from_qty = from_row.quantity if from_row else 0
            if from_qty < quantity:
                return _validation(
                    "INSUFFICIENT_STOCK",
                    f"Not enough stock in {from_box}.",
                    "quantity",
                )

            to_row = await _get_box_quantity(component.id, to_box)
            to_qty = to_row.quantity if to_row else 0

            await _set_box_quantity(component.id, from_box, from_qty - quantity)
            await _set_box_quantity(component.id, to_box, to_qty + quantity)

            log = await InventoryLog.create(
                user_id=user_id,
                component_id=component.id,
                type=log_type,
                quantity=quantity,
                box=to_box,
                from_box=from_box,
                reason=input_data.reason,
            )
            component.updated_at = log.created_at
            await component.save()

        refreshed = await Component.get(id=component.id)
        return ApplyInventoryLogSuccessDTO(
            log=log_to_dto(log, component_name=component.name),
            component=await component_to_dto(refreshed),
        )

    decrease_types = {
        InventoryLogType.USE,
        InventoryLogType.LOST,
        InventoryLogType.BURN,
        InventoryLogType.DEFECTIVE,
    }
    increase_types = {InventoryLogType.ADD_STOCK, InventoryLogType.RETURN}

    if log_type not in decrease_types | increase_types:
        return _validation("VALIDATION_ERROR", "Unsupported log type.", "type")

    async with in_transaction():
        box_row = await _get_box_quantity(component.id, to_box)
        current_qty = box_row.quantity if box_row else 0

        if log_type in decrease_types:
            if current_qty < quantity:
                return _validation(
                    "INSUFFICIENT_STOCK",
                    f"Not enough stock in {to_box}.",
                    "quantity",
                )
            new_qty = current_qty - quantity
        else:
            new_qty = current_qty + quantity

        await _set_box_quantity(component.id, to_box, new_qty)

        log = await InventoryLog.create(
            user_id=user_id,
            component_id=component.id,
            type=log_type,
            quantity=quantity,
            box=to_box,
            reason=input_data.reason,
            related_log_id=related_log.id if related_log else input_data.related_log_id,
        )

        component.updated_at = log.created_at
        await component.save()

    refreshed = await Component.get(id=component.id)
    return ApplyInventoryLogSuccessDTO(
        log=log_to_dto(log, component_name=component.name),
        component=await component_to_dto(refreshed),
    )


async def list_component_logs(
    user_id: UUID,
    component_id: UUID,
    pagination: PaginationInput | None,
) -> InventoryLogConnectionDTO:
    pagination = pagination or PaginationInput()
    component = await Component.get_or_none(id=component_id, user_id=user_id)
    if component is None:
        return InventoryLogConnectionDTO(
            items=[],
            total_count=0,
            limit=pagination.limit,
            offset=pagination.offset,
        )

    query = InventoryLog.filter(user_id=user_id, component_id=component_id).order_by("-created_at")
    total_count = await query.count()
    logs = await query.offset(pagination.offset).limit(pagination.limit)

    return InventoryLogConnectionDTO(
        items=[log_to_dto(log, component_name=component.name) for log in logs],
        total_count=total_count,
        limit=pagination.limit,
        offset=pagination.offset,
    )


async def list_inventory_logs(
    user_id: UUID,
    filter_input: InventoryLogFilterInput | None,
    pagination: PaginationInput | None,
) -> InventoryLogConnectionDTO:
    from tortoise.expressions import Q

    pagination = pagination or PaginationInput()
    query = InventoryLog.filter(user_id=user_id).prefetch_related("component").order_by("-created_at")

    if filter_input:
        if filter_input.component_id:
            query = query.filter(component_id=filter_input.component_id)
        if filter_input.type:
            query = query.filter(type=filter_input.type)
        if filter_input.box:
            box = filter_input.box.strip()
            query = query.filter(Q(box=box) | Q(from_box=box))
        if filter_input.search:
            query = query.filter(component__name__icontains=filter_input.search)

    total_count = await query.count()
    logs = await query.offset(pagination.offset).limit(pagination.limit)

    return InventoryLogConnectionDTO(
        items=[log_to_dto(log) for log in logs],
        total_count=total_count,
        limit=pagination.limit,
        offset=pagination.offset,
    )
