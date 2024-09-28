from app.api.routes.router import base_router as router
from app.database.session import sessionmanager
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database.tables import create_tables
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os
import secrets
from loguru import logger

@asynccontextmanager
async def lifespan(_app: FastAPI):
    """
    Handles startup and shutdown events for the FastAPI application.
    """
    try:
        # Create tables on startup
        await create_tables()
        logger.info("Tables created successfully.")
        
        yield  # Important: allows the application to run
        
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise  # Raise the exception to prevent the app from starting

    finally:
        # Cleanup: close the database engine on shutdown
        if sessionmanager.engine is not None:
            await sessionmanager.close()
            logger.info("Database engine closed.")

app = FastAPI(lifespan=lifespan)
app.include_router(router)

session_secrets = secrets.token_urlsafe(16)
app.add_middleware(SessionMiddleware, secret_key=session_secrets, max_age=3600, https_only=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321", "http://localhost:4321/login", "https://swiftyapp-six.vercel.app/"],
    allow_credentials="True",
    allow_methods=["*"],
    allow_headers=["*"]
)

