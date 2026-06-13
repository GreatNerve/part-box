from typing import Annotated, Union

import strawberry

from app.api.graphql.auth_types import FieldErrorType, ValidationErrorType
from app.api.graphql.category_queries import CategoryType
from app.api.graphql.context import GraphQLContext
from app.schemas.category import CreateCategoryInput, UpdateCategoryInput
from app.schemas.user import ValidationErrorDTO
from app.services import category as category_service


@strawberry.input
class CreateCategoryInputGQL:
    name: str
    low_stock_threshold: int = 5


@strawberry.input
class UpdateCategoryInputGQL:
    id: strawberry.ID
    name: str | None = None
    low_stock_threshold: int | None = None


def _map_validation(error: ValidationErrorDTO) -> ValidationErrorType:
    field_errors = None
    if error.field_errors:
        field_errors = [
            FieldErrorType(field=item["field"], message=item["message"])
            for item in error.field_errors
        ]
    return ValidationErrorType(code=error.code, message=error.message, field_errors=field_errors)


def _map_category(item) -> CategoryType:
    return CategoryType(
        id=strawberry.ID(str(item.id)),
        name=item.name,
        is_default=item.is_default,
        low_stock_threshold=item.low_stock_threshold,
    )


CreateCategoryResult = Annotated[
    Union[CategoryType, ValidationErrorType],
    strawberry.union("CreateCategoryResult"),
]

UpdateCategoryResult = Annotated[
    Union[CategoryType, ValidationErrorType],
    strawberry.union("UpdateCategoryResult"),
]


@strawberry.type
class CategoryMutation:
    @strawberry.mutation
    async def create_category(
        self,
        info: strawberry.Info[GraphQLContext],
        input: CreateCategoryInputGQL,
    ) -> CreateCategoryResult:
        if info.context.user_id is None:
            return _map_validation(
                ValidationErrorDTO(code="UNAUTHENTICATED", message="Authentication required.")
            )

        result = await category_service.create_category(
            info.context.user_id,
            CreateCategoryInput(
                name=input.name,
                low_stock_threshold=input.low_stock_threshold,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)

        return _map_category(result)

    @strawberry.mutation
    async def update_category(
        self,
        info: strawberry.Info[GraphQLContext],
        input: UpdateCategoryInputGQL,
    ) -> UpdateCategoryResult:
        if info.context.user_id is None:
            return _map_validation(
                ValidationErrorDTO(code="UNAUTHENTICATED", message="Authentication required.")
            )

        result = await category_service.update_category(
            info.context.user_id,
            UpdateCategoryInput(
                id=input.id,
                name=input.name,
                low_stock_threshold=input.low_stock_threshold,
            ),
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)

        return _map_category(result)
