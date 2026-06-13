"""gRPC integration tests — require PostgreSQL (see tests/conftest.py)."""

from __future__ import annotations

from uuid import UUID, uuid4

import grpc
import pytest
from v1 import auth_pb2, auth_pb2_grpc, category_pb2, category_pb2_grpc, health_pb2, health_pb2_grpc, inventory_pb2, inventory_pb2_grpc

from app.services import auth as auth_service


async def _register_user(grpc_channel, *, prefix: str = "grpc") -> tuple[str, UUID, str]:
    stub = auth_pb2_grpc.AuthServiceStub(grpc_channel)
    email = f"{prefix}-{uuid4()}@example.com"
    password = "password1"
    registered = await stub.Register(
        auth_pb2.RegisterRequest(
            email=email,
            password=password,
            display_name="gRPC Test",
        )
    )
    return registered.token, UUID(registered.user.id), email


@pytest.mark.integration
async def test_grpc_health(grpc_channel):
    stub = health_pb2_grpc.HealthServiceStub(grpc_channel)
    response = await stub.Check(health_pb2.HealthCheckRequest())

    assert response.status == "ok"
    assert response.deployed_at


@pytest.mark.integration
async def test_grpc_register_and_login(grpc_channel):
    stub = auth_pb2_grpc.AuthServiceStub(grpc_channel)
    email = f"grpc-{uuid4()}@example.com"
    password = "password1"

    user_id: UUID | None = None

    try:
        registered = await stub.Register(
            auth_pb2.RegisterRequest(
                email=email,
                password=password,
                display_name="gRPC Test",
            )
        )
        user_id = UUID(registered.user.id)
        assert registered.token
        assert registered.user.email == email
        assert registered.user.display_name == "gRPC Test"

        logged_in = await stub.Login(
            auth_pb2.LoginRequest(email=email, password=password)
        )
        assert logged_in.token
        assert logged_in.user.email == email
    finally:
        if user_id is not None:
            await auth_service.delete_user(user_id)


@pytest.mark.integration
async def test_grpc_login_invalid_credentials(grpc_channel):
    stub = auth_pb2_grpc.AuthServiceStub(grpc_channel)

    with pytest.raises(grpc.aio.AioRpcError) as exc_info:
        await stub.Login(
            auth_pb2.LoginRequest(
                email="missing@example.com",
                password="password1",
            )
        )

    assert exc_info.value.code() == grpc.StatusCode.UNAUTHENTICATED


@pytest.mark.integration
async def test_grpc_list_components_requires_auth(grpc_channel):
    stub = inventory_pb2_grpc.InventoryServiceStub(grpc_channel)

    with pytest.raises(grpc.aio.AioRpcError) as exc_info:
        await stub.ListComponents(inventory_pb2.ListComponentsRequest())

    assert exc_info.value.code() == grpc.StatusCode.UNAUTHENTICATED


@pytest.mark.integration
async def test_grpc_list_components_with_token(grpc_channel):
    auth_stub = auth_pb2_grpc.AuthServiceStub(grpc_channel)
    inventory_stub = inventory_pb2_grpc.InventoryServiceStub(grpc_channel)
    email = f"grpc-inv-{uuid4()}@example.com"
    password = "password1"

    user_id: UUID | None = None
    registered = await auth_stub.Register(
        auth_pb2.RegisterRequest(
            email=email,
            password=password,
            display_name="Inventory gRPC",
        )
    )
    user_id = UUID(registered.user.id)

    try:
        metadata = (("authorization", f"Bearer {registered.token}"),)
        response = await inventory_stub.ListComponents(
            inventory_pb2.ListComponentsRequest(limit=10, offset=0),
            metadata=metadata,
        )
        assert response.total_count == 0
        assert list(response.items) == []
    finally:
        if user_id is not None:
            await auth_service.delete_user(user_id)


@pytest.mark.integration
async def test_grpc_create_category(grpc_channel):
    token, user_id, _email = await _register_user(grpc_channel, prefix="grpc-cat")
    metadata = (("authorization", f"Bearer {token}"),)
    stub = category_pb2_grpc.CategoryServiceStub(grpc_channel)

    try:
        response = await stub.CreateCategory(
            category_pb2.CreateCategoryRequest(name="Sensors", low_stock_threshold=3),
            metadata=metadata,
        )
        assert response.HasField("category")
        assert response.category.name == "Sensors"
        assert response.category.low_stock_threshold == 3
    finally:
        await auth_service.delete_user(user_id)


@pytest.mark.integration
async def test_grpc_create_component_and_apply_log(grpc_channel):
    token, user_id, _email = await _register_user(grpc_channel, prefix="grpc-comp")
    metadata = (("authorization", f"Bearer {token}"),)
    category_stub = category_pb2_grpc.CategoryServiceStub(grpc_channel)
    inventory_stub = inventory_pb2_grpc.InventoryServiceStub(grpc_channel)

    try:
        category = await category_stub.CreateCategory(
            category_pb2.CreateCategoryRequest(name="Microcontrollers", low_stock_threshold=2),
            metadata=metadata,
        )
        category_id = category.category.id

        created = await inventory_stub.CreateComponent(
            inventory_pb2.CreateComponentRequest(
                name="Arduino Uno",
                category_id=category_id,
                initial_box_quantities=[
                    inventory_pb2.BoxQuantityInput(box="Box A", quantity=5),
                ],
            ),
            metadata=metadata,
        )
        assert created.HasField("component")
        assert created.component.total_qty == 5
        component_id = created.component.id

        applied = await inventory_stub.ApplyInventoryLog(
            inventory_pb2.ApplyInventoryLogRequest(
                component_id=component_id,
                type=inventory_pb2.USE,
                quantity=2,
                box="Box A",
                reason="Lab session",
            ),
            metadata=metadata,
        )
        assert applied.HasField("success")
        assert applied.success.component.total_qty == 3
        assert applied.success.log.quantity == 2
    finally:
        await auth_service.delete_user(user_id)
