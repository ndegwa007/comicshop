from app.models import Base
from app.database.session import sessionmanager
from loguru import logger
import asyncio


async def create_tables():
    logger.info("Starting table creation")
    retries = 5
    while retries > 0:
        try:
            async with sessionmanager.connection() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Tables created successfully")
        except Exception as e:
            logger.error(f"error creating tables: {str(e)}")
            raise
        retries -= 1
        asyncio.sleep(5)

    