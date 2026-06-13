"""gRPC integration tests — require PostgreSQL (see tests/conftest.py)."""

from __future__ import annotations

from uuid import UUID, uuid4

import grpc
import pytest
from v1 import auth_pb2, auth_pb2_grpc, inventory_pb2, inventory_pb2_grpc

from app.services import auth as auth_service


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
