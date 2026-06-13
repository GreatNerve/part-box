from typing import Annotated, Union

import strawberry

from app.api.graphql.auth_types import FieldErrorType, ValidationErrorType
from app.api.graphql.component_types import ComponentType, DeleteComponentSuccess
from app.api.graphql.context import GraphQLContext
from app.schemas.component import CreateComponentInput, UpdateComponentInput
from app.schemas.user import ValidationErrorDTO
from app.services import component as component_service


@strawberry.input
class BoxQuantityInputGQL:
    box: str
    quantity: int


@strawberry.input
class CreateComponentInputGQL:
    name: str
    category_id: strawberry.ID
    datasheet_url: str | None = None
    initial_box_quantities: list[BoxQuantityInputGQL] | None = None


@strawberry.input
class UpdateComponentInputGQL:
    id: strawberry.ID
    name: str | None = None
    category_id: strawberry.ID | None = None
    datasheet_url: str | None = None


def _map_validation(error: ValidationErrorDTO) -> ValidationErrorType:
    field_errors = None
    if error.field_errors:
        field_errors = [
            FieldErrorType(field=item["field"], message=item["message"])
            for item in error.field_errors
        ]
    return ValidationErrorType(code=error.code, message=error.message, field_errors=field_errors)


from app.api.graphql.component_queries import _map_component


CreateComponentResult = Annotated[
    Union[ComponentType, ValidationErrorType],
    strawberry.union("CreateComponentResult"),
]
UpdateComponentResult = Annotated[
    Union[ComponentType, ValidationErrorType],
    strawberry.union("UpdateComponentResult"),
]
DeleteComponentResult = Annotated[
    Union[DeleteComponentSuccess, ValidationErrorType],
    strawberry.union("DeleteComponentResult"),
]


@strawberry.type
class ComponentMutation:
    @strawberry.mutation
    async def create_component(
        self,
        info: strawberry.Info[GraphQLContext],
        input: CreateComponentInputGQL,
    ) -> CreateComponentResult:
        if info.context.user_id is None:
            return _map_validation(
                ValidationErrorDTO(code="UNAUTHENTICATED", message="Authentication required.")
            )

        from app.schemas.component import BoxQuantityInput

        initial = [
            BoxQuantityInput(box=row.box, quantity=row.quantity)
            for row in (input.initial_box_quantities or [])
        ]
        result = await component_service.create_component(
            info.context.user_id,
            CreateComponentInput(
                name=input.name,
                category_id=input.category_id,
                datasheet_url=input.datasheet_url,
                initial_box_quantities=initial,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)
        return _map_component(result)

    @strawberry.mutation
    async def update_component(
        self,
        info: strawberry.Info[GraphQLContext],
        input: UpdateComponentInputGQL,
    ) -> UpdateComponentResult:
        if info.context.user_id is None:
            return _map_validation(
                ValidationErrorDTO(code="UNAUTHENTICATED", message="Authentication required.")
            )

        result = await component_service.update_component(
            info.context.user_id,
            UpdateComponentInput(
                id=input.id,
                name=input.name,
                category_id=input.category_id,
                datasheet_url=input.datasheet_url,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)
        return _map_component(result)

    @strawberry.mutation
    async def delete_component(
        self,
        info: strawberry.Info[GraphQLContext],
        id: strawberry.ID,
    ) -> DeleteComponentResult:
        if info.context.user_id is None:
            return _map_validation(
                ValidationErrorDTO(code="UNAUTHENTICATED", message="Authentication required.")
            )

        result = await component_service.delete_component(info.context.user_id, id)
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)
        return DeleteComponentSuccess(deleted=True)
