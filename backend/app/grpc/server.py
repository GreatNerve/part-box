"""gRPC server bootstrap — servicers expanded in follow-up tasks."""

from concurrent import futures
import logging

import grpc

from app.core.db import close_db, init_db
from app.core.settings import settings

logger = logging.getLogger(__name__)


async def _startup() -> None:
    await init_db()


async def _shutdown() -> None:
    await close_db()


def run() -> None:
    logging.basicConfig(level=logging.INFO)

    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    listen_addr = f"{settings.grpc_host}:{settings.grpc_port}"
    server.add_insecure_port(listen_addr)

    async def serve() -> None:
        await _startup()
        logger.info("gRPC server listening on %s", listen_addr)
        await server.start()
        await server.wait_for_termination()

    import asyncio

    try:
        asyncio.run(serve())
    finally:
        asyncio.run(_shutdown())


if __name__ == "__main__":
    run()
