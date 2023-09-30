from models.user import User
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
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


async def get_current_user(access_token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(access_token, JWT_SECRET, algorithms=[ALGORITHM])
        print(payload)
        if payload.get('scope') != "access":
            raise jwt.exceptions.DecodeError
        user = await User.get(username=payload.get('username'))
    except jwt.exceptions.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid token format or signature'
        )
    except jwt.exceptions.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid username or password'
        )

    return user
