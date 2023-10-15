from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `users` DROP COLUMN `first_name`;
        ALTER TABLE `users` DROP COLUMN `last_name`;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE `users` ADD `first_name` VARCHAR(255) NOT NULL;
        ALTER TABLE `users` ADD `last_name` VARCHAR(255) NOT NULL;"""
