from uuid import UUID

from app.core.constants import DEFAULT_LOW_STOCK_THRESHOLD
from app.models import Category, User
from app.schemas.category import CategoryDTO, CreateCategoryInput, UpdateCategoryInput
from app.schemas.user import ValidationErrorDTO


async def list_categories(user_id: UUID) -> list[CategoryDTO]:
    categories = await Category.filter(user_id=user_id).order_by("name")
    return [
        CategoryDTO(
            id=category.id,
            name=category.name,
            is_default=category.is_default,
            low_stock_threshold=category.low_stock_threshold,
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

    category = await Category.create(
        user_id=user_id,
        name=name,
        is_default=False,
        low_stock_threshold=input_data.low_stock_threshold,
    )
    return CategoryDTO(
        id=category.id,
        name=category.name,
        is_default=category.is_default,
        low_stock_threshold=category.low_stock_threshold,
        created_at=category.created_at,
    )


async def update_category(
    user_id: UUID,
    input_data: UpdateCategoryInput,
) -> CategoryDTO | ValidationErrorDTO:
    category = await Category.get_or_none(id=input_data.id, user_id=user_id)
    if category is None:
        return ValidationErrorDTO(
            code="NOT_FOUND",
            message="Category not found.",
            field_errors=[{"field": "id", "message": "Category not found."}],
        )

    next_name = input_data.name.strip() if input_data.name is not None else category.name
    if not next_name:
        return ValidationErrorDTO(
            code="VALIDATION_ERROR",
            message="Category name is required.",
            field_errors=[{"field": "name", "message": "Name cannot be empty."}],
        )

    if next_name != category.name and await Category.filter(user_id=user_id, name=next_name).exists():
        return ValidationErrorDTO(
            code="DUPLICATE_CATEGORY_NAME",
            message="A category with this name already exists.",
            field_errors=[{"field": "name", "message": "Category already exists."}],
        )

    if input_data.name is not None and category.is_default and next_name != category.name:
        return ValidationErrorDTO(
            code="VALIDATION_ERROR",
            message="Default categories cannot be renamed.",
            field_errors=[{"field": "name", "message": "Rename not allowed for default categories."}],
        )

    category.name = next_name
    if input_data.low_stock_threshold is not None:
        category.low_stock_threshold = input_data.low_stock_threshold
    await category.save()

    return CategoryDTO(
        id=category.id,
        name=category.name,
        is_default=category.is_default,
        low_stock_threshold=category.low_stock_threshold,
        created_at=category.created_at,
    )
