from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID NOT NULL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "categories" (
    "id" UUID NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "is_default" BOOL NOT NULL DEFAULT False,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_categories_user_id_7f9e4d" UNIQUE ("user_id", "name")
);
CREATE TABLE IF NOT EXISTS "components" (
    "id" UUID NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "datasheet_url" VARCHAR(2048),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" UUID NOT NULL REFERENCES "categories" ("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_components_user_id_373417" UNIQUE ("user_id", "name")
);
CREATE TABLE IF NOT EXISTS "component_box_quantities" (
    "id" UUID NOT NULL PRIMARY KEY,
    "box" VARCHAR(255) NOT NULL,
    "quantity" INT NOT NULL DEFAULT 0,
    "component_id" UUID NOT NULL REFERENCES "components" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_component_b_compone_46f617" UNIQUE ("component_id", "box")
);
CREATE TABLE IF NOT EXISTS "inventory_logs" (
    "id" UUID NOT NULL PRIMARY KEY,
    "type" VARCHAR(32) NOT NULL,
    "quantity" INT NOT NULL,
    "box" VARCHAR(255) NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "component_id" UUID NOT NULL REFERENCES "components" ("id") ON DELETE CASCADE,
    "related_log_id" UUID REFERENCES "inventory_logs" ("id") ON DELETE CASCADE,
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE
);
COMMENT ON COLUMN "inventory_logs"."type" IS 'ADD_STOCK: ADD_STOCK\nUSE: USE\nRETURN: RETURN\nLOST: LOST\nBURN: BURN\nDEFECTIVE: DEFECTIVE';
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "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"
)
