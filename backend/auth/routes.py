from fastapi import APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from passlib.hash import bcrypt
from .services import *
from models.user import User_Pydantic, UserCreate, User
from config import settings

auth_router = APIRouter()
JWT_SECRET = settings.SECRET_KEY


@auth_router.post("/token")
async def get_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )

    user_obj = await User_Pydantic.from_tortoise_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return {'access_token': token, 'token_type': 'bearer'}


@auth_router.post('/register', response_model=User_Pydantic)
async def create_user(user: UserCreate):
    user_obj = User(username=user.username, password=bcrypt.hash(user.password), email=user.email)
    await user_obj.save()
    return user_obj


@auth_router.get('/users/me', response_model=User_Pydantic)
async def get_user(user: User_Pydantic = Depends(get_current_user)):
    return user
