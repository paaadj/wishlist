from models import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from config import settings

import jwt


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")
JWT_SECRET = settings.SECRET_KEY
ALGORITHM = 'HS256'


async def authenticate_user(username: str, password: str):
    user = await User.get(username=username)
    if not User:
        return False
    if not user.verify_password(password):
        return False
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user = await User.get(id=payload.get('id'))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )

    return user
