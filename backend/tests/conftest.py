import pytest
from httpx import ASGITransport, AsyncClient

from app.api.main import app
from app.core.db import close_db, init_db


@pytest.fixture
async def gql_client():
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    await close_db()
