"""gRPC runtime helpers: generated stub import path + async bridge for sync servicers."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

_GEN_ROOT = Path(__file__).resolve().parent / "gen"
if str(_GEN_ROOT) not in sys.path:
    sys.path.insert(0, str(_GEN_ROOT))

_loop: asyncio.AbstractEventLoop | None = None


def bind_event_loop(loop: asyncio.AbstractEventLoop) -> None:
    global _loop
    _loop = loop


def run_async(coro):
    if _loop is None:
        raise RuntimeError("gRPC event loop not bound")
    return asyncio.run_coroutine_threadsafe(coro, _loop).result(timeout=30)
