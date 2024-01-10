"""
Module containing tests
"""

import pytest
from httpx import AsyncClient
from tortoise.exceptions import ValidationError

from models.user import User


# average user details
avg_username = "mihaTest"
avg_email = "mihaTest@mail.ru"
avg_password = "bibis888"
avg_first_name = "Chris"
avg_last_name = "Wilson"

test_user = {
    "username": avg_username,
    "email": avg_email,
    "password": avg_password,
    "first_name": avg_first_name,
    "last_name": avg_last_name,
}

# average second_user details
avg_second_username = "mihaTest2"
avg_second_email = "mihaTest2@mail.ru"
avg_second_password = "bibis8882"
avg_second_first_name = "Chris2"
avg_second_last_name = "Wilson2"

test_second_user = {
    "username": avg_second_username,
    "email": avg_second_email,
    "password": avg_second_password,
    "first_name": avg_second_first_name,
    "last_name": avg_second_last_name,
}

# average wishlist item details
avg_title = "100 robux"
avg_description = "I want 100 robux from roblox game pls i need it"
avg_link = "https://funpay.com/chips/99/"

test_item = {"title": avg_title,
             "description": avg_description, "link": avg_link}

avg_second_title = "pizza"
avg_second_description = "I want 30cm florentino pizza for my birthday"
avg_second_link = "https://dodopizza.ru/orehovozuevo"

test_second_item = {
    "title": avg_second_title,
    "description": avg_second_description,
    "link": avg_second_link,
}

# /token testing
@pytest.mark.anyio
async def test_get_token_for_existing_user(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    data_for_registration = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }
    data_for_token = {"username": username, "password": password}
    await client.post("/register", json=data_for_registration)
    response = await client.post("/token", data=data_for_token)
    # response code check
    assert response.status_code == 200


@pytest.mark.anyio
async def test_get_token_for_non_existing_user(client: AsyncClient):
    """
    user registration test
    """
    username, password = ["mihaTest", "bibis"]
    data_for_token = {"username": username, "password": password}
    response = await client.post("/token", data=data_for_token)
    # response code check
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_get_token_for_wrong_password(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    data_for_token = {"username": username, "password": "nebibis"}
    data_for_registration = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }
    await client.post("/register", json=data_for_registration)
    response = await client.post("/token", data=data_for_token)
    # response code check
    assert 400 <= response.status_code < 500

# /register testing
@pytest.mark.anyio
async def test_register_user(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }
    response = await client.post("/register", json=data)
    data.pop("password")
    # response code check
    assert response.status_code == 200
    # check that added user is now in the user table
    assert await User.filter(username=username).count() == 1


@pytest.mark.anyio
async def test_testpost2(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }
    response = await client.post("/register", json=data)
    # response code check
    assert response.status_code == 200
    # check that added user is now in the user table
    assert await User.filter(username=username).count() == 1


@pytest.mark.anyio
async def test_register_empty_email(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    response = await client.post("/register", json=data)
    # check that added user is now not in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_empty_first_name(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    response = await client.post("/register", json=data)
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_empty_last_name(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    response = await client.post("/register", json=data)
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_empty_pass(client: AsyncClient):
    """
    user registration test
    """
    username, email, password = ["mihaTest", "mihaTest@mail.ru", ""]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    response = await client.post("/register", json=data)
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_empty_username(client: AsyncClient):
    """
    user registration test
    """
    username, email, password = ["", "mihaTest@mail.ru", "bibis888"]

    # check that user table doesn't contain users with that username
    with pytest.raises(ValidationError):
        assert await User.filter(username=username).count() == 0

    data = {"username": username, "email": email, "password": password}
    response = await client.post("/register", json=data)
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_existing_user(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    await client.post("/register", json=data)
    response = await client.post("/register", json=data)
    # check that user table already has that user
    assert await User.filter(username=username).count() == 1
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_existing_user_with_diff_pass(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    await client.post("/register", json=data)
    data = {"username": username, "email": email, "password": "nebibis"}
    response = await client.post("/register", json=data)
    # check that user table already has user with this username
    assert await User.filter(username=username).count() == 1
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_existing_user_with_diff_email(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    await client.post("/register", json=data)
    data = {"username": username,
            "email": "ChrisWilson@ggg.com", "password": "bibis"}
    response = await client.post("/register", json=data)
    # check that user table already has user with this username
    assert await User.filter(username=username).count() == 1
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500


@pytest.mark.anyio
async def test_register_same_email(client: AsyncClient):
    """
    user registration test
    """
    username, email, password, first_name, last_name = [
        "mihaTest",
        "mihaTest@mail.ru",
        "bibis888",
        "Chris",
        "Wilson",
    ]
    # check that user table doesn't contain users with that username
    assert await User.filter(username=username).count() == 0
    data = {
        "username": username,
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
    }

    await client.post("/register", json=data)
    data = {
        "username": "ChrisWilson",
        "email": "mihaTest@mail.ru",
        "password": "nebibis",
        "first_name": "Chris",
        "last_name": "Wilson",
    }
    response = await client.post("/register", json=data)
    # check that user table already has user with this username
    assert await User.filter(username=username).count() == 1
    # check that user table hasn't user with this username
    assert await User.filter(username="ChrisWilson").count() == 0
    # check that added user is now in the user table
    assert 400 <= response.status_code < 500