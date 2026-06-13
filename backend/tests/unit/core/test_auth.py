import pytest

from app.core.auth import create_access_token, decode_access_token, hash_password, verify_password


def test_hash_and_verify_password() -> None:
    hashed = hash_password("secret-password")
    assert verify_password("secret-password", hashed)
    assert not verify_password("wrong-password", hashed)


def test_jwt_round_trip() -> None:
    from uuid import uuid4

    user_id = uuid4()
    token = create_access_token(user_id)
    decoded = decode_access_token(token)
    assert decoded == user_id


def test_jwt_invalid_token_returns_none() -> None:
    assert decode_access_token("not-a-token") is None
