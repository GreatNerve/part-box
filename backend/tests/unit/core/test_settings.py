from app.core.settings import Settings


def test_cors_origins_list_parses_csv() -> None:
    settings = Settings(cors_origins="http://localhost:3000, http://localhost:5173")
    assert settings.cors_origins_list == [
        "http://localhost:3000",
        "http://localhost:5173",
    ]
