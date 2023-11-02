# """
# Module containing API routes and handlers
# """
#
#
# from fastapi import APIRouter, HTTPException, Depends
# from models.user import UserPydantic
# from auth.services import get_current_user
#
# from models.item import Item, item_create, item_response
#
# router = APIRouter()
#
#
# @router.post("/create_item", response_model=item_response, tags=["item"])
# async def create_item(item: item_create, user: UserPydantic = Depends(get_current_user),):
#     """
#     Create an item
#
#     :param item: Item to create
#     :return: Item if valid data or error
#     """
#     new_item = await Item.create(**item.model_dump())
#     return new_item
#
#
# @router.get("/get_item", response_model=list[item_response], tags=["item"])
# async def get_item():
#     """
#     Get list of all items
#
#     :return: List of all items
#     """
#     items = await Item.all()
#     return items
#
#
# @router.get("/get_item/{item_id}", response_model=item_response, tags=["item"])
# async def get_item_via_id(item_id: int):
#     """
#     Get item via id
#
#     :param item_id: id of item to get
#     :return: item if exists  or error
#     """
#     item = await Item.get_or_none(id=item_id)
#     if item is None:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return item
#
#
# @router.put("/update_item/{item_id}", response_model=item_response, tags=["item"])
# async def update_item(item_id: int, item_update: item_create):
#     """
#     update item with id item_id with item_update info
#
#     :param item_id: id of item to update
#     :param item_update: item info
#     :return: item if updated or error
#     """
#     item = await Item.get_or_none(id=item_id)
#     if item is None:
#         raise HTTPException(status_code=404, detail="Item doesn't exist")
#
#     for field, value in item_update.dict().items():
#         setattr(item, field, value)
#     await item.save()
#
#     return item
#
#
# @router.delete("/delete/{item_id}", response_model=item_response, tags=["item"])
# async def delete_item(item_id: int):
#     """
#     Delete item with id item_id
#     :param item_id: id of item to delete
#     :return: deleted item if existed or error
#     """
#     item = await Item.get_or_none(id=item_id)
#     if item is None:
#         raise HTTPException(status_code=404, detail="Item not found")
#
#     await Item.delete(item)
#     return item
