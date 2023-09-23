from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from passlib.hash import bcrypt
from typing import Optional
from pydantic import BaseModel


class User(models.Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=255, unique=True)
    email = fields.CharField(max_length=255, unique=True, null=True)
    password = fields.CharField(max_length=255)

    def __str__(self):
        return self.username

    def verify_password(self, password):
        return bcrypt.verify(password, self.password)

    class Meta:
        table = "users"


class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str


User_Pydantic = pydantic_model_creator(User, name="User")


class Item(models.Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=50, null=False)

    def __str__(self):
        return self.title


item_create = pydantic_model_creator(Item, name="Item", exclude=("id",))
item_response = pydantic_model_creator(Item, name="ItemResponse")
