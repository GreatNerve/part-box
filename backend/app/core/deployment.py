from datetime import UTC, datetime

from app.core.settings import settings

_started_at = datetime.now(UTC)


def get_deployed_at() -> datetime:
    if settings.deployed_at:
        raw = settings.deployed_at.strip()
        if raw.endswith("Z"):
            raw = f"{raw[:-1]}+00:00"
        return datetime.fromisoformat(raw).astimezone(UTC)
    return _started_at


def get_deployed_at_iso() -> str:
    return get_deployed_at().strftime("%Y-%m-%dT%H:%M:%SZ")
