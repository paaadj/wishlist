"""
Test config
"""

import pytest
from httpx import AsyncClient
from tortoise import Tortoise
from main import app
from config import settings


DB_URL = "sqlite://:memory:"


async def init_db(db_url, create_db: bool = False, schemas: bool = False) -> None:
    """Initial database connection"""
    await Tortoise.init(db_url=db_url, modules={"models": settings.MODULE_LIST})
    if create_db:
        # print(f"Database created! {db_url = }")
        pass
    if schemas:
        await Tortoise.generate_schemas()
        # print("Success to generate schemas")


# pylint: disable=missing-function-docstring
async def init(db_url: str = DB_URL):
    await init_db(db_url, True, True)


# pylint: disable=missing-function-docstring
@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


# pylint: disable=missing-function-docstring
@pytest.fixture(scope="session")
async def client():
    async with AsyncClient(app=app, base_url="http://127.0.0.1:8000") as client_inside:
        print("Client is ready")
        yield client_inside


# pylint: disable=missing-function-docstring
@pytest.fixture(scope="function", autouse=True)
async def initialize_tests():
    await init()
    yield
    # for model in Tortoise.apps.get('models').keys():
    #     query = DeleteQuery(model=model)
    #     await query.delete()
    await Tortoise._drop_databases()
