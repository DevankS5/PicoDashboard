from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config import settings


_client: AsyncIOMotorClient | None = None


async def init_db(document_models: list):
    global _client
    _client = AsyncIOMotorClient(settings.mongodb_url)
    db = _client.get_default_database()
    await init_beanie(database=db, document_models=document_models)


async def close_db():
    global _client
    if _client is not None:
        _client.close()
