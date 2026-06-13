from typing import Annotated, Union

import strawberry

from app.api.graphql.auth_types import FieldErrorType, ValidationErrorType
from app.api.graphql.component_types import ApplyInventoryLogSuccess, InventoryLogTypeGQL
from app.api.graphql.context import GraphQLContext
from app.models import InventoryLogType
from app.schemas.inventory_log import ApplyInventoryLogInput
from app.schemas.user import ValidationErrorDTO
from app.services import inventory_log as inventory_log_service


@strawberry.input
class ApplyInventoryLogInputGQL:
    component_id: strawberry.ID
    type: InventoryLogTypeGQL
    quantity: int
    box: str
    reason: str | None = None
    related_log_id: strawberry.ID | None = None


def _map_validation(error: ValidationErrorDTO) -> ValidationErrorType:
    field_errors = None
    if error.field_errors:
        field_errors = [
            FieldErrorType(field=item["field"], message=item["message"])
            for item in error.field_errors
        ]
    return ValidationErrorType(code=error.code, message=error.message, field_errors=field_errors)


def _map_success(result) -> ApplyInventoryLogSuccess:
    from app.api.graphql.component_queries import _map_component, _map_log

    return ApplyInventoryLogSuccess(
        log=_map_log(result.log),
        component=_map_component(result.component),
    )


ApplyInventoryLogResult = Annotated[
    Union[ApplyInventoryLogSuccess, ValidationErrorType],
    strawberry.union("ApplyInventoryLogResult"),
]


@strawberry.type
class InventoryLogMutation:
    @strawberry.mutation
    async def apply_inventory_log(
        self,
        info: strawberry.Info[GraphQLContext],
        input: ApplyInventoryLogInputGQL,
    ) -> ApplyInventoryLogResult:
        if info.context.user_id is None:
            return _map_validation(
                ValidationErrorDTO(code="UNAUTHENTICATED", message="Authentication required.")
            )

        result = await inventory_log_service.apply_inventory_log(
            info.context.user_id,
            ApplyInventoryLogInput(
                component_id=input.component_id,
                type=InventoryLogType(input.type.value),
                quantity=input.quantity,
                box=input.box,
                reason=input.reason,
                related_log_id=input.related_log_id,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)
        return _map_success(result)
