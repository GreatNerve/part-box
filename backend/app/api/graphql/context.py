from uuid import UUID

from fastapi import Request
from strawberry.fastapi import BaseContext

from app.core.auth import decode_access_token, extract_bearer_token


class GraphQLContext(BaseContext):
    user_id: UUID | None = None

    def __init__(self, request: Request) -> None:
        super().__init__()
        self.request = request
        token = extract_bearer_token(request.headers.get("Authorization"))
        self.user_id = decode_access_token(token) if token else None


async def get_context(request: Request) -> GraphQLContext:
    return GraphQLContext(request=request)
