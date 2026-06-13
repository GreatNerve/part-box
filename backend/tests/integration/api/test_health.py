from datetime import datetime

import pytest
from httpx import ASGITransport, AsyncClient

from app.api.main import app
from app.core.db import close_db, init_db


@pytest.fixture
async def client():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as async_client:
        yield async_client
    await close_db()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_health(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200

    payload = response.json()
    assert payload["status"] == "ok"
    assert "deployed_at" in payload

    deployed_at = datetime.fromisoformat(payload["deployed_at"].replace("Z", "+00:00"))
    assert deployed_at.tzinfo is not None


HEALTH_QUERY = """
query Health {
  health {
    status
    deployedAt
  }
}
"""


@pytest.mark.integration
@pytest.mark.asyncio
async def test_graphql_health(client: AsyncClient) -> None:
    response = await client.post("/graphql", json={"query": HEALTH_QUERY})
    assert response.status_code == 200

    payload = response.json()
    assert "errors" not in payload, payload.get("errors")

    health = payload["data"]["health"]
    assert health["status"] == "ok"
    assert health["deployedAt"]

    deployed_at = datetime.fromisoformat(health["deployedAt"].replace("Z", "+00:00"))
    assert deployed_at.tzinfo is not None
