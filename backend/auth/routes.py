from fastapi import APIRouter, Header
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from .services import *
from models.user import User_Pydantic, UserCreate, User
from config import settings
from .token import create_access_token, create_refresh_token, TokenResponse, refresh_tokens

auth_router = APIRouter()
JWT_SECRET = settings.SECRET_KEY


@auth_router.post("/token", tags=["auth"], response_model=TokenResponse)
async def get_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )

    access_token = await create_access_token(user)
    refresh_token = await create_refresh_token(user)
    return {'access_token': access_token, 'refresh_token': refresh_token, 'token_type': 'bearer'}


@auth_router.post("/refresh_token", tags=["auth"], response_model=TokenResponse)
async def get_new_tokens(token: str = Header(...)):
    return await refresh_tokens(token)


@auth_router.post('/register', response_model=User_Pydantic, tags=["auth"])
async def create_user(user: UserCreate):
    user_obj = User(username=user.username, password=bcrypt.hash(user.password), email=user.email)
    await user_obj.save()
    return user_obj


@auth_router.get('/users/me', response_model=User_Pydantic, tags=["auth"])
async def get_user(user: User_Pydantic = Depends(get_current_user)):
    return user
