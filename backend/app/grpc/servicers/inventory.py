from uuid import UUID

import grpc
from v1 import inventory_pb2, inventory_pb2_grpc

from app.core.auth import decode_access_token, extract_bearer_token
from app.grpc.bootstrap import run_async
from app.grpc.errors import GrpcAbort
from app.schemas.component import ComponentFilterInput, PaginationInput
from app.services import component as component_service


def _user_id_from_metadata(metadata) -> UUID:
    token = extract_bearer_token(metadata.get("authorization"))
    if not token:
        raise GrpcAbort(grpc.StatusCode.UNAUTHENTICATED, "Missing authorization metadata")

    user_id = decode_access_token(token)
    if user_id is None:
        raise GrpcAbort(grpc.StatusCode.UNAUTHENTICATED, "Invalid or expired token")
    return user_id


class InventoryServicer(inventory_pb2_grpc.InventoryServiceServicer):
    def ListComponents(self, request, context):
        try:
            return run_async(self._list_components(request, context))
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
            items=[
                inventory_pb2.ComponentMessage(
                    id=str(item.id),
                    name=item.name,
                    category_id=str(item.category_id),
                    total_qty=item.total_qty,
                )
                for item in result.items
            ],
            total_count=result.total_count,
        )
