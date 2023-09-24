from tortoise.models import Model
from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator


class Item(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=50, null=False)

    def __str__(self):
        return self.title


item_create = pydantic_model_creator(Item, name="Item", exclude=("id",))
item_response = pydantic_model_creator(Item, name="ItemResponse")
