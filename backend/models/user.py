"""
Models which needs for user
"""
import re
from typing import Optional

from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr, Field, AnyHttpUrl
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
    first_name = fields.CharField(
        max_length=30, validators=[MinLengthValidator(2)])
    last_name = fields.CharField(
        max_length=30, null=True, validators=[MinLengthValidator(2)]
    )
    image_filename = fields.CharField(max_length=50, null=True)
    image_url = fields.CharField(
        max_length=150,
        validators=[
            RegexValidator(
                r"^https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,63}\."
                r"[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&/=/]*)$",
                re.I,
            )
        ],
        null=True,
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
    user = fields.ForeignKeyField("models.User", on_delete=fields.CASCADE)


class UserCreate(BaseModel):
    """
    User creation model
    """

    username: str
    email: Optional[EmailStr] = None
    password: str
    first_name: str
    last_name: Optional[str] = None


class UserResponse(BaseModel):
    """
    User response model
    """

    id: int
    username: str
    email: Optional[EmailStr] = None
    first_name: str
    last_name: Optional[str] = None
    image_url: Optional[AnyHttpUrl] = None


class UserJWT(BaseModel):
    """
    user's data for jwt token
    """

    username: str
