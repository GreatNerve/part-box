"""gRPC server bootstrap."""

import asyncio
import logging

from app.core.db import close_db, init_db
from app.core.settings import settings
from app.grpc.factory import create_server

logger = logging.getLogger(__name__)


async def serve() -> None:
    await init_db()

    server = create_server()
    listen_addr = f"{settings.grpc_host}:{settings.grpc_port}"
    server.add_insecure_port(listen_addr)

    await server.start()
    logger.info("gRPC server listening on %s", listen_addr)

    try:
        await server.wait_for_termination()
    finally:
        await server.stop(grace=5)
        await close_db()


def run() -> None:
    logging.basicConfig(level=logging.INFO)
    asyncio.run(serve())


if __name__ == "__main__":
    run()
