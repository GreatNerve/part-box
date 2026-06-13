import asyncio
from concurrent import futures

import grpc
from v1 import auth_pb2_grpc, health_pb2_grpc, inventory_pb2_grpc

from app.grpc.bootstrap import bind_event_loop
from app.grpc.servicers.auth import AuthServicer
from app.grpc.servicers.health import HealthServicer
from app.grpc.servicers.inventory import InventoryServicer


def register_servicers(server: grpc.aio.Server) -> None:
    auth_pb2_grpc.add_AuthServiceServicer_to_server(AuthServicer(), server)
    health_pb2_grpc.add_HealthServiceServicer_to_server(HealthServicer(), server)
    inventory_pb2_grpc.add_InventoryServiceServicer_to_server(InventoryServicer(), server)


def create_server(*, max_workers: int = 10) -> grpc.aio.Server:
    bind_event_loop(asyncio.get_running_loop())
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=max_workers))
    register_servicers(server)
    return server
