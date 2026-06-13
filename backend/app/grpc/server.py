"""gRPC server bootstrap."""

import asyncio
import logging
import signal
import sys

from app.core.db import close_db, init_db
from app.core.settings import settings
from app.grpc import bootstrap as _grpc_bootstrap  # noqa: F401 — adds gen/ to sys.path
from app.grpc.factory import create_server

logger = logging.getLogger(__name__)


def _register_shutdown(stop_event: asyncio.Event) -> None:
    def _request_stop(*_args: object) -> None:
        stop_event.set()

    if sys.platform == "win32":
        signal.signal(signal.SIGINT, _request_stop)
        signal.signal(signal.SIGTERM, _request_stop)
        return

    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, _request_stop)


async def serve() -> None:
    await init_db()

    server = create_server()
    listen_addr = f"{settings.grpc_host}:{settings.grpc_port}"
    server.add_insecure_port(listen_addr)

    await server.start()
    logger.info("gRPC server listening on %s", listen_addr)

    stop_event = asyncio.Event()
    _register_shutdown(stop_event)

    try:
        await stop_event.wait()
    finally:
        logger.info("Shutting down gRPC server...")
        try:
            await server.stop(grace=5)
        except asyncio.CancelledError:
            pass
        except Exception:
            logger.exception("Error while stopping gRPC server")
        await close_db()


def run() -> None:
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        logger.info("Stopped.")


if __name__ == "__main__":
    run()
