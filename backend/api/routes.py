from fastapi import APIRouter, HTTPException
from models.item import Item, item_create, item_response
from typing import List


router = APIRouter()


@router.post("/create_item", response_model=item_response, tags=["item"])
async def create_item(item: item_create):
    new_item = await Item.create(**item.dict())
    return new_item


@router.get("/get_item", response_model=List[item_response], tags=["item"])
async def get_item():
    items = await Item.all()
    return items


@router.get("/get_item/{item_id}", response_model=item_response, tags=["item"])
async def get_item_via_id(item_id: int):
    item = await Item.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/update_item/{item_id}", response_model=item_response, tags=["item"])
async def update_item(item_id: int, item_update: item_create):
    item = await Item.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item doesn't exist")

    for field, value in item_update.dict().items():
        setattr(item, field, value)
    await item.save()

    return item


@router.delete("/delete/{item_id}", response_model=item_response, tags=["item"])
async def delete_item(item_id: int):
    item = await Item.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    await Item.delete(item)
    return item
