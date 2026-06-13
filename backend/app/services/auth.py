from app.core.auth import create_access_token, hash_password, verify_password
from app.core.constants import DEFAULT_CATEGORY_NAMES
from app.models import Category, User
from app.schemas.user import AuthTokenDTO, LoginInput, RegisterInput, UserDTO, ValidationErrorDTO


def _user_to_dto(user: User) -> UserDTO:
    return UserDTO(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        created_at=user.created_at,
    )


async def seed_default_categories(user: User) -> None:
    existing = await Category.filter(user=user).count()
    if existing:
        return
    await Category.bulk_create(
        [
            Category(user=user, name=name, is_default=True)
            for name in DEFAULT_CATEGORY_NAMES
        ]
    )


async def register(input_data: RegisterInput) -> AuthTokenDTO | ValidationErrorDTO:
    email = input_data.email.lower().strip()
    if await User.filter(email=email).exists():
        return ValidationErrorDTO(
            code="DUPLICATE_EMAIL",
            message="An account with this email already exists.",
            field_errors=[{"field": "email", "message": "Email already registered."}],
        )

    user = await User.create(
        email=email,
        password_hash=hash_password(input_data.password),
        display_name=input_data.display_name,
    )
    await seed_default_categories(user)
    token = create_access_token(user.id)
    return AuthTokenDTO(token=token, user=_user_to_dto(user))


async def login(input_data: LoginInput) -> AuthTokenDTO | ValidationErrorDTO:
    email = input_data.email.lower().strip()
    user = await User.get_or_none(email=email)
    if user is None or not verify_password(input_data.password, user.password_hash):
        return ValidationErrorDTO(
            code="INVALID_CREDENTIALS",
            message="Invalid email or password.",
        )

    token = create_access_token(user.id)
    return AuthTokenDTO(token=token, user=_user_to_dto(user))


async def get_user_by_id(user_id) -> UserDTO | None:
    user = await User.get_or_none(id=user_id)
    if user is None:
        return None
    return _user_to_dto(user)


async def delete_user(user_id) -> bool:
    deleted = await User.filter(id=user_id).delete()
    return deleted > 0
