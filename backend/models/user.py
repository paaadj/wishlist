from tortoise.models import Model
from pydantic import BaseModel
from typing import Optional
from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from passlib.hash import bcrypt


class User(Model):
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


class RefreshToken(Model):
    id = fields.IntField(pk=True)
    token = fields.CharField(max_length=255, unique=True)
    user = fields.OneToOneField("models.User", on_delete=fields.CASCADE)


class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str


User_Pydantic = pydantic_model_creator(User, name="User", include=("username", "email",))
