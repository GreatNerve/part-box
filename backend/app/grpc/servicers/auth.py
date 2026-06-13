import grpc
from v1 import auth_pb2, auth_pb2_grpc

from app.grpc.bootstrap import run_async
from app.grpc.errors import GrpcAbort
from app.schemas.user import LoginInput, RegisterInput, ValidationErrorDTO
from app.services import auth as auth_service


def _auth_response(result) -> auth_pb2.AuthResponse:
    return auth_pb2.AuthResponse(
        token=result.token,
        user=auth_pb2.UserMessage(
            id=str(result.user.id),
            email=result.user.email,
            display_name=result.user.display_name or "",
        ),
    )


class AuthServicer(auth_pb2_grpc.AuthServiceServicer):
    def Register(self, request, context):
        try:
            return run_async(self._register(request))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    def Login(self, request, context):
        try:
            return run_async(self._login(request))
        except GrpcAbort as exc:
            context.abort(exc.code, exc.details)

    async def _register(self, request):
        try:
            input_data = RegisterInput(
                email=request.email,
                password=request.password,
                display_name=request.display_name or None,
            )
        except Exception as exc:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, str(exc)) from exc

        result = await auth_service.register(input_data)
        if isinstance(result, ValidationErrorDTO):
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, result.message)
        return _auth_response(result)

    async def _login(self, request):
        try:
            input_data = LoginInput(email=request.email, password=request.password)
        except Exception as exc:
            raise GrpcAbort(grpc.StatusCode.INVALID_ARGUMENT, str(exc)) from exc

        result = await auth_service.login(input_data)
        if isinstance(result, ValidationErrorDTO):
            raise GrpcAbort(grpc.StatusCode.UNAUTHENTICATED, result.message)
        return _auth_response(result)
