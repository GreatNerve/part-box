import asyncio
from concurrent import futures

import grpc
import pytest

from app.core.db import close_db, init_db
from app.grpc.bootstrap import bind_event_loop
from app.grpc.factory import register_servicers


@pytest.fixture
async def grpc_server():
    await init_db()
    bind_event_loop(asyncio.get_running_loop())

    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=4))
    register_servicers(server)
    port = server.add_insecure_port("127.0.0.1:0")
    await server.start()

    yield f"127.0.0.1:{port}"

    await server.stop(grace=0)
    await close_db()


@pytest.fixture
async def grpc_channel(grpc_server):
    async with grpc.aio.insecure_channel(grpc_server) as channel:
        yield channel
