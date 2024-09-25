from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import JSONResponse
from app.Auth.auth  import ACCESS_TOKEN_EXPIRE, authenticate_user, \
get_current_user, create_access_token, auth, get_access_token_from_cookie, get_user_by_username, get_user_by_email
from app.schemas import UserLogin, Token, User
from app.database.session import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from loguru import logger
from fastapi.responses import HTMLResponse
from app.crud.users import get_user



router = APIRouter()

"""
@router.post("/login/", response_model=Token)
async def login(credentials: LoginCredentials, db: AsyncSession = Depends(get_db_session)):
    user = await authenticate_user(credentials.username, credentials.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message="Incorrect username and password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expire)
    return {"access_token": access_token, "token_type": "Bearer"}


@router.get("/user/me/", response_model=User)
async def user_me(current_user: User =  Depends(get_current_user)):
    return current_user
"""

@router.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <body>
            <h1>Welcome to the OpenID Connect Test</h1>
            <a href="/login">Login with Google</a>
        </body>
    </html>
    """

@router.post("/login")
async def login_route(user: UserLogin, db: AsyncSession = Depends(get_db_session)):
    logger.info("Initiating login process")
    
    # Look up user by username
    db_user = await get_user_by_username(user.username, db)
    
    # If user does not exist, raise an error
    if not db_user or db_user.email != user.email:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Prepare the data to encode in the JWT
    token_data = {
        "user": db_user.username,
        "email": db_user.email,
        "user_id": db_user.userid
    }

    # Create the access token, passing the dictionary as expected
    access_token = create_access_token(token_data)

    return {"access_token": access_token}



    

@router.get("/auth", name="auth")
async def auth_route(request: Request, db: AsyncSession = Depends(get_db_session)):
    logger.info("Handling auth callback")
    try:
        result = await auth(request, db)
        logger.info(f"redirecting to products page")
        return result
    except Exception as e:
        logger.error(f"Auth failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

"""
@router.get("/api/get-access-token")
async def get_access_token(
    request: Request,
    db: AsyncSession = Depends(get_db_session)
):
    try:
        access_token = await get_access_token_from_cookie(request)

        return JSONResponse(content={"access_token": access_token})
    except HTTPException as he:
        logger.error(f"HTTP error in get_access_token: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in get_access_token: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
"""

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    logger.info(f"Protected route accessed by user: {current_user['email']}")
    return {"name": {current_user['name']}, "email": {current_user['email']}}


@router.get("/api/logout")
async def logout(resp: Response):
    response = JSONResponse(content={"message": "Logged out successfully"})
    resp.delete_cookie("access_token")
    return response