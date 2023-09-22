from fastapi import FastAPI, HTTPException, APIRouter
from tortoise import Tortoise
from config import settings
from models import *
from typing import List

app = FastAPI()

router = APIRouter(prefix="/api")


@router.on_event("startup")
async def init():
    await Tortoise.init(
        db_url=settings.DATABASE_URL,
        modules={"models": ["models"]}
    )
    await Tortoise.generate_schemas()


@router.on_event("shutdown")
async def shutdown_db():
    await Tortoise.close_connections()


@router.post("/create_item", response_model=item_response)
async def create_item(item: item_create):
    new_item = await Item.create(**item.dict())
    return new_item


@router.get("/get_item", response_model=List[item_response])
async def get_item():
    items = await Item.all()
    return items


@router.get("/get_item/{item_id}", response_model=item_response)
async def get_item_via_id(item_id: int):
    item = await Item.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.put("/update_item/{item_id}", response_model=item_response)
async def update_item(item_id: int, item_update: item_create):
    item = await Item.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item doesn't exist")

    for field, value in item_update.dict().items():
        setattr(item, field, value)
    await item.save()

    return item


@router.delete("/delete/{item_id}", response_model=item_response)
async def delete_item(item_id: int):
    item = await Item.get_or_none(id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    await Item.delete(item)
    return item


app.include_router(router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000)
