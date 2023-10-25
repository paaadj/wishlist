"""
Module containing tests
"""

import pytest
from httpx import AsyncClient
from tortoise.exceptions import ValidationError

from models.user import User


# /register testing
@pytest.mark.anyio
async def test_testpost(client: AsyncClient):
    """
    user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    assert await User.filter(username=username).count() == 0
    data = {"username": username, "email": email, "password": password}
    response = await client.post("/register", json=data)
    data.pop("password")
    assert response.json() == dict(data)
    assert response.status_code == 200

    assert await User.filter(username=username).count() == 1


@pytest.mark.anyio
async def test_register_empty_email(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "", "bibis888"]
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    response = await client.post("/register", json=data)

    assert 400 <= response.status_code < 500
    #assert await User.filter(username=username).count() == 0


@pytest.mark.anyio
async def test_register_empty_pass(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", ""]
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    response = await client.post("/register", json=data)

    print(response.status_code)

    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_empty_username(client: AsyncClient):

    """
    user registration test
    """
    await User.all().delete()
    username, email, password = ["", "mihaTest@mail.ru", "bibis888"]

    with pytest.raises(ValidationError):
        assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    response = await client.post("/register", json=data)

    print(response.status_code)
    assert 400 <= response.status_code < 500



@pytest.mark.anyio
async def test_register_existing_user(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    await client.post("/register", json=data)
    response = await client.post("/register", json=data)

    assert await User.filter(username=username).count() == 1
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_existing_user_with_diff_pass(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    await client.post("/register", json=data)
    data = {"username": username, "email": email, "password": "nebibis"}
    response = await client.post("/register", json=data)

    assert await User.filter(username=username).count() == 1
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_existing_user_with_diff_email(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    await client.post("/register", json=data)
    data = {"username": username, "email": "ChrisWilson@ggg.com", "password": "bibis"}
    response = await client.post("/register", json=data)

    assert await User.filter(username=username).count() == 1
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_same_email(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    await client.post("/register", json=data)
    data = {
        "username": "ChrisWilson",
        "email": "mihaTest@mail.ru",
        "password": "nebibis",
    }
    response = await client.post("/register", json=data)

    assert await User.filter(username=username).count() == 1
    assert await User.filter(username="ChrisWilson").count() == 0
    assert 400 <= response.status_code < 500


# /token testing
@pytest.mark.anyio
async def test_get_token_for_existing_user(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    data_for_registration = {"username": username, "email": email, "password": password}
    data_for_token = {"username": username, "password": password}
    await client.post("/register", json=data_for_registration)
    response = await client.post("/token", data=data_for_token)
    assert response.status_code == 200


@pytest.mark.anyio
async def test_get_token_for_non_existing_user(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, password = ["mihaTest",  "bibis"]
    data_for_token = {"username": username, "password": password}
    response = await client.post("/token", data=data_for_token)
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_get_token_for_wrong_password(client: AsyncClient):
    """
        user registration test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    data_for_token = {"username": username, "password": "nebibis"}
    data_for_registration = {"username": username, "email": email, "password": password}
    await client.post("/register", json=data_for_registration)
    response = await client.post("/token", data=data_for_token)
    assert 400 <= response.status_code < 500


# get user testing
@pytest.mark.anyio
async def test_get_me(client: AsyncClient):
    """
        get user test
    """
    await User.all().delete()
    username, email, password = ["mihaTest", "mihaTest@mail.ru", "bibis888"]
    data_for_registration = {"username": username, "email": email, "password": password}
    data_for_token = {"username": username, "password": password}
    await client.post("/register", json=data_for_registration)
    response_token = await client.post("/token", data=data_for_token)
    get_headers = {"Authorization": f"Bearer {response_token.json()['access_token']}"}
    response_get = await client.get("/users/me", headers=get_headers)
    assert response_get.status_code == 200
    assert response_get.json()["username"] == "mihaTest"
