from fastapi import APIRouter,  Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import User, UserCreate
from app.Auth.auth import get_user_by_username,  get_password_hash
from app.database.session import get_db_session
import app.crud.users as users
from ...Auth.auth import signup
from loguru import logger


router = APIRouter()



@router.get("/signup")
async def signup_route(request: Request):
    logger.info("Initiating login process")
    return await signup(request)
