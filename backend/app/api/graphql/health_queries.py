import strawberry

from app.core.deployment import get_deployed_at_iso


@strawberry.type
class HealthStatus:
    status: str
    deployed_at: str


@strawberry.type
class HealthQuery:
    @strawberry.field
    def health(self) -> HealthStatus:
        return HealthStatus(status="ok", deployed_at=get_deployed_at_iso())
