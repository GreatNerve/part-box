from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "categories" ADD "low_stock_threshold" INT NOT NULL DEFAULT 5;
        ALTER TABLE "inventory_logs" ADD "from_box" VARCHAR(255);
        COMMENT ON COLUMN "inventory_logs"."type" IS 'ADD_STOCK: ADD_STOCK
USE: USE
RETURN: RETURN
LOST: LOST
BURN: BURN
DEFECTIVE: DEFECTIVE
REALLOCATE: REALLOCATE';"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "categories" DROP COLUMN "low_stock_threshold";
        ALTER TABLE "inventory_logs" DROP COLUMN "from_box";
        COMMENT ON COLUMN "inventory_logs"."type" IS 'ADD_STOCK: ADD_STOCK
USE: USE
RETURN: RETURN
LOST: LOST
BURN: BURN
DEFECTIVE: DEFECTIVE';"""


MODELS_STATE = (
    "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"
)
