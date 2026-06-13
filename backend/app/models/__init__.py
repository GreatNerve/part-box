import enum
import uuid

from tortoise import fields, models


class User(models.Model):
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    email = fields.CharField(max_length=255, unique=True)
    password_hash = fields.CharField(max_length=255)
    display_name = fields.CharField(max_length=255, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)

    components: fields.ReverseRelation["Component"]
    categories: fields.ReverseRelation["Category"]
    logs: fields.ReverseRelation["InventoryLog"]

    class Meta:
        table = "users"


class Category(models.Model):
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ForeignKeyField("models.User", related_name="categories")
    name = fields.CharField(max_length=255)
    is_default = fields.BooleanField(default=False)
    low_stock_threshold = fields.IntField(default=5)
    created_at = fields.DatetimeField(auto_now_add=True)

    components: fields.ReverseRelation["Component"]

    class Meta:
        table = "categories"
        unique_together = (("user", "name"),)


class Component(models.Model):
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ForeignKeyField("models.User", related_name="components")
    category = fields.ForeignKeyField("models.Category", related_name="components")
    name = fields.CharField(max_length=255)
    datasheet_url = fields.CharField(max_length=2048, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    box_quantities: fields.ReverseRelation["ComponentBoxQuantity"]
    logs: fields.ReverseRelation["InventoryLog"]

    class Meta:
        table = "components"
        unique_together = (("user", "name"),)


class ComponentBoxQuantity(models.Model):
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    component = fields.ForeignKeyField("models.Component", related_name="box_quantities")
    box = fields.CharField(max_length=255)
    quantity = fields.IntField(default=0)

    class Meta:
        table = "component_box_quantities"
        unique_together = (("component", "box"),)


class InventoryLogType(str, enum.Enum):
    ADD_STOCK = "ADD_STOCK"
    USE = "USE"
    RETURN = "RETURN"
    LOST = "LOST"
    BURN = "BURN"
    DEFECTIVE = "DEFECTIVE"
    REALLOCATE = "REALLOCATE"


class InventoryLog(models.Model):
    id = fields.UUIDField(primary_key=True, default=uuid.uuid4)
    user = fields.ForeignKeyField("models.User", related_name="logs")
    component = fields.ForeignKeyField("models.Component", related_name="logs")
    type = fields.CharEnumField(InventoryLogType, max_length=32)
    quantity = fields.IntField()
    box = fields.CharField(max_length=255)
    from_box = fields.CharField(max_length=255, null=True)
    reason = fields.TextField(null=True)
    related_log = fields.ForeignKeyField(
        "models.InventoryLog",
        related_name="returns",
        null=True,
    )
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "inventory_logs"
