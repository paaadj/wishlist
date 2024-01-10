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


# /api/add_item testing


@pytest.mark.anyio
async def test_add_avg_item_to_wishlist(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    response_add = await client.post("/api/add_item", headers=headers, data=test_item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )

    # check that added item == item received from get_item
    assert response_add.json() == response_get.json()["items"][0]
    # add response code check
    assert response_add.status_code == 200


@pytest.mark.anyio
async def test_add_empty_string_title_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item["title"] = ""

    response_add = await client.post("/api/add_item", headers=headers, data=item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 422


@pytest.mark.anyio
async def test_add_empty_string_description_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item["description"] = ""

    response_add = await client.post("/api/add_item", headers=headers, data=item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 422


@pytest.mark.anyio
async def test_add_empty_string_link_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item["link"] = ""

    response_add = await client.post("/api/add_item", headers=headers, data=item)

    # add item response code check
    assert response_add.status_code == 200


@pytest.mark.anyio
async def test_add_none_title_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item.pop("title")

    response_add = await client.post("/api/add_item", headers=headers, data=item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 422


@pytest.mark.anyio
async def test_add_none_description_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item.pop("description")

    response_add = await client.post("/api/add_item", headers=headers, data=item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 422


@pytest.mark.anyio
async def test_add_none_link_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item.pop("link")

    response_add = await client.post("/api/add_item", headers=headers, data=item)
    # add item response code check
    assert response_add.status_code == 200


@pytest.mark.anyio
async def test_add_none_all_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item.pop("link")
    item.pop("description")
    item.pop("title")

    response_add = await client.post("/api/add_item", headers=headers, data=item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 422


@pytest.mark.anyio
async def test_add_item_without_data(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    item = test_item.copy()
    item.pop("link")
    item.pop("description")
    item.pop("title")

    response_add = await client.post("/api/add_item", headers=headers)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 422


@pytest.mark.anyio
async def test_add_item_without_auth(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)

    response_add = await client.post("/api/add_item", data=test_item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that items table does not contain item
    assert len(items) == 0
    # add item response code check
    assert response_add.status_code == 401


@pytest.mark.anyio
async def test_add_existing_item(client: AsyncClient):
    """
    add wishlist item test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    second_item = test_item.copy()

    await client.post("/api/add_item", headers=headers, data=test_item)
    response_add = await client.post("/api/add_item", headers=headers, data=second_item)

    response_get = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    items = response_get.json()["items"]
    # check that wishlist of user now have 2 items
    assert len(items) == 2
    # add item response code check
    assert response_add.status_code == 200


# /api/reserve testing

@pytest.mark.anyio
async def test_reserve_item_1_in_list(client: AsyncClient):
    """
    reserve item test
    """
    await client.post("/register", json=test_user)
    await client.post("/register", json=test_second_user)

    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers1 = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    add_response = await client.post("/api/add_item", headers=headers1, data=test_item)
    item_id = add_response.json()["id"]

    data_for_token = {"username": avg_second_username,
                      "password": avg_second_password}
    response_token = await client.post("/token", data=data_for_token)
    headers2 = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    reserve_response = await client.post(
        "/api/reserve", headers=headers2, params={"item_id": item_id}
    )

    get_item_response = await client.get("api/get_item", params={"item_id": item_id}, headers=headers2)

    # reserve response code check
    assert reserve_response.status_code == 200
    # check that reserved user id in the item response == user id that reserved item
    assert reserve_response.json()["reserved_user"] == 2
    # check that id in reserve response == item id
    assert reserve_response.json()["id"] == item_id
    # check that item from get_item response have reserved user id == user id that reserved item
    assert get_item_response.json()["reserved_user"] == 2


# /api/unreserve testing
@pytest.mark.anyio
async def test_unreserve_item_1_in_list(client: AsyncClient):
    """
    unreserve item test
    """
    await client.post("/register", json=test_user)
    await client.post("/register", json=test_second_user)

    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers1 = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    add_response = await client.post("/api/add_item", headers=headers1, data=test_item)

    item_id = add_response.json()["id"]

    data_for_token = {"username": avg_second_username,
                      "password": avg_second_password}
    response_token = await client.post("/token", data=data_for_token)
    headers2 = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    await client.post("/api/reserve", headers=headers2, params={"item_id": item_id})

    unreserve_response = await client.post(
        "/api/unreserve", headers=headers2, params={"item_id": item_id}
    )

    get_item_response = await client.get("api/get_item", params={"item_id": item_id})

    # unreserve response code check
    assert unreserve_response.status_code == 200
    # check that unreserve response reserved_user == None
    assert unreserve_response.json()["reserved_user"] == 0
    # check that unreserve response id == item id
    assert unreserve_response.json()["id"] == item_id
    # check that get item response for unreserved item doesn't have reserved user
    assert get_item_response.json()["reserved_user"] == 0


# /api/get_wishlist testing
@pytest.mark.anyio
async def test_get_empty_wishlist(client: AsyncClient):
    """
    user registration test
    """
    await client.post("/register", json=test_user)

    response = await client.get("/api/get_wishlist", params={"username": avg_username})
    # response code check
    assert response.status_code == 200


@pytest.mark.anyio
async def test_get_wishlist(client: AsyncClient):
    """
    user registration test
    """
    await client.post("/register", json=test_user)
    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}
    await client.post("/api/add_item", headers=headers, data=test_item)

    response = await client.get("/api/get_wishlist", params={"username": avg_username})
    items = response.json()["items"]
    # response code check
    assert response.status_code == 200
    # check that received wishlist have 1 item
    assert len(response.json()["items"]) == 1
    # check that received wishlist first item title == added item title
    assert items[0]["title"] == avg_title


# /api/delete testing

@pytest.mark.anyio
async def test_delete_item_1_in_list(client: AsyncClient):
    """
    delete item test
    """
    await client.post("/register", json=test_user)

    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers1 = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    add_response = await client.post("/api/add_item", headers=headers1, data=test_item)
    item_id = add_response.json()["id"]

    delete_response = await client.delete(f"/api/delete/{item_id}", headers=headers1)
    wishlist_response = await client.get(
        "/api/get_wishlist", params={"username": avg_username}
    )
    get_item_response = await client.get("/api/get_item", params={"item_id": item_id})

    # delete response code check
    assert delete_response.status_code == 200
    # check that wishlist items is now empty
    assert len(wishlist_response.json()["items"]) == 0
    # check that deleted item cannot be found in the items table
    assert get_item_response.status_code == 404


# /api/update_item testing

@pytest.mark.anyio
async def test_update_item(client: AsyncClient):
    """
    delete item test
    """
    await client.post("/register", json=test_user)

    data_for_token = {"username": avg_username, "password": avg_password}
    response_token = await client.post("/token", data=data_for_token)
    headers1 = {
        "Authorization": f"Bearer {response_token.json()['access_token']}"}

    add_response = await client.post("/api/add_item", headers=headers1, data=test_item)
    item_id = add_response.json()["id"]

    update_response = await client.put(
        "/api/update_item",
        headers=headers1,
        params={"item_id": item_id},
        data=test_second_item,
    )

    get_item_response = await client.get("/api/get_item", params={"item_id": item_id})

    # update response code check
    assert update_response.status_code == 200
    # checking that item title,des,link have changed
    assert get_item_response.json()["title"] == avg_second_title
    assert get_item_response.json()["description"] == avg_second_description
    assert get_item_response.json()["link"] == avg_second_link
