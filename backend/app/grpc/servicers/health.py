from v1 import health_pb2, health_pb2_grpc

from app.core.deployment import get_deployed_at_iso


class HealthServicer(health_pb2_grpc.HealthServiceServicer):
    def Check(self, request, context):
        return health_pb2.HealthCheckResponse(
            status="ok",
            deployed_at=get_deployed_at_iso(),
        )
