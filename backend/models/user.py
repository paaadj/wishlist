"""
Models which needs for user
"""
import re
from typing import Optional

from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr, Field
from tortoise import fields
from tortoise.validators import RegexValidator, MinLengthValidator
from tortoise.models import Model


class User(Model):
    """
    User model
    """

    id = fields.IntField(pk=True)
    username = fields.CharField(
        max_length=255, unique=True, validators=[MinLengthValidator(8)]
    )
    email = fields.CharField(
        max_length=255,
        unique=True,
        null=True,
        validators=[
            RegexValidator(
                r"^([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+$",
                re.I,
            )
        ],
    )
    password = fields.CharField(max_length=255)
    first_name = fields.CharField(max_length=30, validators=[MinLengthValidator(2)])
    last_name = fields.CharField(
        max_length=30, null=True, validators=[MinLengthValidator(2)]
    )

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
    token = fields.TextField()
    user = fields.OneToOneField("models.User", on_delete=fields.CASCADE)


class UserCreate(BaseModel):
    """
    User creation model
    """

    username: str
    email: Optional[EmailStr] = None
    password: str
    first_name: str
    last_name: Optional[str] = None


class UserPydantic(BaseModel):
    """
    User response model
    """
    id: int
    username: str
    email: Optional[EmailStr] = None
    first_name: str
    last_name: Optional[str] = None
