from typing import Annotated, Union

import strawberry

from app.api.graphql.auth_types import FieldErrorType, ValidationErrorType
from app.api.graphql.category_queries import CategoryType
from app.api.graphql.context import GraphQLContext
from app.schemas.category import CreateCategoryInput
from app.schemas.user import ValidationErrorDTO
from app.services import category as category_service


@strawberry.input
class CreateCategoryInputGQL:
    name: str


def _map_validation(error: ValidationErrorDTO) -> ValidationErrorType:
    field_errors = None
    if error.field_errors:
        field_errors = [
            FieldErrorType(field=item["field"], message=item["message"])
            for item in error.field_errors
        ]
    return ValidationErrorType(code=error.code, message=error.message, field_errors=field_errors)


CreateCategoryResult = Annotated[
    Union[CategoryType, ValidationErrorType],
    strawberry.union("CreateCategoryResult"),
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
            CreateCategoryInput(name=input.name),
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation(result)

        return CategoryType(
            id=strawberry.ID(str(result.id)),
            name=result.name,
            is_default=result.is_default,
        )
