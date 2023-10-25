"""
Models which needs for user
"""
import re
from typing import Optional

from passlib.hash import bcrypt
from pydantic import BaseModel
from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from tortoise.validators import RegexValidator, MinLengthValidator
from tortoise.models import Model


class User(Model):
    """
    User model
    """

    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=255, unique=True, validators=[MinLengthValidator(8)])
    email = fields.CharField(
        max_length=255,
        unique=True,
        null=True,
        validators=[RegexValidator(r"^\S+@\S+\.\S+$", re.I)],
    )
    password = fields.CharField(max_length=255)

    def __str__(self):
        return self.username

    # pylint: disable=missing-function-docstring
    def verify_password(self, password):
        return bcrypt.verify(password, self.password)

    # pylint: disable=missing-class-docstring, too-few-public-methods
    class Meta:
        table = "users"


class RefreshToken(Model):
    """
    User refresh token model
    """

    id = fields.IntField(pk=True)
    token = fields.CharField(max_length=255, unique=True)
    user = fields.OneToOneField("models.User", on_delete=fields.CASCADE)


class UserCreate(BaseModel):
    """
    User creation model
    """

    username: str
    email: Optional[str] = None
    password: str


User_Pydantic = pydantic_model_creator(
    User,
    name="User",
    exclude=(
        "id",
        "password",
    ),
)
