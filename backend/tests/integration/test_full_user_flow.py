"""Full user lifecycle integration test.

Creates a user, exercises GraphQL API, then deletes the user from the database.

Run:
  docker compose -f docker/docker-compose.db.yml up -d
  cd backend && uv run pytest tests/integration/test_full_user_flow.py -v

Or:
  cd backend && uv run python scripts/test_user_flow.py
"""

from __future__ import annotations

from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.models import Category, Component, InventoryLog, User
from app.services import auth as auth_service


async def gql(
    client: AsyncClient,
    query: str,
    variables: dict | None = None,
    token: str | None = None,
) -> dict:
    headers = {"Authorization": f"Bearer {token}"} if token else {}
    response = await client.post(
        "/graphql",
        json={"query": query, "variables": variables or {}},
        headers=headers,
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    assert "errors" not in payload, payload.get("errors")
    return payload["data"]


REGISTER = """
mutation Register($input: RegisterInputGQL!) {
  register(input: $input) {
    ... on AuthPayload {
      token
      user { id email displayName }
    }
    ... on ValidationErrorType {
      code
      message
    }
  }
}
"""

LOGIN = """
mutation Login($input: LoginInputGQL!) {
  login(input: $input) {
    ... on AuthPayload {
      token
      user { id email }
    }
    ... on ValidationErrorType {
      code
      message
    }
  }
}
"""

CATEGORIES = """
query Categories {
  categories { id name isDefault }
}
"""

CREATE_CATEGORY = """
mutation CreateCategory($input: CreateCategoryInputGQL!) {
  createCategory(input: $input) {
    ... on CategoryType { id name isDefault }
    ... on ValidationErrorType { code message }
  }
}
"""

CREATE_COMPONENT = """
mutation CreateComponent($input: CreateComponentInputGQL!) {
  createComponent(input: $input) {
    ... on ComponentType {
      id
      name
      totalQty
      boxQuantities { box quantity }
    }
    ... on ValidationErrorType { code message }
  }
}
"""

COMPONENTS = """
query Components($filter: ComponentFilterInputGQL, $pagination: PaginationInputGQL) {
  components(filter: $filter, pagination: $pagination) {
    totalCount
    items { id name totalQty categoryName }
  }
}
"""

COMPONENT = """
query Component($id: ID!) {
  component(id: $id) {
    id
    name
    totalQty
    datasheetUrl
    boxQuantities { box quantity }
  }
}
"""

UPDATE_COMPONENT = """
mutation UpdateComponent($input: UpdateComponentInputGQL!) {
  updateComponent(input: $input) {
    ... on ComponentType { id name datasheetUrl }
    ... on ValidationErrorType { code message }
  }
}
"""

APPLY_LOG = """
mutation ApplyLog($input: ApplyInventoryLogInputGQL!) {
  applyInventoryLog(input: $input) {
    ... on ApplyInventoryLogSuccess {
      log { id type quantity box relatedLogId }
      component { id totalQty boxQuantities { box quantity } }
    }
    ... on ValidationErrorType { code message }
  }
}
"""

COMPONENT_LOGS = """
query ComponentLogs($componentId: ID!, $pagination: PaginationInputGQL) {
  componentLogs(componentId: $componentId, pagination: $pagination) {
    totalCount
    items { id type quantity box reason relatedLogId }
  }
}
"""

DELETE_COMPONENT = """
mutation DeleteComponent($id: ID!) {
  deleteComponent(id: $id) {
    ... on DeleteComponentSuccess { deleted }
    ... on ValidationErrorType { code message }
  }
}
"""

ME = """
query Me {
  me { id email displayName }
}
"""


@pytest.mark.integration
@pytest.mark.asyncio
async def test_full_user_lifecycle(gql_client: AsyncClient) -> None:
    email = f"flow-{uuid4()}@example.com"
    password = "test-password-123"
    user_id: str | None = None
    token: str | None = None

    try:
        # Register
        register_data = await gql(
            gql_client,
            REGISTER,
            {"input": {"email": email, "password": password, "displayName": "Flow Test"}},
        )
        register_result = register_data["register"]
        assert register_result.get("token"), register_result
        token = register_result["token"]
        user_id = register_result["user"]["id"]
        assert register_result["user"]["email"] == email

        # Login
        login_data = await gql(
            gql_client,
            LOGIN,
            {"input": {"email": email, "password": password}},
        )
        assert login_data["login"]["token"]

        # Me
        me_data = await gql(gql_client, ME, token=token)
        assert me_data["me"]["email"] == email

        # Default categories seeded
        categories_data = await gql(gql_client, CATEGORIES, token=token)
        categories = categories_data["categories"]
        assert len(categories) == 7
        sensor_category = next(item for item in categories if item["name"] == "Sensor")

        # Custom category
        custom_category = await gql(
            gql_client,
            CREATE_CATEGORY,
            {"input": {"name": "Custom Lab"}},
            token=token,
        )
        assert custom_category["createCategory"]["name"] == "Custom Lab"

        # Create component with stock in two boxes
        created = await gql(
            gql_client,
            CREATE_COMPONENT,
            {
                "input": {
                    "name": "DHT22",
                    "categoryId": sensor_category["id"],
                    "datasheetUrl": "https://example.com/dht22.pdf",
                    "initialBoxQuantities": [
                        {"box": "Box 1", "quantity": 5},
                        {"box": "Box 2", "quantity": 3},
                    ],
                }
            },
            token=token,
        )
        component = created["createComponent"]
        assert component["name"] == "DHT22"
        assert component["totalQty"] == 8
        component_id = component["id"]

        # List + filter
        listed = await gql(
            gql_client,
            COMPONENTS,
            {
                "filter": {"search": "DHT", "box": "Box 1"},
                "pagination": {"limit": 10, "offset": 0},
            },
            token=token,
        )
        assert listed["components"]["totalCount"] == 1

        # Detail
        detail = await gql(gql_client, COMPONENT, {"id": component_id}, token=token)
        assert detail["component"]["totalQty"] == 8

        # Use stock
        used = await gql(
            gql_client,
            APPLY_LOG,
            {
                "input": {
                    "componentId": component_id,
                    "type": "USE",
                    "quantity": 2,
                    "box": "Box 1",
                    "reason": "IoT lab",
                }
            },
            token=token,
        )
        use_log_id = used["applyInventoryLog"]["log"]["id"]
        assert used["applyInventoryLog"]["component"]["totalQty"] == 6

        # Return partial
        returned = await gql(
            gql_client,
            APPLY_LOG,
            {
                "input": {
                    "componentId": component_id,
                    "type": "RETURN",
                    "quantity": 1,
                    "box": "Box 1",
                    "relatedLogId": use_log_id,
                    "reason": "Unused",
                }
            },
            token=token,
        )
        assert returned["applyInventoryLog"]["component"]["totalQty"] == 7

        # Lost
        lost = await gql(
            gql_client,
            APPLY_LOG,
            {
                "input": {
                    "componentId": component_id,
                    "type": "LOST",
                    "quantity": 1,
                    "box": "Box 2",
                    "reason": "Missing",
                }
            },
            token=token,
        )
        assert lost["applyInventoryLog"]["component"]["totalQty"] == 6

        # Add stock
        added = await gql(
            gql_client,
            APPLY_LOG,
            {
                "input": {
                    "componentId": component_id,
                    "type": "ADD_STOCK",
                    "quantity": 4,
                    "box": "Box 1",
                    "reason": "Reorder",
                }
            },
            token=token,
        )
        assert added["applyInventoryLog"]["component"]["totalQty"] == 10

        # Logs history
        logs = await gql(
            gql_client,
            COMPONENT_LOGS,
            {"componentId": component_id, "pagination": {"limit": 20, "offset": 0}},
            token=token,
        )
        assert logs["componentLogs"]["totalCount"] >= 5

        # Update component
        updated = await gql(
            gql_client,
            UPDATE_COMPONENT,
            {
                "input": {
                    "id": component_id,
                    "name": "DHT22 Sensor",
                    "datasheetUrl": "https://example.com/dht22-v2.pdf",
                }
            },
            token=token,
        )
        assert updated["updateComponent"]["name"] == "DHT22 Sensor"

        # Insufficient stock should return validation union (not GraphQL error)
        insufficient_response = await gql_client.post(
            "/graphql",
            json={
                "query": APPLY_LOG,
                "variables": {
                    "input": {
                        "componentId": component_id,
                        "type": "USE",
                        "quantity": 999,
                        "box": "Box 1",
                        "reason": "Too many",
                    }
                },
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        insufficient_payload = insufficient_response.json()
        assert "errors" not in insufficient_payload
        validation = insufficient_payload["data"]["applyInventoryLog"]
        assert validation["code"] == "INSUFFICIENT_STOCK"

        # Delete component
        deleted = await gql(
            gql_client,
            DELETE_COMPONENT,
            {"id": component_id},
            token=token,
        )
        assert deleted["deleteComponent"]["deleted"] is True

    finally:
        if user_id:
            assert await auth_service.delete_user(user_id)
            assert not await User.filter(id=user_id).exists()
            assert await Category.filter(user_id=user_id).count() == 0
            assert await Component.filter(user_id=user_id).count() == 0
            assert await InventoryLog.filter(user_id=user_id).count() == 0
