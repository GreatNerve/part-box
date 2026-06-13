from uuid import UUID

import grpc
from v1 import inventory_pb2, inventory_pb2_grpc

from app.core.auth import decode_access_token, extract_bearer_token
from app.grpc.bootstrap import run_async
from app.grpc.errors import GrpcAbort
from app.grpc.mappers import validation_error_message
from app.models import InventoryLogType
from app.schemas.component import (
    BoxQuantityInput,
    ComponentFilterInput,
    CreateComponentInput,
    PaginationInput,
    UpdateComponentInput,
)
from app.schemas.inventory_log import ApplyInventoryLogInput
from app.schemas.user import ValidationErrorDTO
from app.services import component as component_service
from app.services import inventory_log as inventory_log_service

_LOG_TYPE_TO_PROTO = {
    InventoryLogType.ADD_STOCK: inventory_pb2.ADD_STOCK,
    InventoryLogType.USE: inventory_pb2.USE,
    InventoryLogType.RETURN: inventory_pb2.RETURN,
    InventoryLogType.LOST: inventory_pb2.LOST,
    InventoryLogType.BURN: inventory_pb2.BURN,
    InventoryLogType.DEFECTIVE: inventory_pb2.DEFECTIVE,
    InventoryLogType.REALLOCATE: inventory_pb2.REALLOCATE,
}

_PROTO_TO_LOG_TYPE = {value: key for key, value in _LOG_TYPE_TO_PROTO.items()}


def _user_id_from_metadata(metadata) -> UUID:
    token = extract_bearer_token(metadata.get("authorization"))
    if not token:
        raise GrpcAbort(grpc.StatusCode.UNAUTHENTICATED, "Missing authorization metadata")

    user_id = decode_access_token(token)
    if user_id is None:
        raise GrpcAbort(grpc.StatusCode.UNAUTHENTICATED, "Invalid or expired token")
    return user_id


def _map_component(item) -> inventory_pb2.ComponentMessage:
    return inventory_pb2.ComponentMessage(
        id=str(item.id),
        name=item.name,
        category_id=str(item.category_id),
        category_name=item.category_name,
        low_stock_threshold=item.low_stock_threshold,
        datasheet_url=item.datasheet_url or "",
        total_qty=item.total_qty,
        box_quantities=[
            inventory_pb2.BoxQuantityMessage(box=row.box, quantity=row.quantity)
            for row in item.box_quantities
        ],
        updated_at=item.updated_at.isoformat(),
    )


def _map_log(item) -> inventory_pb2.InventoryLogMessage:
    log_type = item.type.value if hasattr(item.type, "value") else item.type
    return inventory_pb2.InventoryLogMessage(
        id=str(item.id),
        component_id=str(item.component_id),
        type=_LOG_TYPE_TO_PROTO[InventoryLogType(log_type)],
        quantity=item.quantity,
        box=item.box,
        from_box=item.from_box or "",
        reason=item.reason or "",
        related_log_id=str(item.related_log_id) if item.related_log_id else "",
        created_at=item.created_at.isoformat(),
    )


class InventoryServicer(inventory_pb2_grpc.InventoryServiceServicer):
    def ListComponents(self, request, context):
        try:
            return run_async(self._list_components(request, context))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    def CreateComponent(self, request, context):
        try:
            return run_async(self._create_component(request, context))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    def UpdateComponent(self, request, context):
        try:
            return run_async(self._update_component(request, context))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    def ApplyInventoryLog(self, request, context):
        try:
            return run_async(self._apply_inventory_log(request, context))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    async def _list_components(self, request, context):
        metadata = dict(context.invocation_metadata())
        user_id = _user_id_from_metadata(metadata)

        category_id = None
        if request.category_id:
            try:
                category_id = UUID(request.category_id)
            except ValueError as exc:
                raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid category_id") from exc

        filter_input = ComponentFilterInput(
            search=request.search or None,
            category_id=category_id,
            box=request.box or None,
        )
        pagination = PaginationInput(
            limit=request.limit if request.limit > 0 else 20,
            offset=max(request.offset, 0),
        )

        result = await component_service.list_components(user_id, filter_input, pagination)
        return inventory_pb2.ListComponentsResponse(
            items=[_map_component(item) for item in result.items],
            total_count=result.total_count,
        )

    async def _create_component(self, request, context):
        user_id = _user_id_from_metadata(dict(context.invocation_metadata()))

        try:
            category_id = UUID(request.category_id)
        except ValueError as exc:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid category_id") from exc

        initial = [
            BoxQuantityInput(box=row.box, quantity=row.quantity)
            for row in request.initial_box_quantities
        ]
        result = await component_service.create_component(
            user_id,
            CreateComponentInput(
                name=request.name,
                category_id=category_id,
                datasheet_url=request.datasheet_url or None,
                initial_box_quantities=initial,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return inventory_pb2.CreateComponentResponse(error=validation_error_message(result))
        return inventory_pb2.CreateComponentResponse(component=_map_component(result))

    async def _update_component(self, request, context):
        user_id = _user_id_from_metadata(dict(context.invocation_metadata()))

        try:
            component_id = UUID(request.id)
        except ValueError as exc:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid component id") from exc

        category_id = None
        if request.has_category_id:
            try:
                category_id = UUID(request.category_id)
            except ValueError as exc:
                raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid category_id") from exc

        result = await component_service.update_component(
            user_id,
            UpdateComponentInput(
                id=component_id,
                name=request.name if request.has_name else None,
                category_id=category_id,
                datasheet_url=request.datasheet_url if request.has_datasheet_url else None,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return inventory_pb2.UpdateComponentResponse(error=validation_error_message(result))
        return inventory_pb2.UpdateComponentResponse(component=_map_component(result))

    async def _apply_inventory_log(self, request, context):
        user_id = _user_id_from_metadata(dict(context.invocation_metadata()))

        try:
            component_id = UUID(request.component_id)
        except ValueError as exc:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid component_id") from exc

        log_type = _PROTO_TO_LOG_TYPE.get(request.type)
        if log_type is None:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid inventory log type")

        related_log_id = None
        if request.related_log_id:
            try:
                related_log_id = UUID(request.related_log_id)
            except ValueError as exc:
                raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid related_log_id") from exc

        result = await inventory_log_service.apply_inventory_log(
            user_id,
            ApplyInventoryLogInput(
                component_id=component_id,
                type=log_type,
                quantity=request.quantity,
                box=request.box,
                from_box=request.from_box or None,
                reason=request.reason or None,
                related_log_id=related_log_id,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return inventory_pb2.ApplyInventoryLogResponse(error=validation_error_message(result))

        return inventory_pb2.ApplyInventoryLogResponse(
            success=inventory_pb2.ApplyInventoryLogSuccess(
                log=_map_log(result.log),
                component=_map_component(result.component),
            )
        )
