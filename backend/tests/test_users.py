"""
Module containing tests
"""

import pytest
from httpx import AsyncClient


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

# users/me testing
@pytest.mark.anyio
async def test_get_me(client: AsyncClient):
    """
    get user test
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
    response_token = await client.post("/token", data=data_for_token)
    get_headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}
    response_get = await client.get("/users/me", headers=get_headers)
    # response code check
    assert response_get.status_code == 200
    # check that received user have auth user username
    assert response_get.json()["username"] == "mihaTest"