from uuid import UUID

from app.models import Category, User
from app.schemas.category import CategoryDTO, CreateCategoryInput
from app.schemas.user import ValidationErrorDTO


async def list_categories(user_id: UUID) -> list[CategoryDTO]:
    categories = await Category.filter(user_id=user_id).order_by("name")
    return [
        CategoryDTO(
            id=category.id,
            name=category.name,
            is_default=category.is_default,
            created_at=category.created_at,
        )
        for category in categories
    ]


async def create_category(
    user_id: UUID,
    input_data: CreateCategoryInput,
) -> CategoryDTO | ValidationErrorDTO:
    name = input_data.name.strip()
    if not name:
        return ValidationErrorDTO(
            code="VALIDATION_ERROR",
            message="Category name is required.",
            field_errors=[{"field": "name", "message": "Name cannot be empty."}],
        )

    if await Category.filter(user_id=user_id, name=name).exists():
        return ValidationErrorDTO(
            code="DUPLICATE_CATEGORY_NAME",
            message="A category with this name already exists.",
            field_errors=[{"field": "name", "message": "Category already exists."}],
        )

    category = await Category.create(user_id=user_id, name=name, is_default=False)
    return CategoryDTO(
        id=category.id,
        name=category.name,
        is_default=category.is_default,
        created_at=category.created_at,
    )
