import strawberry
from typing import Annotated, Union

from app.api.graphql.auth_types import AuthPayload, FieldErrorType, UserType, ValidationErrorType
from app.api.graphql.context import GraphQLContext
from app.schemas.user import AuthTokenDTO, LoginInput, RegisterInput, ValidationErrorDTO
from app.services import auth as auth_service


@strawberry.input
class RegisterInputGQL:
    email: str
    password: str
    display_name: str | None = None


@strawberry.input
class LoginInputGQL:
    email: str
    password: str


def _map_user(result: AuthTokenDTO) -> AuthPayload:
    return AuthPayload(
        token=result.token,
        user=UserType(
            id=result.user.id,
            email=str(result.user.email),
            display_name=result.user.display_name,
            created_at=result.user.created_at,
        ),
    )


def _map_validation_error(error: ValidationErrorDTO) -> ValidationErrorType:
    field_errors = None
    if error.field_errors:
        field_errors = [
            FieldErrorType(field=item["field"], message=item["message"])
            for item in error.field_errors
        ]
    return ValidationErrorType(code=error.code, message=error.message, field_errors=field_errors)


RegisterResult = Annotated[
    Union[AuthPayload, ValidationErrorType],
    strawberry.union("RegisterResult"),
]
LoginResult = Annotated[
    Union[AuthPayload, ValidationErrorType],
    strawberry.union("LoginResult"),
]


@strawberry.type
class AuthMutation:
    @strawberry.mutation
    async def register(self, info: strawberry.Info[GraphQLContext], input: RegisterInputGQL) -> RegisterResult:
        result = await auth_service.register(
            RegisterInput(
                email=input.email,
                password=input.password,
                display_name=input.display_name,
            )
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation_error(result)
        return _map_user(result)

    @strawberry.mutation
    async def login(self, info: strawberry.Info[GraphQLContext], input: LoginInputGQL) -> LoginResult:
        result = await auth_service.login(
            LoginInput(email=input.email, password=input.password)
        )
        if isinstance(result, ValidationErrorDTO):
            return _map_validation_error(result)
        return _map_user(result)
