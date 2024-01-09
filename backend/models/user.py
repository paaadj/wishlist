"""
Models which needs for user
"""
import datetime
import re
from typing import Optional

from passlib.hash import bcrypt
from pydantic import BaseModel, EmailStr, AnyHttpUrl
from tortoise import fields
from tortoise.validators import RegexValidator, MinLengthValidator
from tortoise.models import Model


class UserResponseAdmin(BaseModel):
    """
    User response for admins model
    """
    id: int
    username: str
    email: Optional[EmailStr] = None
    first_name: str
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    created_at: str
    is_admin: bool


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
    image_url = fields.CharField(
        max_length=150,
        null=True,
    )
    created_at = fields.DatetimeField(auto_now=True, null=True)
    is_admin = fields.BooleanField(default=False)

    def to_admin_response(self) -> UserResponseAdmin:
        response = UserResponseAdmin(
            id=self.id,
            username=self.username,
            email=self.email,
            first_name=self.first_name,
            last_name=self.last_name,
            image_url=self.image_url,
            created_at=self.created_at.__str__(),
            is_admin=self.is_admin,
        )
        return response

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
    expires_at = fields.DatetimeField()

    @classmethod
    async def clean_expired_tokens(cls):
        now = datetime.datetime.now()
        await cls.filter(expires_at__lt=now).delete()


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
    image_url: Optional[str] = None


class UsersListAdminResponse(BaseModel):
    users: list[UserResponseAdmin]
    per_page: int
    page: int
    total_item: int
    total_pages: int


class UserJWT(BaseModel):
    """
    user's data for jwt token
    """
    id: int
    username: str
