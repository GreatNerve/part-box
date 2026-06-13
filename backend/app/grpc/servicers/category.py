from uuid import UUID

import grpc
from v1 import category_pb2, category_pb2_grpc

from app.grpc.bootstrap import run_async
from app.grpc.errors import GrpcAbort
from app.grpc.mappers import validation_error_message
from app.grpc.servicers.inventory import _user_id_from_metadata
from app.schemas.category import CreateCategoryInput, UpdateCategoryInput
from app.schemas.user import ValidationErrorDTO
from app.services import category as category_service


def _map_category(item) -> category_pb2.CategoryMessage:
    return category_pb2.CategoryMessage(
        id=str(item.id),
        name=item.name,
        is_default=item.is_default,
        low_stock_threshold=item.low_stock_threshold,
    )


class CategoryServicer(category_pb2_grpc.CategoryServiceServicer):
    def CreateCategory(self, request, context):
        try:
            return run_async(self._create_category(request, context))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    def UpdateCategory(self, request, context):
        try:
            return run_async(self._update_category(request, context))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    async def _create_category(self, request, context):
        user_id = _user_id_from_metadata(dict(context.invocation_metadata()))

        result = await category_service.create_category(
            user_id,
            CreateCategoryInput(
                name=request.name,
                low_stock_threshold=request.low_stock_threshold or 5,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return category_pb2.CreateCategoryResponse(error=validation_error_message(result))
        return category_pb2.CreateCategoryResponse(category=_map_category(result))

    async def _update_category(self, request, context):
        user_id = _user_id_from_metadata(dict(context.invocation_metadata()))

        try:
            category_id = UUID(request.id)
        except ValueError as exc:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, "Invalid category id") from exc

        result = await category_service.update_category(
            user_id,
            UpdateCategoryInput(
                id=category_id,
                name=request.name if request.has_name else None,
                low_stock_threshold=(
                    request.low_stock_threshold if request.has_low_stock_threshold else None
                ),
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return category_pb2.UpdateCategoryResponse(error=validation_error_message(result))
        return category_pb2.UpdateCategoryResponse(category=_map_category(result))
